import Web3 from "web3";

import { PRESALE_ABI } from "../abi/presaleAbi";
import { TOKEN_ABI } from "../abi/tokenAbi";
import { USDT_ABI } from "../abi/usdtAbi";
import { VESTING_ABI } from "../abi/vestingAbi";
import { modal } from "../config/appkit.js";
import { CONFIG } from "../config/config";

// ── WalletConnect provider (persisted across calls) ──────────────────────────
let _wcProvider = null;

// Extracts a readable revert reason from a web3/ethers error object
function extractRevertReason(err) {
  // web3 v4 stores revert reasons across multiple nested paths — collect them all
  const candidates = [
    // web3 v4: cause.data.message contains the actual reason string
    err?.cause?.data?.message,
    err?.cause?.cause?.data?.message,
    // inner errors
    err?.cause?.innerError?.message,
    err?.cause?.cause?.innerError?.message,
    // standard chains
    err?.cause?.cause?.message,
    err?.cause?.message,
    err?.data?.message,
    err?.data?.data,
    err?.message,
  ].filter(Boolean).map(String);

  // Also include errorArgs from custom Solidity errors (web3 v4)
  const customErrArgs = err?.cause?.errorArgs ?? err?.cause?.cause?.errorArgs;
  if (Array.isArray(customErrArgs) && customErrArgs.length) {
    candidates.unshift(customErrArgs.join(" "));
  }

  // Log full error to console for debugging
  console.error("[extractRevertReason] raw error:", err);
  console.error("[extractRevertReason] candidates:", candidates);

  const fullText = candidates.join(" ");

  // Common contract revert patterns → friendly messages
  // NOTE: specific patterns first, broad "execution reverted" last so it never
  // swallows a meaningful reason string that appears alongside it.
  const patterns = [
    [/Sale is not active/i, "The presale is not currently active."],
    [/sale.*not.*active/i, "The presale is not currently active."],
    [/not.*active/i, "The presale is not currently active."],
    [/Sale cap reached/i, "The presale cap has been reached."],
    [/Below minimum/i, "Amount is below the minimum purchase (10 USDT)."],
    [/Exceeds maximum/i, "Amount exceeds the maximum purchase limit."],
    [/exceeds.*max/i, "Amount exceeds the maximum purchase limit."],
    [/Exceeds.*cap/i, "The presale cap has been reached."],
    [/transfer.*failed/i, "USDT transfer failed. Check your balance and allowance."],
    [/insufficient.*allowance/i, "USDT allowance insufficient. Please approve USDT first."],
    [/ERC20.*allowance/i, "USDT allowance insufficient. Please approve USDT first."],
    [/allowance/i, "USDT allowance insufficient. Please approve USDT first."],
    [/insufficient.*balance/i, "Insufficient USDT balance."],
    [/invalid.*signature/i, "Invalid price signature. Please refresh and try again."],
    [/Signature.*expired/i, "Price quote expired. Please refresh and try again."],
    [/expired/i, "Price quote expired. Please refresh and try again."],
    [/already.*used/i, "This price quote has already been used. Please refresh."],
    [/Invalid signer/i, "Price signer not configured on contract. Please contact the team."],
    // broad fallbacks — only reached if no specific reason was found
    [/Internal JSON-RPC/i, "Transaction rejected by the contract."],
    [/execution reverted/i, "Transaction rejected by the contract."],
    [/revert/i, "Transaction rejected by the contract."],
  ];

  for (const [regex, friendly] of patterns) {
    if (regex.test(fullText)) return friendly;
  }

  // Return the most specific real message we have, stripped of JSON-RPC noise
  const best = candidates.find(c => !c.match(/^(execution reverted|Internal JSON-RPC error)$/i));
  return best || candidates[0] || "Transaction failed. Please try again.";
}

export function getPresaleContract() {
  const web3 = getWeb3();
  const contract = new web3.eth.Contract(PRESALE_ABI, CONFIG.presaleAddress);
  contract.transactionBlockTimeout = 600;
  contract.transactionPollingTimeout = 600 * 1000;
  return contract;
}

// Returns an optimal gasPrice string (current + 10% buffer) for reliable inclusion
async function getOptimalGasPrice() {
  try {
    const web3 = getWeb3();
    const price = await web3.eth.getGasPrice();
    return (BigInt(price) * 110n / 100n).toString();
  } catch {
    return undefined;
  }
}

// Sends a buy transaction and returns { receipt, txHash }.
// onHashCaptured(hash) is called as soon as the TX is broadcast (before mining),
// so callers can enqueue the rescue payload immediately — before waiting for receipt.
//
// Two-phase timeout strategy:
//  Phase 1 — MetaMask confirmation timeout (METAMASK_CONFIRM_MS):
//    Starts when tx.send() is called. If no transactionHash arrives within the
//    window (user hasn't confirmed MetaMask yet), the Promise is rejected with
//    err.isMetaMaskTimeout = true. The MetaMask popup is still open; the caller
//    shows a "cancelled"-type modal which reloads the page, giving the user a
//    clean state. Web3's own transactionBlockTimeout is disabled (set to 99999)
//    so it never fires and races with this timer.
//  Phase 2 — Receipt timeout (RECEIPT_WAIT_MS):
//    Starts only after transactionHash fires (tx is already in the mempool).
//    If no receipt arrives, the Promise is rejected with err.txHash set so the
//    rescue queue entry (created in onHashCaptured) is preserved and the caller
//    can show a BSCScan link.
const METAMASK_CONFIRM_MS = 10 * 60 * 1000; // 10 min — matches old transactionPollingTimeout
const RECEIPT_WAIT_MS     = 10 * 60 * 1000; // 10 min after broadcast

export async function buyWithUsdt(account, usdtAmountRaw, onHashCaptured) {
  if (!account) throw new Error("Wallet is not connected.");
  const presaleContract = getPresaleContract();
  // Disable web3's own timeout — our two-phase timers take over.
  presaleContract.transactionBlockTimeout = 99999;
  presaleContract.transactionPollingTimeout = 99999 * 1000;

  const gasPrice = await getOptimalGasPrice();
  const tx = presaleContract.methods.buy(usdtAmountRaw);
  let gas;
  try {
    gas = await tx.estimateGas({ from: account });
  } catch (err) {
    console.error("[buyWithUsdt] estimateGas failed:", err);
    throw new Error(extractRevertReason(err));
  }

  return new Promise((resolve, reject) => {
    let capturedTxHash = null;
    let settled = false;
    let metamaskTimeoutId = null;
    let receiptTimeoutId  = null;

    const settle = (fn) => {
      if (!settled) {
        settled = true;
        clearTimeout(metamaskTimeoutId);
        clearTimeout(receiptTimeoutId);
        fn();
      }
    };

    // Phase 1: auto-expire if user never confirms MetaMask
    metamaskTimeoutId = setTimeout(() => {
      if (!capturedTxHash) {
        const err = new Error("MetaMask confirmation timed out after 10 minutes.");
        err.isMetaMaskTimeout = true;
        settle(() => reject(err));
      }
    }, METAMASK_CONFIRM_MS);

    tx.send({ from: account, gas, ...(gasPrice && { gasPrice }) })
      .on("transactionHash", (hash) => {
        capturedTxHash = hash;
        if (typeof onHashCaptured === "function") onHashCaptured(hash);
        // Phase 2: start receipt countdown only after tx is in the mempool
        if (!settled) {
          receiptTimeoutId = setTimeout(() => {
            const err = new Error("Transaction not mined within 600 blocks, please check BSCScan.");
            err.txHash = capturedTxHash;
            settle(() => reject(err));
          }, RECEIPT_WAIT_MS);
        }
      })
      .on("receipt", (receipt) => settle(() =>
        resolve({ receipt, txHash: capturedTxHash ?? receipt.transactionHash })
      ))
      .on("error", (err) => {
        const rawMsg = String(err?.message || err?.cause?.message || "").toLowerCase();
        const isCancel = err?.code === 4001 ||
          rawMsg.includes("user denied") || rawMsg.includes("user rejected") ||
          rawMsg.includes("denied transaction signature");
        const error = new Error(isCancel ? (err?.message || "User cancelled") : extractRevertReason(err));
        error.code = isCancel ? 4001 : err?.code;
        error.txHash = capturedTxHash;
        // If web3's internal timeout fires before MetaMask was confirmed (no txHash),
        // classify it as a MetaMask confirmation timeout so the caller shows the correct modal.
        if (!capturedTxHash && !isCancel && (
          rawMsg.includes("not mined within") || rawMsg.includes("transaction was not mined") ||
          rawMsg.includes("poll timeout") || rawMsg.includes("timeout") ||
          rawMsg.includes("600 blocks") || rawMsg.includes("50 blocks")
        )) {
          error.isMetaMaskTimeout = true;
        }
        settle(() => reject(error));
      })
      .catch((err) => {
        // Safety: catch direct PromiEvent Promise rejection (web3 v4 may not fire .on("error"))
        const rawMsg = String(err?.message || err?.cause?.message || "").toLowerCase();
        const isCancel = err?.code === 4001 ||
          rawMsg.includes("user denied") || rawMsg.includes("user rejected") ||
          rawMsg.includes("denied transaction signature");
        const error = new Error(isCancel ? (err?.message || "User cancelled") : extractRevertReason(err));
        error.code = isCancel ? 4001 : err?.code;
        error.txHash = capturedTxHash;
        if (!capturedTxHash && !isCancel && (
          rawMsg.includes("not mined within") || rawMsg.includes("transaction was not mined") ||
          rawMsg.includes("poll timeout") || rawMsg.includes("timeout") ||
          rawMsg.includes("600 blocks") || rawMsg.includes("50 blocks")
        )) {
          error.isMetaMaskTimeout = true;
        }
        settle(() => reject(error));
      });
  });
}

export async function getUsdtAllowance(account) {
  if (!account) {
    throw new Error("Wallet is not connected.");
  }

  const usdtContract = getUsdtContract();

  const allowance = await usdtContract.methods
    .allowance(account, CONFIG.presaleAddress)
    .call();

  return allowance;
}

export function getUsdtContract() {
  const web3 = getWeb3();
  const contract = new web3.eth.Contract(USDT_ABI, CONFIG.usdtAddress);
  contract.transactionBlockTimeout = 600;
  contract.transactionPollingTimeout = 600 * 1000;
  return contract;
}

// Cache decimals so we only call it once per session
let _usdtDecimals = null;
export async function getUsdtDecimals() {
  if (_usdtDecimals !== null) return _usdtDecimals;
  try {
    const dec = await getUsdtContract().methods.decimals().call();
    const parsed = Number(dec);
    _usdtDecimals = (parsed >= 0 && parsed <= 18) ? parsed : CONFIG.usdtDecimals;
  } catch {
    _usdtDecimals = CONFIG.usdtDecimals; // fallback to config
  }
  console.log("[getUsdtDecimals] resolved:", _usdtDecimals);
  return _usdtDecimals;
}

export async function approveUsdt(account) {
  if (!account) throw new Error("Wallet is not connected.");
  const usdtContract = getUsdtContract();
  const maxUint = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
  const gasPrice = await getOptimalGasPrice();
  const tx = usdtContract.methods.approve(CONFIG.presaleAddress, maxUint);
  let gas;
  try {
    gas = await tx.estimateGas({ from: account });
  } catch (err) {
    throw new Error(extractRevertReason(err));
  }
  return await tx.send({ from: account, gas, ...(gasPrice && { gasPrice }) });
}

export function getEthereum() {
  // AppKit / WalletConnect provider takes priority when connected
  if (_wcProvider) return _wcProvider;

  if (typeof window === "undefined") return null;
  if (!window.ethereum) return null;

  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    const metaMaskProvider = window.ethereum.providers.find(
      (provider) => provider.isMetaMask
    );
    return metaMaskProvider || window.ethereum;
  }

  return window.ethereum;
}

export async function connectWithWalletConnect() {
  // Always open AppKit modal — lets users choose MetaMask, WalletConnect, or any other wallet.
  // Clear stale WC sessions first to prevent "No active wallet found" errors on reopen.
  try {
    const staleKeys = Object.keys(localStorage).filter(k =>
      k.startsWith("wc@") || k.startsWith("wagmi") || k.startsWith("W3M") ||
      k.startsWith("@appkit") || k.startsWith("reown") || k === "walletconnect"
    );
    staleKeys.forEach(k => localStorage.removeItem(k));
    await modal.disconnect().catch(() => {});
  } catch { /* ignore */ }
  await modal.open();

  return new Promise((resolve, reject) => {
    let done = false;

    function finish(address, provider) {
      if (done) return;
      done = true;
      unsubState();
      if (unsubAccount) unsubAccount();
      if (provider) _wcProvider = provider;
      resolve(address);
    }

    function cancel(reason) {
      if (done) return;
      done = true;
      unsubState();
      if (unsubAccount) unsubAccount();
      reject(new Error(reason || "Connection cancelled."));
    }

    // subscribeAccount fires when AppKit actually has a confirmed connected account
    let unsubAccount = null;
    try {
      unsubAccount = modal.subscribeAccount((accountData) => {
        if (accountData?.isConnected && accountData?.address) {
          const provider = modal.getWalletProvider() || window.ethereum;
          finish(accountData.address, provider);
        }
      });
    } catch { /* subscribeAccount not available in this build */ }

    // subscribeState fires when the modal opens/closes (covers cancel)
    const unsubState = modal.subscribeState((state) => {
      if (state.open) return;
      // Modal closed — give AppKit 400ms to settle connection state
      setTimeout(() => {
        const address = modal.getAddress();
        if (address) {
          const provider = modal.getWalletProvider() || window.ethereum;
          finish(address, provider);
        } else {
          cancel("Connection cancelled.");
        }
      }, 400);
    });
  });
}

export async function disconnectWalletConnect() {
  // Revoke MetaMask's eth_accounts permission so the next connect() call
  // shows the wallet confirmation popup instead of silently reconnecting.
  // wallet_revokePermissions is supported by MetaMask ≥ 10.16.0; ignore on others.
  try {
    const injected = window.ethereum?.providers
      ? (window.ethereum.providers.find(p => p.isMetaMask) || window.ethereum)
      : window.ethereum;
    if (injected) {
      await injected.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    }
  } catch { /* ignore — older MetaMask or non-MetaMask wallets */ }

  try {
    // Timeout 2 s — prevents hanging when WalletConnect relay is blocked by ad-blocker/firewall
    await Promise.race([modal.disconnect(), new Promise(r => setTimeout(r, 2000))]);
  } catch { /* ignore */ }
  _wcProvider = null;

  // Clear AppKit / WalletConnect cached session from localStorage so the
  // next connect() call always shows the wallet confirmation modal
  try {
    const keysToRemove = Object.keys(localStorage).filter(k =>
      k.startsWith("wc@") ||
      k.startsWith("wagmi") ||
      k.startsWith("W3M") ||
      k.startsWith("@appkit") ||
      k.startsWith("reown") ||
      k === "walletconnect"
    );
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

export function getWeb3() {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error("No wallet provider found.");
  }

  const web3 = new Web3(ethereum);
  // Set a high block timeout so web3's internal timer never fires before
  // our own withTimeout (30 s). 200 blocks ≈ 10 min on BSC Testnet.
  web3.eth.transactionBlockTimeout = 600;
  web3.eth.transactionPollingTimeout = 600 * 1000; // 10 min max polling
  return web3;
}

export async function connectWallet() {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error("No wallet provider found.");
  }

  const accounts = await ethereum.request({
    method: "eth_requestAccounts"
  });

  if (!accounts || accounts.length === 0) {
    throw new Error("No wallet account found.");
  }

  return accounts[0];
}

export async function getCurrentAccount() {
  const ethereum = getEthereum();
  if (!ethereum) {
    // WalletConnect path: no injected provider, get address from AppKit state
    return modal.getAddress() || null;
  }

  const accounts = await ethereum.request({
    method: "eth_accounts"
  });

  if (!accounts || accounts.length === 0) {
    // Fallback: AppKit may have the address even if eth_accounts returns empty
    return modal.getAddress() || null;
  }

  return accounts[0];
}

export async function getCurrentChainId() {
  const ethereum = getEthereum();
  if (!ethereum) {
    return null;
  }

  const chainId = await ethereum.request({
    method: "eth_chainId"
  });

  return chainId;
}

export async function getBnbBalance(address) {
  const web3 = getWeb3();
  const wei = await web3.eth.getBalance(address);
  return BigInt(wei);
}

export async function switchNetwork() {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error("No wallet provider found.");
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CONFIG.chainHex }],
    });
  } catch (err) {
    // Error 4902 = chain not added to MetaMask yet
    if (err.code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CONFIG.chainHex,
            chainName: CONFIG.networkName,
            nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com"],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export async function getTokenAmount(usdtAmountRaw) {
  const contract = getPresaleContract();
  const result = await contract.methods.getTokenAmount(String(usdtAmountRaw)).call();
  return result;
}

export async function buyWithBnb(account, bnbAmountWei, usdtAmountRaw, deadline, signature, onHashCaptured) {
  const contract = getPresaleContract();
  // Disable web3's own timeout — two-phase timers (same as buyWithUsdt) take over.
  contract.transactionBlockTimeout = 99999;
  contract.transactionPollingTimeout = 99999 * 1000;

  const gasPrice = await getOptimalGasPrice();
  const tx = contract.methods.buyWithBnb(
    String(bnbAmountWei), String(usdtAmountRaw), String(deadline), signature
  );
  let gas;
  try {
    gas = await tx.estimateGas({ from: account, value: String(bnbAmountWei) });
  } catch (err) {
    console.error("[buyWithBnb] estimateGas failed:", err);
    throw new Error(extractRevertReason(err));
  }

  return new Promise((resolve, reject) => {
    let capturedTxHash = null;
    let settled = false;
    let metamaskTimeoutId = null;
    let receiptTimeoutId  = null;

    const settle = (fn) => {
      if (!settled) {
        settled = true;
        clearTimeout(metamaskTimeoutId);
        clearTimeout(receiptTimeoutId);
        fn();
      }
    };

    // Phase 1: auto-expire if user never confirms MetaMask
    metamaskTimeoutId = setTimeout(() => {
      if (!capturedTxHash) {
        const err = new Error("MetaMask confirmation timed out after 10 minutes.");
        err.isMetaMaskTimeout = true;
        settle(() => reject(err));
      }
    }, METAMASK_CONFIRM_MS);

    tx.send({ from: account, value: String(bnbAmountWei), gas, ...(gasPrice && { gasPrice }) })
      .on("transactionHash", (hash) => {
        capturedTxHash = hash;
        if (typeof onHashCaptured === "function") onHashCaptured(hash);
        // Phase 2: start receipt countdown only after tx is in the mempool
        if (!settled) {
          receiptTimeoutId = setTimeout(() => {
            const err = new Error("Transaction not mined within 600 blocks, please check BSCScan.");
            err.txHash = capturedTxHash;
            settle(() => reject(err));
          }, RECEIPT_WAIT_MS);
        }
      })
      .on("receipt", (receipt) => settle(() =>
        resolve({ receipt, txHash: capturedTxHash ?? receipt.transactionHash })
      ))
      .on("error", (err) => {
        const rawMsg = String(err?.message || err?.cause?.message || "").toLowerCase();
        const isCancel = err?.code === 4001 ||
          rawMsg.includes("user denied") || rawMsg.includes("user rejected") ||
          rawMsg.includes("denied transaction signature");
        const error = new Error(isCancel ? (err?.message || "User cancelled") : extractRevertReason(err));
        error.code = isCancel ? 4001 : err?.code;
        error.txHash = capturedTxHash;
        if (!capturedTxHash && !isCancel && (
          rawMsg.includes("not mined within") || rawMsg.includes("transaction was not mined") ||
          rawMsg.includes("poll timeout") || rawMsg.includes("timeout") ||
          rawMsg.includes("600 blocks") || rawMsg.includes("50 blocks")
        )) {
          error.isMetaMaskTimeout = true;
        }
        settle(() => reject(error));
      })
      .catch((err) => {
        // Safety: catch direct PromiEvent Promise rejection (web3 v4 may not fire .on("error"))
        const rawMsg = String(err?.message || err?.cause?.message || "").toLowerCase();
        const isCancel = err?.code === 4001 ||
          rawMsg.includes("user denied") || rawMsg.includes("user rejected") ||
          rawMsg.includes("denied transaction signature");
        const error = new Error(isCancel ? (err?.message || "User cancelled") : extractRevertReason(err));
        error.code = isCancel ? 4001 : err?.code;
        error.txHash = capturedTxHash;
        if (!capturedTxHash && !isCancel && (
          rawMsg.includes("not mined within") || rawMsg.includes("transaction was not mined") ||
          rawMsg.includes("poll timeout") || rawMsg.includes("timeout") ||
          rawMsg.includes("600 blocks") || rawMsg.includes("50 blocks")
        )) {
          error.isMetaMaskTimeout = true;
        }
        settle(() => reject(error));
      });
  });
}

export function getVestingContract() {
  const web3 = getWeb3();
  const contract = new web3.eth.Contract(VESTING_ABI, CONFIG.vestingAddress);
  contract.transactionBlockTimeout = 600;
  contract.transactionPollingTimeout = 600 * 1000;
  return contract;
}

export function getTokenContract() {
  const web3 = getWeb3();
  const contract = new web3.eth.Contract(TOKEN_ABI, CONFIG.tokenAddress);
  contract.transactionBlockTimeout = 600;
  contract.transactionPollingTimeout = 600 * 1000;
  return contract;
}

export async function getPresaleStats() {
  const contract = getPresaleContract();
  const results = await Promise.allSettled([
    contract.methods.saleActive().call(),
    contract.methods.totalSold().call(),
    contract.methods.SALE_CAP().call(),
    contract.methods.remainingForSale().call(),
    contract.methods.RATE().call(),
    contract.methods.MIN_PURCHASE().call(),
    contract.methods.MAX_PURCHASE().call(),
    contract.methods.priceSigner().call(),
    contract.methods.vesting().call(),
  ]);

  const val = (r, fallback = "0") => r.status === "fulfilled" ? r.value : fallback;

  const vestingOnChain = val(results[8], null);

  // Warn in console if presale is pointing to wrong vesting
  if (vestingOnChain && CONFIG.vestingAddress &&
      vestingOnChain.toLowerCase() !== CONFIG.vestingAddress.toLowerCase()) {
    console.warn(
      "[getPresaleStats] vesting mismatch!",
      "\n  contract vesting :", vestingOnChain,
      "\n  config vesting   :", CONFIG.vestingAddress
    );
  }

  return {
    saleActive:       val(results[0], false),
    totalSold:        val(results[1]),
    saleCap:          val(results[2]),
    remainingForSale: val(results[3]),
    rate:             val(results[4]),
    minPurchase:      val(results[5]),
    maxPurchase:      val(results[6]),
    priceSigner:      val(results[7], null),
    vestingOnChain,
  };
}

export async function getUserStats(account) {
  const presale = getPresaleContract();
  const usdt = getUsdtContract();
  const vesting = getVestingContract();
  const web3 = getWeb3();

  const results = await Promise.allSettled([
    usdt.methods.balanceOf(account).call(),
    presale.methods.userTokenPurchased(account).call(),
    presale.methods.userUsdtSpent(account).call(),
    presale.methods.userRemainingUsdt(account).call(),
    vesting.methods.claimable(account).call(),
    getUsdtDecimals(),
    web3.eth.getBalance(account),
  ]);

  const val = (r, fallback = "0") => r.status === "fulfilled" ? r.value : fallback;

  return {
    usdtBalance:       val(results[0]),
    userTokenPurchased: val(results[1]),
    userUsdtSpent:     val(results[2]),
    userRemainingUsdt: val(results[3]),
    claimable:         val(results[4]),
    usdtDecimals:      val(results[5], CONFIG.usdtDecimals),
    bnbBalance:        val(results[6]),
  };
}

export async function getVestingInfo(account) {
  const vesting = getVestingContract();

  const results = await Promise.allSettled([
    vesting.methods.tgeTimestamp().call(),
    vesting.methods.CLIFF_DURATION().call(),
    vesting.methods.VESTING_DURATION().call(),
    vesting.methods.vestings(account).call(),
  ]);

  const val = (r, fallback = "0") => r.status === "fulfilled" ? r.value : fallback;

  return {
    tgeTimestamp:    val(results[0]),
    cliffDuration:   val(results[1]),
    vestingDuration: val(results[2]),
    vestingData:     val(results[3], null),
  };
}

export async function claimTokens(account) {
  const vesting = getVestingContract();
  return await vesting.methods.claim().send({ from: account });
}