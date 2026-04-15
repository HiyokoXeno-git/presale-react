console.log("client.js version 20260324_aws_bnb_sign_01");

let web3;
let account = null;

let presaleContract;
let vestingContract;
let usdtContract;
let tokenContract;

let isProcessing = false;
let isConnectingWallet = false;

let currentBnbPrice = null;
let currentBuyTab = "USDT";
let currentBnbQuote = null;
let bnbQuoteTimer = null;

function logMessage(msg) {
    const el = document.getElementById("log");
    if (!el) return;
    el.innerText = `[${new Date().toLocaleTimeString()}] ${msg}
` + el.innerText;
}

function formatUnits(value, decimals = 18) {
    const divisor = BigInt(10) ** BigInt(decimals);
    const v = BigInt(value);
    const integer = v / divisor;
    const fraction = v % divisor;
    let f = fraction.toString().padStart(decimals, "0");
    f = f.replace(/0+$/, "");
    return f ? `${integer}.${f}` : `${integer}`;
}

function parseUsdt(value) {
    const cleaned = value.toString().trim();
    if (!cleaned) return "0";
    const parts = cleaned.split(".");
    const whole = parts[0] || "0";
    const fraction = (parts[1] || "").padEnd(6, "0").slice(0, 6);
    return (BigInt(whole) * 1000000n + BigInt(fraction || "0")).toString();
}

function parseBnb(value) {
    const cleaned = value.toString().trim();
    if (!cleaned) return "0";
    const parts = cleaned.split(".");
    const whole = parts[0] || "0";
    const fraction = (parts[1] || "").padEnd(18, "0").slice(0, 18);
    return (BigInt(whole) * 1000000000000000000n + BigInt(fraction || "0")).toString();
}

function showMessageModal(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById("messageModal");
        const text = document.getElementById("messageModalText");
        const okBtn = document.getElementById("messageModalOk");
        if (!modal || !text || !okBtn) {
            alert(message);
            resolve();
            return;
        }
        text.innerText = message;
        modal.style.display = "flex";
        const handler = () => {
            modal.style.display = "none";
            okBtn.removeEventListener("click", handler);
            resolve();
        };
        okBtn.addEventListener("click", handler);
    });
}

function showLoading(message = "Processing...") {
    const overlay = document.getElementById("loadingOverlay");
    const text = document.getElementById("loadingText");
    if (text) text.innerText = message;
    if (overlay) overlay.style.display = "flex";
}

function hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.style.display = "none";
}

function resetBuyForm() {
    const amountInput = document.getElementById("buyAmount");
    const estimatedEl = document.getElementById("estimated");
    const bnbInput = document.getElementById("bnbAmount");
    const bnbEstimatedUsdt = document.getElementById("bnbEstimatedUsdt");
    const bnbEstimatedToken = document.getElementById("bnbEstimatedToken");
    if (amountInput) amountInput.value = "";
    if (estimatedEl) estimatedEl.innerText = "0";
    if (bnbInput) bnbInput.value = "";
    if (bnbEstimatedUsdt) bnbEstimatedUsdt.innerText = "-";
    if (bnbEstimatedToken) bnbEstimatedToken.innerText = "-";
    currentBnbQuote = null;
}

function formatTimestampToDateTime(timestamp) {
    const ts = Number(timestamp);
    if (!ts || ts <= 0) return "Not set";
    const date = new Date(ts * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function savePurchaseToDbCommon(payload) {
    const response = await fetch(CONFIG.savePurchaseApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const rawText = await response.text();
    let result = null;

    try {
        result = JSON.parse(rawText);
    } catch (parseErr) {
        throw new Error("savePurchaseApi returned non-JSON or empty response: " + rawText);
    }

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save purchase to DB");
    }

    return result;
}

async function savePurchaseToDb(receipt, usdtAmount, tokenAmount) {
    return savePurchaseToDbCommon({
        walletAddress: account,
        txHash: receipt.transactionHash,
        paymentToken: "USDT",
        usdtAmount: usdtAmount,
        tokenAmount: tokenAmount,
        presaleAddress: CONFIG.presaleAddress,
        vestingAddress: CONFIG.vestingAddress,
        blockNumber: receipt.blockNumber,
        chainId: String(CONFIG.chainId),
        networkName: "BSC Testnet"
    });
}

async function savePurchaseToDbBnb(receipt, quote, tokenAmount) {
    return savePurchaseToDbCommon({
        walletAddress: account,
        txHash: receipt.transactionHash,
        paymentToken: "BNB",
        bnbAmountRaw: quote.bnbAmountWei,
        bnbAmount: quote.bnbAmount,
        usdtAmount: quote.usdtAmountRaw,
        tokenAmount: tokenAmount,
        quoteDeadline: quote.deadline,
        quoteDigest: quote.digest,
        presaleAddress: CONFIG.presaleAddress,
        vestingAddress: CONFIG.vestingAddress,
        blockNumber: receipt.blockNumber,
        chainId: String(CONFIG.chainId),
        networkName: "BSC Testnet"
    });
}

async function ensureBsc(provider = window.ethereum) {
    const chainId = await provider.request({ method: "eth_chainId" });
    if (chainId !== CONFIG.chainHex) {
        throw new Error("Switch MetaMask to BSC Testnet");
    }
    const networkEl = document.getElementById("network");
    if (networkEl) networkEl.innerText = "BSC Testnet";
}

function updateClaimButtonState(claimable) {
    const claimBtn = document.getElementById("claimButton");
    if (!claimBtn) return;
    if (BigInt(claimable) <= 0n) {
        claimBtn.disabled = true;
        claimBtn.innerText = "Nothing to Claim";
    } else {
        claimBtn.disabled = false;
        claimBtn.innerText = "Claim";
    }
}

function showApproveSection() {
    const approveSection = document.getElementById("approveSection");
    const buySection = document.getElementById("buySection");
    if (approveSection) approveSection.style.display = "block";
    if (buySection) buySection.style.display = "none";
}

function showBuySection() {
    const approveSection = document.getElementById("approveSection");
    const buySection = document.getElementById("buySection");
    if (approveSection) approveSection.style.display = "none";
    if (buySection) buySection.style.display = "block";
}

async function checkApprovalState() {
    try {
        if (!account || !usdtContract) {
            showApproveSection();
            return;
        }
        const allowance = await usdtContract.methods.allowance(account, CONFIG.presaleAddress).call();
        if (BigInt(allowance) > 0n) showBuySection();
        else showApproveSection();
    } catch (err) {
        logMessage("Failed to check approval state: " + err.message);
        showApproveSection();
    }
}

async function handleApproveFirst() {
    if (!account) {
        if (isConnectingWallet) return;
        await connectWallet();
    }
    if (!account) return;
    await approveUsdt();
}

async function connectWallet() {
    if (isConnectingWallet) {
        return;
    }

    isConnectingWallet = true;
    
    try {
        if (!window.ethereum) {
            await showMessageModal("MetaMask required.");
            return;
        }
        const provider = window.ethereum.providers ? window.ethereum.providers.find(p => p.isMetaMask) : window.ethereum;
        if (!provider) {
            await showMessageModal("MetaMask provider not found.");
            return;
        }
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        if (!accounts || accounts.length === 0) throw new Error("Wallet account not found");
        account = accounts[0];
        web3 = new Web3(provider);
        await ensureBsc(provider);
        const walletEl = document.getElementById("wallet");
        if (walletEl) walletEl.innerText = account;
        presaleContract = new web3.eth.Contract(PRESALE_ABI, CONFIG.presaleAddress);
        vestingContract = new web3.eth.Contract(VESTING_ABI, CONFIG.vestingAddress);
        usdtContract = new web3.eth.Contract(ERC20_ABI, CONFIG.usdtAddress);
        tokenContract = new web3.eth.Contract(ERC20_ABI, CONFIG.tokenAddress);
        await loadUserData();
        await loadVestingInfo();
        await checkApprovalState();
        await updateEstimatedReceive();
        await loadBnbPrice();
    } catch (err) {
        console.error(err);
        await showMessageModal("Wallet connection failed: " + err.message);
    } finally {
        isConnectingWallet = false;
    }
}

function selectBuyTab(tab) {
    currentBuyTab = tab;
    const tabUsdt = document.getElementById("tabUsdt");
    const tabBnb = document.getElementById("tabBnb");
    const usdtBuyBox = document.getElementById("usdtBuyBox");
    const bnbBuyBox = document.getElementById("bnbBuyBox");
    const approveSection = document.getElementById("approveSection");
    const buySection = document.getElementById("buySection");
    if (!tabUsdt || !tabBnb || !usdtBuyBox || !bnbBuyBox || !approveSection || !buySection) return;
    if (tab === "USDT") {
        tabUsdt.classList.add("active");
        tabBnb.classList.remove("active");
        usdtBuyBox.style.display = "block";
        bnbBuyBox.style.display = "none";
        checkApprovalState();
    } else {
        tabUsdt.classList.remove("active");
        tabBnb.classList.add("active");
        approveSection.style.display = "none";
        buySection.style.display = "block";
        usdtBuyBox.style.display = "none";
        bnbBuyBox.style.display = "block";
        updateBnbEstimate();
    }
}

async function buyTokenByBnb() {
    try {
        if (isProcessing) return;
        if (!account || !presaleContract) {
            await showMessageModal("Please connect your wallet first.");
            return;
        }
        const input = document.getElementById("bnbAmount");
        if (!input) {
            await showMessageModal("BNB amount input not found.");
            return;
        }
        const bnbText = input.value.trim();
        if (!bnbText) {
            await showMessageModal("Please enter BNB amount.");
            return;
        }
        if (!currentBnbQuote || !currentBnbQuote.success) {
            await showMessageModal("Signed BNB quote not loaded.");
            return;
        }
        const now = Math.floor(Date.now() / 1000);
        if (Number(currentBnbQuote.deadline) <= now) {
            await updateBnbQuote();
            if (!currentBnbQuote || !currentBnbQuote.success) {
                await showMessageModal("Failed to refresh signed BNB quote.");
                return;
            }
        }
        const bnbWei = currentBnbQuote.bnbAmountWei;
        const usdtAmount = currentBnbQuote.usdtAmountRaw;
        if (BigInt(usdtAmount) < 10000000n) {
            await showMessageModal("Minimum purchase amount is 10 USDT.");
            return;
        }
        const tokenAmount = await presaleContract.methods.getTokenAmount(usdtAmount).call();
        isProcessing = true;
        showLoading("BNB purchase transaction is being processed...");
        /*
        const receipt = await presaleContract.methods
            .buyWithBnb(
                bnbWei,
                usdtAmount,
                currentBnbQuote.deadline,
                currentBnbQuote.signature
            )
            .send({ from: account, value: bnbWei });
        */
        const signature = typeof currentBnbQuote.signature === "string"
            ? currentBnbQuote.signature
            : currentBnbQuote.signature?.signature;

        if (!signature || typeof signature !== "string" || !signature.startsWith("0x")) {
            throw new Error("Invalid BNB signature format");
        }

        const buyMethod = presaleContract.methods.buyWithBnb(
            bnbWei,
            usdtAmount,
            currentBnbQuote.deadline,
            signature
        );

        let gasEstimate;
        try {
            gasEstimate = await buyMethod.estimateGas({
                from: account,
                value: bnbWei
            });
        } catch (gasErr) {
            throw new Error("BNB estimateGas failed: " + (gasErr.message || "Unknown error"));
        }

        const gasLimit = Math.floor(Number(gasEstimate) * 1.2);

        const receipt = await buyMethod.send({
            from: account,
            value: bnbWei,
            gas: gasLimit
        });
        
        await savePurchaseToDbBnb(receipt, currentBnbQuote, tokenAmount);
        hideLoading();
        await showMessageModal(`BNB purchase completed successfully.
You purchased ${formatUnits(tokenAmount, 18)} HDT.`);
        resetBuyForm();
        await loadUserData();
        await loadVestingInfo();
    } catch (err) {
        hideLoading();
        console.error(err);
        await showMessageModal("BNB purchase failed: " + (err.message || "Unknown error"));
    } finally {
        isProcessing = false;
        hideLoading();
    }
}

async function updateBnbQuote() {
    const input = document.getElementById("bnbAmount");
    const usdtOutput = document.getElementById("bnbEstimatedUsdt");
    const tokenOutput = document.getElementById("bnbEstimatedToken");

    if (!input || !usdtOutput || !tokenOutput) {
        await showMessageModal(
            "BNB quote UI element not found: "
            + (!input ? "bnbAmount " : "")
            + (!usdtOutput ? "bnbEstimatedUsdt " : "")
            + (!tokenOutput ? "bnbEstimatedToken" : "")
        );
        return;
    }

    const bnbText = input.value.trim();

    if (!bnbText || bnbText === '.' || bnbText.endsWith('.')) {
        currentBnbQuote = null;
        usdtOutput.innerText = "-";
        tokenOutput.innerText = "-";
        return;
    }

    try {
    const res = await fetch(CONFIG.quoteApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account, bnbAmount: bnbText })
    });

    const rawText = await res.text();
    let data = null;

    try {
        data = JSON.parse(rawText);
    } catch (parseErr) {
        currentBnbQuote = null;
        usdtOutput.innerText = "-";
        tokenOutput.innerText = "-";
        logMessage("BNB quote raw response: " + rawText);
        await showMessageModal("BNB quote API returned non-JSON response.\n\n" + rawText);
        return;
    }

    if (!res.ok) {
        const msg = data && data.message ? data.message : ("HTTP " + res.status);
        throw new Error(msg);
    }

    if (!data.success) {
        currentBnbQuote = null;
        usdtOutput.innerText = "-";
        tokenOutput.innerText = "-";
        const msg = data.message || "Unknown error";
        logMessage("BNB quote load failed: " + msg);
        await showMessageModal("BNB quote load failed: " + msg);
        return;
    }

    currentBnbQuote = data;
    usdtOutput.innerText = data.usdtAmount;
    tokenOutput.innerText = data.tokenAmount;

} catch (err) {
    currentBnbQuote = null;
    usdtOutput.innerText = "-";
    tokenOutput.innerText = "-";
    logMessage("BNB quote fetch error: " + err.message);
    await showMessageModal("BNB quote fetch error: " + err.message);
}
}

async function loadUserData() {
    try {
        if (!account || !presaleContract || !vestingContract || !usdtContract) return;
        const [usdtBalance, totalSold, saleCap, remainingSale, userPurchased, claimable, walletLimit] = await Promise.all([
            usdtContract.methods.balanceOf(account).call(),
            presaleContract.methods.totalSold().call(),
            presaleContract.methods.SALE_CAP().call(),
            presaleContract.methods.remainingForSale().call(),
            presaleContract.methods.userTokenPurchased(account).call(),
            vestingContract.methods.claimable(account).call(),
            presaleContract.methods.userRemainingUsdt(account).call()
        ]);
        const totalSoldEl = document.getElementById("totalSold");
        const saleCapEl = document.getElementById("saleCap");
        const remainingEl = document.getElementById("remaining");
        const usdtBalanceEl = document.getElementById("usdtBalance");
        const purchasedEl = document.getElementById("purchased");
        const claimableEl = document.getElementById("claimable");
        const walletLimitEl = document.getElementById("walletLimit");
        if (totalSoldEl) totalSoldEl.innerText = formatUnits(totalSold, 18);
        if (saleCapEl) saleCapEl.innerText = formatUnits(saleCap, 18);
        if (remainingEl) remainingEl.innerText = formatUnits(remainingSale, 18);
        if (usdtBalanceEl) usdtBalanceEl.innerText = formatUnits(usdtBalance, 6);
        if (purchasedEl) purchasedEl.innerText = formatUnits(userPurchased, 18);
        if (claimableEl) claimableEl.innerText = formatUnits(claimable, 18);
        if (walletLimitEl) walletLimitEl.innerText = formatUnits(walletLimit, 6);
        updateClaimButtonState(claimable);
        let percent = 0n;
        if (BigInt(saleCap) > 0n) percent = (BigInt(totalSold) * 100n) / BigInt(saleCap);
        if (percent > 100n) percent = 100n;
        const progressBarEl = document.getElementById("progressBar");
        if (progressBarEl) progressBarEl.style.width = percent.toString() + "%";
    } catch (err) {
        logMessage("Failed to load user data: " + err.message);
    }
}

async function loadVestingInfo() {
    try {
        if (!account || !vestingContract) return;
        const [tge, cliffDuration, vestingDuration, vestingInfo] = await Promise.all([
            vestingContract.methods.tgeTimestamp().call(),
            vestingContract.methods.CLIFF_DURATION().call(),
            vestingContract.methods.VESTING_DURATION().call(),
            vestingContract.methods.vestings(account).call()
        ]);
        const tgeNum = Number(tge);
        const cliffNum = Number(cliffDuration);
        const vestingNum = Number(vestingDuration);
        const tgeStartEl = document.getElementById("tgeStart");
        const cliffEndEl = document.getElementById("cliffEnd");
        const vestingStartEl = document.getElementById("vestingStart");
        const vestingEndEl = document.getElementById("vestingEnd");
        const totalAllocatedEl = document.getElementById("totalAllocated");
        const alreadyClaimedEl = document.getElementById("alreadyClaimed");
        const releasePerDayEl = document.getElementById("releasePerDay");
        if (!tgeNum || tgeNum <= 0) {
            if (tgeStartEl) tgeStartEl.innerText = "Not set";
            if (cliffEndEl) cliffEndEl.innerText = "Not set";
            if (vestingStartEl) vestingStartEl.innerText = "Not set";
            if (vestingEndEl) vestingEndEl.innerText = "Not set";
        } else {
            const cliffEnd = tgeNum + cliffNum;
            const vestingStart = cliffEnd;
            const vestingEnd = cliffEnd + vestingNum;
            if (tgeStartEl) tgeStartEl.innerText = formatTimestampToDateTime(tgeNum);
            if (cliffEndEl) cliffEndEl.innerText = formatTimestampToDateTime(cliffEnd);
            if (vestingStartEl) vestingStartEl.innerText = formatTimestampToDateTime(vestingStart);
            if (vestingEndEl) vestingEndEl.innerText = formatTimestampToDateTime(vestingEnd);
        }
        const totalAllocated = BigInt(vestingInfo.totalAllocated || "0");
        const claimed = BigInt(vestingInfo.claimed || "0");
        if (totalAllocatedEl) totalAllocatedEl.innerText = formatUnits(totalAllocated.toString(), 18);
        if (alreadyClaimedEl) alreadyClaimedEl.innerText = formatUnits(claimed.toString(), 18);
        if (vestingNum > 0) {
            const perSecond = totalAllocated / BigInt(vestingNum);
            const perDay = perSecond * 86400n;
            if (releasePerDayEl) releasePerDayEl.innerText = formatUnits(perDay.toString(), 18);
        } else {
            if (releasePerDayEl) releasePerDayEl.innerText = "0";
        }
    } catch (err) {
        logMessage("Failed to load vesting info: " + err.message);
    }
}

async function approveUsdt() {
    try {
        if (!account || !usdtContract) {
            await showMessageModal("Please connect your wallet first.");
            return;
        }
        const MAX = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
        showLoading("Approving USDT...");
        await usdtContract.methods.approve(CONFIG.presaleAddress, MAX).send({ from: account });
        hideLoading();
        await showMessageModal("USDT approval completed.");
        showBuySection();
        await updateEstimatedReceive();
    } catch (err) {
        hideLoading();
        await showMessageModal("Approve failed: " + err.message);
    }
}

async function buyToken() {
    try {
        if (!account || !presaleContract || !usdtContract) {
            await showMessageModal("Please connect your wallet first.");
            return;
        }
        const amountInput = document.getElementById("buyAmount");
        if (!amountInput) {
            await showMessageModal("Buy amount input not found.");
            return;
        }
        const amount = amountInput.value.trim();
        if (!amount) {
            await showMessageModal("Please enter amount.");
            return;
        }
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            await showMessageModal("Please enter a valid amount.");
            return;
        }
        if (numericAmount < 10) {
            await showMessageModal("Minimum purchase amount is 10 USDT.");
            return;
        }
        const usdt = parseUsdt(amount);
        const usdtBalance = await usdtContract.methods.balanceOf(account).call();
        if (BigInt(usdtBalance) < BigInt(usdt)) {
            await showMessageModal(`Insufficient USDT balance.
Your balance is ${formatUnits(usdtBalance, 6)} USDT.`);
            return;
        }
        const tokenAmount = await presaleContract.methods.getTokenAmount(usdt).call();
        showLoading("Purchase transaction is being processed...");
        const receipt = await presaleContract.methods.buy(usdt).send({ from: account });
        await savePurchaseToDb(receipt, usdt, tokenAmount);
        hideLoading();
        await showMessageModal(`Purchase completed successfully.
You purchased ${formatUnits(tokenAmount, 18)} HDT.`);
        resetBuyForm();
        await loadUserData();
        await updateEstimatedReceive();
    } catch (err) {
        hideLoading();
        console.error(err);
        await showMessageModal("Purchase failed: " + err.message);
    }
}

async function claimToken() {
    const claimBtn = document.getElementById("claimButton");
    try {
        if (!account || !vestingContract) {
            await showMessageModal("Please connect your wallet first.");
            return;
        }
        if (claimBtn) claimBtn.disabled = true;
        showLoading("Checking claimable amount...");
        const claimable = await vestingContract.methods.claimable(account).call();
        const claimableEl = document.getElementById("claimable");
        if (claimableEl) claimableEl.innerText = formatUnits(claimable, 18);
        if (BigInt(claimable) <= 0n) {
            hideLoading();
            updateClaimButtonState(claimable);
            await showMessageModal("There is no claimable amount yet.");
            return;
        }
        showLoading("Claim transaction is being processed...");
        await vestingContract.methods.claim().send({ from: account });
        hideLoading();
        await showMessageModal(`Claim completed successfully.
Claimed ${formatUnits(claimable, 18)} HDT.`);
        await loadUserData();
    } catch (err) {
        hideLoading();
        await showMessageModal("Claim failed: " + err.message);
    } finally {
        hideLoading();
        await loadUserData();
    }
}

async function updateEstimatedReceive() {
    try {
        const estimatedEl = document.getElementById("estimated");
        const amountInput = document.getElementById("buyAmount");
        if (!estimatedEl || !amountInput) return;
        const value = amountInput.value.trim();
        if (!value || !presaleContract) {
            estimatedEl.innerText = "0";
            return;
        }
        const usdt = parseUsdt(value);
        if (BigInt(usdt) <= 0n) {
            estimatedEl.innerText = "0";
            return;
        }
        const tokens = await presaleContract.methods.getTokenAmount(usdt).call();
        estimatedEl.innerText = formatUnits(tokens, 18);
    } catch (err) {
        logMessage("Failed to calculate estimated receive: " + err.message);
    }
}

async function loadBnbPrice() {
    try {
        const res = await fetch(CONFIG.priceApi, { method: "GET" });
        const data = await res.json();
        if (!data.success) {
            logMessage("BNB price load failed: " + (data.message || "Unknown error"));
            return;
        }
        currentBnbPrice = parseFloat(data.bidPrice);
        const el = document.getElementById("bnbPrice");
        if (el) el.innerText = data.bidPrice;
    } catch (err) {
        console.error("loadBnbPrice error:", err);
    }
}

function updateBnbEstimate() {
    if (bnbQuoteTimer) clearTimeout(bnbQuoteTimer);
    bnbQuoteTimer = setTimeout(() => { updateBnbQuote(); }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("buyAmount");
    if (input) {
        input.addEventListener("input", async function () {
            await updateEstimatedReceive();
        });
    }
    const claimableEl = document.getElementById("claimable");
    if (claimableEl && !account) claimableEl.innerText = "0";
    const bnbInput = document.getElementById("bnbAmount");
    if (bnbInput) {
        bnbInput.addEventListener("input", function () { updateBnbEstimate(); });
    }
    selectBuyTab("USDT");
    updateClaimButtonState("0");
});

if (window.ethereum) {
    window.ethereum.on("accountsChanged", async function (accounts) {
        account = accounts[0] || null;
        const walletEl = document.getElementById("wallet");
        if (walletEl) walletEl.innerText = account || "-";
        if (!account) {
            presaleContract = null;
            vestingContract = null;
            usdtContract = null;
            tokenContract = null;
            resetBuyForm();
            showApproveSection();
            updateClaimButtonState("0");
            return;
        }
        try {
            const provider = window.ethereum.providers ? window.ethereum.providers.find(p => p.isMetaMask) : window.ethereum;
            web3 = new Web3(provider);
            presaleContract = new web3.eth.Contract(PRESALE_ABI, CONFIG.presaleAddress);
            vestingContract = new web3.eth.Contract(VESTING_ABI, CONFIG.vestingAddress);
            usdtContract = new web3.eth.Contract(ERC20_ABI, CONFIG.usdtAddress);
            tokenContract = new web3.eth.Contract(ERC20_ABI, CONFIG.tokenAddress);
            await ensureBsc(provider);
            await loadUserData();
            await loadVestingInfo();
            await checkApprovalState();
            await updateEstimatedReceive();
            await loadBnbPrice();
        } catch (err) {
            logMessage("Account change handling failed: " + err.message);
            showApproveSection();
        }
    });
    window.ethereum.on("chainChanged", function () { location.reload(); });
}
