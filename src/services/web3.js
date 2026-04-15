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
  // Collect all candidate message strings, from most specific to least
  const candidates = [
    err?.cause?.cause?.message,
    err?.cause?.message,
    err?.data?.message,
    err?.data?.data,
    err?.message,
  ].filter(Boolean).map(String);

  const fullText = candidates.join(" ");

  // Common contract revert patterns → friendly messages
  const patterns = [
    [/Sale is not active/i, "The presale is not currently active."],
    [/sale.*not.*active/i, "The presale is not currently active."],
    [/Sale cap reached/i, "The presale cap has been reached."],
    [/Below minimum/i, "Amount is below the minimum purchase (10 USDT)."],
    [/Exceeds maximum/i, "Amount exceeds the maximum purchase limit."],
    [/exceeds.*max/i, "Amount exceeds the maximum purchase limit."],
    [/transfer.*failed/i, "USDT transfer failed. Check your balance."],
    [/insufficient.*allowance/i, "USDT allowance insufficient. Please try again."],
    [/ERC20.*allowance/i, "USDT allowance insufficient. Please try again."],
    [/insufficient.*balance/i, "Insufficient USDT balance."],
    [/execution reverted/i, "Transaction rejected by the contract. The presale may not be active or your balance is insufficient."],
    [/Internal JSON-RPC/i, "Transaction rejected by the contract. The presale may not be active or your balance is insufficient."],
    [/revert/i, "Transaction rejected by the contract."],
  ];

  for (const [regex, friendly] of patterns) {
    if (regex.test(fullText)) return friendly;
  }

  // Return the most specific real message we have
  return candidates[0] || "Transaction failed. Please try again.";
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
    _usdtDecimals = Number(dec);
  } catch {
    _usdtDecimals = 6; // fallback
  }
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
  // Open the AppKit modal — user picks their wallet (desktop extension or mobile QR)
  await modal.open();

  // Wait until the user is connected (or closes the modal)
  return new Promise((resolve, reject) => {
    const unsub = modal.subscribeState((state) => {
      if (state.open) return; // modal still open — keep waiting
      unsub();
      const provider = modal.getWalletProvider();
      if (!provider) {
        reject(new Error("Connection cancelled."));
        return;
      }
      provider.request({ method: "eth_accounts" }).then((accounts) => {
        if (!accounts || accounts.length === 0) {
          reject(new Error("No account found."));
        } else {
          _wcProvider = provider;
          resolve(accounts[0]);
        }
      }).catch(reject);
    });
  });
}

export async function disconnectWalletConnect() {
  try {
    await modal.disconnect();
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
    return null;
  }

  const accounts = await ethereum.request({
    method: "eth_accounts"
  });

  if (!accounts || accounts.length === 0) {
    return null;
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
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            blockExplorerUrls: ["https://testnet.bscscan.com"],
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
  const [saleActive, totalSold, saleCap, remainingForSale, rate, minPurchase, maxPurchase] =
    await Promise.all([
      contract.methods.saleActive().call(),
      contract.methods.totalSold().call(),
      contract.methods.SALE_CAP().call(),
      contract.methods.remainingForSale().call(),
      contract.methods.RATE().call(),
      contract.methods.MIN_PURCHASE().call(),
      contract.methods.MAX_PURCHASE().call(),
    ]);
  return { saleActive, totalSold, saleCap, remainingForSale, rate, minPurchase, maxPurchase };
}

export async function getUserStats(account) {
  const presale = getPresaleContract();
  const usdt = getUsdtContract();
  const vesting = getVestingContract();
  const web3 = getWeb3();

  const [usdtBalance, userTokenPurchased, userUsdtSpent, userRemainingUsdt, claimable, usdtDecimals, bnbBalance] =
    await Promise.all([
      usdt.methods.balanceOf(account).call(),
      presale.methods.userTokenPurchased(account).call(),
      presale.methods.userUsdtSpent(account).call(),
      presale.methods.userRemainingUsdt(account).call(),
      vesting.methods.claimable(account).call(),
      getUsdtDecimals(),
      web3.eth.getBalance(account),
    ]);
  return { usdtBalance, userTokenPurchased, userUsdtSpent, userRemainingUsdt, claimable, usdtDecimals, bnbBalance };
}

export async function getVestingInfo(account) {
  const vesting = getVestingContract();

  const [tgeTimestamp, cliffDuration, vestingDuration, vestingData] = await Promise.all([
    vesting.methods.tgeTimestamp().call(),
    vesting.methods.CLIFF_DURATION().call(),
    vesting.methods.VESTING_DURATION().call(),
    vesting.methods.vestings(account).call(),
  ]);
  return { tgeTimestamp, cliffDuration, vestingDuration, vestingData };
}

export async function claimTokens(account) {
  const vesting = getVestingContract();
  return await vesting.methods.claim().send({ from: account });
}