import Web3 from "web3";

import { CONFIG } from "../config/config";
import { modal } from "../config/appkit.js";
import { USDT_ABI } from "../abi/usdtAbi";
import { PRESALE_ABI } from "../abi/presaleAbi";
import { VESTING_ABI } from "../abi/vestingAbi";
import { TOKEN_ABI } from "../abi/tokenAbi";

// ── WalletConnect provider (persisted across calls) ──────────────────────────
let _wcProvider = null;

export function getPresaleContract() {
  const web3 = getWeb3();
  return new web3.eth.Contract(PRESALE_ABI, CONFIG.presaleAddress);
}

export async function buyWithUsdt(account, usdtAmountRaw) {
  if (!account) {
    throw new Error("Wallet is not connected.");
  }

  const presaleContract = getPresaleContract();

  const receipt = await presaleContract.methods
    .buy(usdtAmountRaw)
    .send({ from: account });

  return receipt;
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
  return new web3.eth.Contract(USDT_ABI, CONFIG.usdtAddress);
}

export async function approveUsdt(account) {
  if (!account) {
    throw new Error("Wallet is not connected.");
  }

  const usdtContract = getUsdtContract();

  const maxUint =
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

  const receipt = await usdtContract.methods
    .approve(CONFIG.presaleAddress, maxUint)
    .send({ from: account });

  return receipt;
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
}

export function getWeb3() {
  const ethereum = getEthereum();
  if (!ethereum) {
    throw new Error("No wallet provider found.");
  }

  return new Web3(ethereum);
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

export async function buyWithBnb(
  account,
  bnbAmountWei,
  usdtAmountRaw,
  deadline,
  signature
) {
  const contract = getPresaleContract();

  const tx = contract.methods.buyWithBnb(
    String(bnbAmountWei),
    String(usdtAmountRaw),
    String(deadline),
    signature
  );

  const gas = await tx.estimateGas({
    from: account,
    value: String(bnbAmountWei)
  });

  return await tx.send({
    from: account,
    value: String(bnbAmountWei),
    gas
  });
}

export function getVestingContract() {
  const web3 = getWeb3();
  return new web3.eth.Contract(VESTING_ABI, CONFIG.vestingAddress);
}

export function getTokenContract() {
  const web3 = getWeb3();
  return new web3.eth.Contract(TOKEN_ABI, CONFIG.tokenAddress);
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

  const [usdtBalance, userTokenPurchased, userUsdtSpent, userRemainingUsdt, claimable] =
    await Promise.all([
      usdt.methods.balanceOf(account).call(),
      presale.methods.userTokenPurchased(account).call(),
      presale.methods.userUsdtSpent(account).call(),
      presale.methods.userRemainingUsdt(account).call(),
      vesting.methods.claimable(account).call(),
    ]);
  return { usdtBalance, userTokenPurchased, userUsdtSpent, userRemainingUsdt, claimable };
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