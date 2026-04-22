import { useCallback, useEffect, useRef, useState } from "react";
import { usePageTransition } from "../App";
import MessageModal from "../components/MessageModal";
import { CONFIG } from "../config/config";
import { useLanguage } from "../hooks/useLanguage";
import { SUPPORTED_LANGS } from "../i18n/translations";
import { destroySession, fetchBnbPrice, fetchBnbQuote, getAnnouncements, getUserTransactions, savePurchase, validateSession } from "../services/api";
import { dequeue, enqueue, getPending } from "../services/rescueQueue";
import { formatDate, formatNumber, formatUnits } from "../services/format";
import {
    approveUsdt,
    buyWithBnb,
    buyWithUsdt,
    claimTokens,
    disconnectWalletConnect,
    getBnbBalance,
    getCurrentAccount, getCurrentChainId,
    getPresaleStats,
    getTokenAmount,
    getUsdtAllowance,
    getUserStats, getVestingInfo,
    switchNetwork,
} from "../services/web3";

function PresalePage() {
    const { lang, setLang, t } = useLanguage();
    const [account, setAccount] = useState("");
    const [currentChainId, setCurrentChainId] = useState("");
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
    const [isDetectingChain, setIsDetectingChain] = useState(true); // true until first chainId check completes
    const [isLoading, setIsLoading] = useState(true);
    const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
    const [switchNetworkMessage, setSwitchNetworkMessage] = useState("");
    const { exiting, transitionTo: navigate } = usePageTransition();

    // Buy form
    const [usdtAmount, setUsdtAmount] = useState("");
    const [thkAmount, setThkAmount] = useState("");  // bidirectional HYK input
    const [isBuying, setIsBuying] = useState(false);
    const [usdtAllowance, setUsdtAllowance] = useState(null); // null=loading, "0"=needs approve, else approved
    // Keep ref in sync so session timer always sees current value (avoids stale closure)
    useEffect(() => { isBuyingRef.current = isBuying; }, [isBuying]);
    const [buyMessage, setBuyMessage] = useState("");
    const [buyMsgVariant, setBuyMsgVariant] = useState("error"); // "progress"|"pending"|"cancelled"|"error"
    const [bnbAmount, setBnbAmount] = useState("");
    const [bnbUsdtDisplay, setBnbUsdtDisplay] = useState("");  // read-only USDT in BNB tab
    const [bnbThkDisplay, setBnbThkDisplay] = useState("");    // editable HYK in BNB tab
    const [lastBnbPrice, setLastBnbPrice] = useState(null);    // BNB/USDT rate from last quote
    const [_liveBnbPrice, setLiveBnbPrice] = useState(null);    // live BNB/USD price (polled) — display not yet implemented
    const [_liveBnbChange, setLiveBnbChange] = useState(null);  // 24h % change — display not yet implemented
    const [bnbQuote, setBnbQuote] = useState(null);
    const [bnbQuoteMessage, setBnbQuoteMessage] = useState("");
    const [isFetchingBnbQuote, setIsFetchingBnbQuote] = useState(false);
    const [paymentTab, setPaymentTab] = useState("USDT");
    const [modal, setModal] = useState(null);
    const lastEditedBnbFieldRef = useRef("bnb"); // "bnb" | "thk" — tracks which field user last edited
    const bnbUsdtTargetRef = useRef(null); // USDT target when user types HYK with no prior BNB price
    const isBuyingRef = useRef(false); // always-current mirror of isBuying state (avoids stale closure in session timer)

    // Presale stats from blockchain
    const [presaleStats, setPresaleStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [vestingInfo, setVestingInfo] = useState(null);

    // Claim
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimMessage, setClaimMessage] = useState("");

    // TX history
    const [txHistory, setTxHistory] = useState([]);
    const [isLoadingTx, setIsLoadingTx] = useState(false);
    const [txTab, setTxTab] = useState("my"); // "my" | "all"

    // Announcements from API
    const [announcements, setAnnouncements] = useState([]);

    // Lang dropdown
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const langSwitcherRef = useRef(null);

    // ── Data loaders ──────────────────────────────────────────────
    const refreshUsdtAllowance = useCallback(async (walletAddress) => {
        try {
            const allowance = await getUsdtAllowance(walletAddress);
            setUsdtAllowance(String(allowance));
        } catch {
            setUsdtAllowance("0");
        }
    }, []);

    const loadChainData = useCallback(async (walletAddress) => {
        const [statsResult, userResult, vestingResult] = await Promise.allSettled([
            getPresaleStats(),
            getUserStats(walletAddress),
            getVestingInfo(walletAddress),
        ]);
        if (statsResult.status === "fulfilled") setPresaleStats(statsResult.value);
        if (userResult.status === "fulfilled") setUserStats(userResult.value);
        else console.error("[loadChainData] getUserStats failed:", userResult.reason);
        if (vestingResult.status === "fulfilled") setVestingInfo(vestingResult.value);
        else console.error("[loadChainData] getVestingInfo failed:", vestingResult.reason);
    }, []);

    const loadTxHistory = useCallback(async () => {
        try {
            setIsLoadingTx(true);
            // Pass no wallet = fetch all transactions; "My Tx" tab filters client-side
            const rows = await getUserTransactions();
            setTxHistory(rows);
        } catch {
            setTxHistory([]);
        } finally {
            setIsLoadingTx(false);
        }
    }, []);

    // After a confirmed on-chain tx, poll history until the new row appears (max 5×)
    const pollTxHistoryUntilNew = useCallback(async (txHash) => {
        const delays = [2000, 3000, 5000, 8000, 12000];
        for (const delay of delays) {
            await new Promise(r => setTimeout(r, delay));
            try {
                const rows = await getUserTransactions();
                setTxHistory(rows);
                // Stop polling once the tx appears in history
                if (rows.some(r => r.tx_hash?.toLowerCase() === txHash?.toLowerCase())) break;
            } catch { /* ignore, keep polling */ }
        }
    }, []);

    // ── Rescue queue flush — retries any DB saves that failed in a prior session ──
    const flushRescueQueue = useCallback(async () => {
        const pending = getPending();
        if (pending.length === 0) return;
        let anyFlushed = false;
        let flushedHash = null;
        for (const payload of pending) {
            try {
                const result = await savePurchase(payload);
                if (result?.success || result?.message?.toLowerCase().includes("already saved")) {
                    dequeue(payload.txHash);
                    flushedHash = payload.txHash;
                    anyFlushed = true;
                }
            } catch { /* leave in queue, retry next time */ }
        }
        if (anyFlushed) {
            loadChainData(account).catch(err => console.error("[flushRescueQueue] loadChainData:", err));
            loadTxHistory().catch(err => console.error("[flushRescueQueue] loadTxHistory:", err));
            if (flushedHash) pollTxHistoryUntilNew(flushedHash).catch(err => console.error("[flushRescueQueue] pollTxHistory:", err));
        }
    }, [account, loadChainData, loadTxHistory, pollTxHistoryUntilNew]);

    // ── Handlers ──────────────────────────────────────────────────
    async function handleSwitchNetwork() {
        if (isSwitchingNetwork) return;
        try {
            setIsSwitchingNetwork(true);
            setSwitchNetworkMessage("");
            await switchNetwork();
        } catch (err) {
            setSwitchNetworkMessage(err.code === 4001 ? t("networkSwitchRejected") : (err.message || t("networkSwitchFailed")));
        } finally {
            setIsSwitchingNetwork(false);
        }
    }

    async function handleClaim() {
        if (isClaiming || !account) return;
        try {
            setIsClaiming(true);
            setClaimMessage("");
            const receipt = await claimTokens(account);
            if (receipt?.status) {
                setClaimMessage(t("claimSuccessInline"));
                await loadChainData(account);
                setModal({ type: "success", message: t("claimSuccessModal"), txHash: receipt.transactionHash });
            } else {
                setClaimMessage(t("claimTxFailed"));
            }
        } catch (err) {
            const rawMsg = String(err?.message || "").toLowerCase();
            const cancelled = err?.code === 4001 ||
                rawMsg.includes("user denied") || rawMsg.includes("user rejected");
            if (!cancelled) {
                setClaimMessage(err?.message || t("claimFailedMsg"));
            }
            // User cancelled — no message needed
        } finally {
            setIsClaiming(false);
        }
    }

    function setMsg(text, variant = "error") {
        setBuyMessage(text);
        setBuyMsgVariant(variant);
    }

    function buyMsgColor() {
        if (!buyMessage) return "#ff6060";
        if (buyMsgVariant === "progress")  return "#FFA01C";
        if (buyMsgVariant === "pending")   return "#FFD94E";
        if (buyMsgVariant === "cancelled") return "#FFA01C";
        return "#ff6060";
    }

    function isBlockTimeoutError(error) {
        const msg = String(error?.message || error?.cause?.message || "").toLowerCase();
        return msg.includes("not mined within") ||
            msg.includes("600 blocks") ||
            msg.includes("transaction was not mined") ||
            msg.includes("poll timeout") ||
            msg.includes("transaction poll");
    }

    // Fires when user did not confirm MetaMask within the 10-minute window.
    // The MetaMask popup is still alive; the app auto-expires the buy flow
    // and reloads the page so the user starts fresh.
    function isMetaMaskTimeoutError(error) {
        return error?.isMetaMaskTimeout === true;
    }

    function classifyTxError(error, token = "") {
        const code = error?.code;
        const msg = String(error?.message || error?.reason || "").toLowerCase();

        // User rejected in wallet
        if (code === 4001 || code === "ACTION_REJECTED" ||
            msg.includes("user denied") || msg.includes("user rejected") ||
            msg.includes("metamask tx signature") || msg.includes("cancelled by user")) {
            return t("errTxRejected");
        }

        // Transaction submitted but not confirmed yet (web3 polling timeout)
        // The tx may still be pending on-chain — DO NOT say "cancelled"
        if (msg.includes("not mined within") || msg.includes("50 blocks") ||
            msg.includes("transaction was not mined")) {
            return t("errTxPendingBsc");
        }

        // Transaction replaced / sped up / dropped
        if (msg.includes("transaction was replaced") || msg.includes("replacement fee too low") ||
            code === "TRANSACTION_REPLACED") {
            return t("errTxReplaced");
        }

        // Insufficient gas / funds
        if (msg.includes("insufficient funds") || msg.includes("not enough") ||
            msg.includes("insufficient balance")) {
            return token === "BNB" ? t("errInsufficientBnb") : t("errInsufficientUsdtBnb");
        }

        // Gas underpriced
        if (msg.includes("underpriced") || msg.includes("gas too low")) {
            return t("errGasTooLow");
        }

        // Nonce issues
        if (msg.includes("nonce too low") || msg.includes("nonce too high")) {
            return t("errNonceError");
        }

        // Network / RPC error
        if (msg.includes("network") || msg.includes("disconnected") || msg.includes("rpc") ||
            msg.includes("connection") || msg.includes("timeout") || msg.includes("failed to fetch")) {
            return t("errNetworkError");
        }

        // Contract revert (already handled in web3.js extractRevertReason, but just in case)
        if (msg.includes("revert") || msg.includes("execution reverted")) {
            return t("errContractRevert");
        }

        // Fallback
        return error?.message || t("errPurchaseFailed").replace("{token}", token);
    }

    async function handleBuyWithBnb() {
        if (isBuying) return;
        let bnbAmountWei = "";
        let capturedTxHashForUI = null;
        try {
            setIsBuying(true);
            setBuyMessage("");
            if (!account) { setMsg(t("errWalletNotConnected")); return; }
            const trimmedBnbAmount = String(bnbAmount ?? "").trim();
            if (!trimmedBnbAmount) { setMsg(t("errEnterBnbAmount")); return; }

            // Pre-flight: check priceSigner is configured on the contract
            const bnbPreflightStats = await getPresaleStats();
            console.log("[handleBuyWithBnb] presaleStats:", bnbPreflightStats);
            if (!bnbPreflightStats.saleActive) {
                setMsg(t("errPresaleNotActive"));
                return;
            }
            const zeroAddr = /^0x0+$/i;
            if (!bnbPreflightStats.priceSigner || zeroAddr.test(bnbPreflightStats.priceSigner)) {
                setMsg(t("errPriceSigner"));
                return;
            }

            let quote = bnbQuote;
            if (!quote) {
                quote = await fetchBnbQuote(account, trimmedBnbAmount);
                if (!quote || quote.success === false) { setMsg(quote?.message || t("errFetchBnbQuote")); return; }
                setBnbQuote(quote);
            }
            const now = Math.floor(Date.now() / 1000);
            if (!quote.deadline || now > Number(quote.deadline)) {
                const refreshedQuote = await fetchBnbQuote(account, trimmedBnbAmount);
                if (!refreshedQuote || refreshedQuote.success === false) { setMsg(refreshedQuote?.message || t("errBnbQuoteExpired")); return; }
                quote = refreshedQuote;
                setBnbQuote(refreshedQuote);
            }

            const usdtAmountRaw = String(quote.usdtAmountRaw ?? "");
            bnbAmountWei = String(quote.bnbAmountWei ?? "");
            const signature = String(quote.signature ?? "");
            const quoteDeadline = String(quote.deadline ?? "");
            const quoteDigest = String(quote.digest ?? "");

            if (!usdtAmountRaw || !bnbAmountWei || !signature || !quoteDeadline) { setMsg(t("errBnbQuoteIncomplete")); return; }
            if (BigInt(usdtAmountRaw) < BigInt("10000000")) { setMsg(t("errMinBnbPurchase")); return; }

            // Pre-flight: verify wallet has enough BNB (purchase amount + ~0.001 BNB gas buffer)
            try {
                const GAS_BUFFER = BigInt("1000000000000000"); // 0.001 BNB
                const balance = await getBnbBalance(account);
                if (balance < BigInt(bnbAmountWei) + GAS_BUFFER) {
                    setMsg(t("errInsufficientBnb"));
                    return;
                }
            } catch { /* RPC error — skip check, contract will reject if truly insufficient */ }

            const tokenAmountRaw = await getTokenAmount(usdtAmountRaw);

            // Enqueue immediately when TX is broadcast (before mining)
            const onHashCaptured = (hash) => {
                capturedTxHashForUI = hash;
                enqueue({
                    walletAddress: String(account), txHash: String(hash),
                    paymentToken: "BNB", bnbAmountRaw: String(bnbAmountWei),
                    bnbAmount: String(quote.bnbAmount ?? trimmedBnbAmount),
                    usdtAmount: String(usdtAmountRaw), tokenAmount: String(tokenAmountRaw),
                    quoteDeadline: String(quoteDeadline), quoteDigest: String(quoteDigest),
                    presaleAddress: String(CONFIG.presaleAddress), vestingAddress: String(CONFIG.vestingAddress),
                    blockNumber: null, chainId: String(CONFIG.chainId),
                    networkName: String(CONFIG.networkName)
                });
                setMsg(t("msgTxSubmitted"), "progress");
            };

            const { receipt, txHash } = await buyWithBnb(account, bnbAmountWei, usdtAmountRaw, quoteDeadline, signature, onHashCaptured);

            if (receipt?.status) {
                const bnbPayload = {
                    walletAddress: String(account), txHash: String(txHash),
                    paymentToken: "BNB", bnbAmountRaw: String(bnbAmountWei),
                    bnbAmount: String(quote.bnbAmount ?? trimmedBnbAmount),
                    usdtAmount: String(usdtAmountRaw), tokenAmount: String(tokenAmountRaw),
                    quoteDeadline: String(quoteDeadline), quoteDigest: String(quoteDigest),
                    presaleAddress: String(CONFIG.presaleAddress), vestingAddress: String(CONFIG.vestingAddress),
                    blockNumber: String(receipt.blockNumber), chainId: String(CONFIG.chainId),
                    networkName: String(CONFIG.networkName)
                };
                let saveResult = null;
                try { saveResult = await savePurchase(bnbPayload); } catch { /* stays in rescue queue */ }

                if (saveResult?.success || saveResult?.message?.toLowerCase().includes("already saved")) {
                    dequeue(bnbPayload.txHash);
                    setBnbAmount(""); setBnbUsdtDisplay(""); setBnbThkDisplay(""); setBnbQuote(null); setBuyMessage("");
                    setModal({ type: "success", message: t("msgTokensReserved"), txHash });
                    loadChainData(account);
                    pollTxHistoryUntilNew(txHash);
                } else {
                    setModal({ type: "success", message: t("msgTxConfirmedSyncing"), txHash });
                    loadChainData(account);
                    pollTxHistoryUntilNew(txHash);
                }
            } else {
                setModal({ type: "error", message: t("errBnbTxFailed") });
            }
        } catch (error) {
            const txHashForError = capturedTxHashForUI || error.txHash;
            if (txHashForError && isBlockTimeoutError(error)) {
                setModal({
                    type: "error",
                    message: t("errTxBlockTimeout"),
                    txHash: txHashForError,
                });
            } else if (txHashForError) {
                // TX was broadcast — already in rescue queue from onHashCaptured
                setMsg(t("msgTxSubmittedAuto"), "pending");
            } else {
                const code = error?.code;
                const msg  = String(error?.message || "").toLowerCase();
                const isUserCancel = code === 4001 || code === "ACTION_REJECTED" ||
                    msg.includes("user denied") || msg.includes("user rejected") ||
                    msg.includes("metamask tx signature") || msg.includes("cancelled by user");
                if (isUserCancel) {
                    setModal({ type: "cancelled", message: t("msgUserCancelled") });
                } else if (isMetaMaskTimeoutError(error)) {
                    // MetaMask popup was not confirmed within 10 min — auto-expire the buy flow
                    setModal({ type: "cancelled", message: t("msgTxExpired") });
                } else {
                    setMsg(classifyTxError(error, "BNB"));
                }
            }
        } finally {
            setIsBuying(false);
            // Retry any pending rescue queue entries immediately after buy completes
            setTimeout(() => flushRescueQueue(), 3000);
        }
    }

    async function handleFetchBnbQuote(inputBnbAmount) {
        // Snapshot mutable refs BEFORE any await — prevents stale-closure race when
        // the user types quickly and multiple calls overlap in-flight.
        const usdtTargetSnapshot = bnbUsdtTargetRef.current;
        const editedFieldSnapshot = lastEditedBnbFieldRef.current;
        try {
            setBnbQuoteMessage(""); setBnbQuote(null);
            const trimmedAmount = String(inputBnbAmount ?? "").trim();
            if (!account) { setBnbQuoteMessage(t("errWalletNotConnected")); return; }
            if (!trimmedAmount) { setBnbQuote(null); return; }
            const numericAmount = Number(trimmedAmount);
            if (!Number.isFinite(numericAmount) || numericAmount <= 0) { setBnbQuoteMessage(t("errEnterValidBnb")); return; }
            setIsFetchingBnbQuote(true);
            const result = await fetchBnbQuote(account, trimmedAmount);
            if (!result || result.success === false) { setBnbQuote(null); setBnbQuoteMessage(result?.message || t("errFetchBnbQuote")); return; }
            setBnbQuote(result);
            // Sync USDT display from quote result (always)
            const usdtVal = parseFloat(String(result.usdtAmount).replace(/,/g, ""));
            const thkVal = parseFloat(String(result.tokenAmount).replace(/,/g, ""));
            if (!isNaN(usdtVal)) setBnbUsdtDisplay(usdtVal.toFixed(6));
            // Only sync HYK display if user didn't manually type in the HYK field
            if (!isNaN(thkVal) && lastEditedBnbFieldRef.current !== "thk") {
                setBnbThkDisplay(Math.floor(thkVal).toString());
            }
            // Store BNB/USDT rate for reverse conversion
            if (!isNaN(usdtVal) && numericAmount > 0) {
                const price = usdtVal / numericAmount;
                setLastBnbPrice(price);
                // If user was typing HYK with no prior price, recalculate the correct BNB amount.
                // Only act on the target that was set at call-time (usdtTargetSnapshot) to avoid
                // using a stale value from a concurrent call that updated the ref mid-flight.
                if (editedFieldSnapshot === "thk" && usdtTargetSnapshot != null &&
                    bnbUsdtTargetRef.current === usdtTargetSnapshot) {
                    bnbUsdtTargetRef.current = null;
                    const correctBnb = (usdtTargetSnapshot / price).toFixed(8);
                    setBnbAmount(correctBnb); // triggers debounce again for the accurate quote
                }
            }
        } catch (error) {
            setBnbQuote(null);
            const rawMsg = String(error?.message || "").toLowerCase();
            const friendlyMsg = (rawMsg.includes("failed to fetch") || rawMsg.includes("networkerror") || rawMsg.includes("aborted") || rawMsg.includes("timed out"))
                ? "Unable to fetch BNB price. Please check your connection and try again."
                : (error?.message || "Failed to fetch BNB quote.");
            setBnbQuoteMessage(friendlyMsg);
        } finally {
            setIsFetchingBnbQuote(false);
        }
    }

    // BNB tab bidirectional handlers
    function handleBnbChange(val) {
        lastEditedBnbFieldRef.current = "bnb";
        const v = normalizeUsdtInput(val);
        setBnbAmount(v);
        // USDT and HYK will be updated when quote comes back (debounced)
        if (!v || Number(v) <= 0) { setBnbUsdtDisplay(""); setBnbThkDisplay(""); setBnbQuote(null); }
    }

    function handleBnbThkChange(val) {
        lastEditedBnbFieldRef.current = "thk";
        const v = normalizeUsdtInput(val);
        setBnbThkDisplay(v);
        const thk = Number(v);
        if (!v || thk <= 0) { setBnbUsdtDisplay(""); setBnbAmount(""); setBnbQuote(null); return; }
        // USDT = HYK / 66
        const usdt = (thk / 66).toFixed(6);
        setBnbUsdtDisplay(usdt);
        // BNB = USDT / rate — triggers debounced quote fetch to get accurate values
        if (lastBnbPrice && lastBnbPrice > 0) {
            bnbUsdtTargetRef.current = null;
            const bnb = (Number(usdt) / lastBnbPrice).toFixed(8);
            setBnbAmount(bnb);
        } else {
            // No price yet — store USDT target and bootstrap with a small BNB amount
            // to trigger the quote fetch. handleFetchBnbQuote will recalculate once price is known.
            bnbUsdtTargetRef.current = Number(usdt);
            setBnbAmount("0.01");
        }
    }

    function parseUsdtToRaw(value, decimals) {
        const d = decimals ?? CONFIG.usdtDecimals;
        if (!value) return "0";
        const [wholePart, decimalPart = ""] = value.split(".");
        const safeWhole = wholePart.replace(/^0+(?=\d)/, "") || "0";
        const safeDecimal = decimalPart.slice(0, d).padEnd(d, "0");
        return `${safeWhole}${safeDecimal}`;
    }

    function getTokenAmountRawFromUsdtRaw(usdtRaw) {
        const raw = BigInt(usdtRaw);
        // usdtRaw is in CONFIG.usdtDecimals precision (6 for contract interface).
        // HYK has 18 decimals, so scale = 10^(18 - 6) = 10^12.
        const scale = BigInt(10 ** (18 - CONFIG.usdtDecimals));
        return (raw * 66n * scale).toString();
    }

    async function handleApproveUsdt() {
        if (isBuying) return;
        try {
            setIsBuying(true);
            setMsg(t("msgApprovingUsdt"), "progress");
            await approveUsdt(account);
            await refreshUsdtAllowance(account);
            setBuyMessage("");
        } catch (err) {
            const rawMsg = String(err?.message || "").toLowerCase();
            const cancelled = err?.code === 4001 || rawMsg.includes("user denied") || rawMsg.includes("user rejected");
            setMsg(cancelled ? t("errApprovalCancelled") : (err?.message || t("errApprovalFailed")), cancelled ? "cancelled" : "error");
        } finally {
            setIsBuying(false);
        }
    }

    async function handleBuyWithUsdt() {
        if (isBuying) return;
        let capturedTxHashForUI = null;
        try {
            setIsBuying(true); setBuyMessage("");
            const usdtAmountRaw = parseUsdtToRaw(usdtAmount);
            const tokenAmountRaw = getTokenAmountRawFromUsdtRaw(usdtAmountRaw);

            // ── Pre-flight checks ─────────────────────────────────────────
            setMsg(t("msgCheckingPresale"), "progress");
            const freshStats = await getPresaleStats();
            console.log("[handleBuyWithUsdt] freshStats:", freshStats);
            if (!freshStats.saleActive) {
                setMsg(t("errPresaleNotActive"));
                return;
            }

            // Check USDT balance
            const freshUserStats = await getUserStats(account);
            const onChainDec = Number(freshUserStats.usdtDecimals ?? CONFIG.usdtDecimals);
            const contractDec = CONFIG.usdtDecimals;
            const usdtBalRaw = BigInt(freshUserStats.usdtBalance ?? "0");
            // If on-chain decimals differ from config (e.g. using test USDT), normalize.
            const usdtBal = onChainDec > contractDec
                ? usdtBalRaw / (10n ** BigInt(onChainDec - contractDec))
                : usdtBalRaw;
            const usdtRawBig = BigInt(usdtAmountRaw);
            if (usdtBal < usdtRawBig) {
                setMsg(t("errInsufficientUsdtBalance")
                    .replace("{have}", (Number(usdtBal) / (10 ** contractDec)).toFixed(2))
                    .replace("{need}", usdtAmount));
                return;
            }
            // ──────────────────────────────────────────────────────────────

            setMsg(t("msgPurchasingUsdt"), "progress");

            // Called immediately when the TX is broadcast (before mining).
            // Enqueue right away so the rescue queue has the entry even if receipt never fires.
            const onHashCaptured = (hash) => {
                capturedTxHashForUI = hash;
                enqueue({
                    walletAddress: String(account), txHash: String(hash),
                    paymentToken: "USDT", usdtAmount: String(usdtAmountRaw),
                    tokenAmount: String(tokenAmountRaw),
                    presaleAddress: String(CONFIG.presaleAddress), vestingAddress: String(CONFIG.vestingAddress),
                    blockNumber: null, chainId: String(CONFIG.chainId),
                    networkName: String(CONFIG.networkName)
                });
                setMsg(t("msgTxSubmitted"), "progress");
            };

            const { receipt, txHash } = await buyWithUsdt(account, usdtAmountRaw, onHashCaptured);

            if (!receipt?.status) { setMsg(t("errUsdtTxFailed")); return; }

            // Build full payload (blockNumber now known from receipt)
            const usdtPayload = {
                walletAddress: String(account), txHash: String(txHash),
                paymentToken: "USDT", usdtAmount: String(usdtAmountRaw), tokenAmount: String(tokenAmountRaw),
                presaleAddress: String(CONFIG.presaleAddress), vestingAddress: String(CONFIG.vestingAddress),
                blockNumber: String(receipt.blockNumber), chainId: String(CONFIG.chainId),
                networkName: String(CONFIG.networkName)
            };

            // Save to DB (item is already in rescue queue; on success we dequeue it)
            let saveResult = null;
            try { saveResult = await savePurchase(usdtPayload); } catch { /* stays in rescue queue */ }

            if (saveResult?.success || saveResult?.message?.toLowerCase().includes("already saved")) {
                dequeue(usdtPayload.txHash);
                setUsdtAmount(""); setThkAmount(""); setBuyMessage("");
                setModal({ type: "success", message: t("msgTokensReserved"), txHash });
                loadChainData(account);
                refreshUsdtAllowance(account);
                pollTxHistoryUntilNew(txHash);
            } else {
                // Transaction confirmed on-chain — rescue queue will retry the DB save
                setModal({ type: "success", message: t("msgTxConfirmedSyncing"), txHash });
                loadChainData(account);
                refreshUsdtAllowance(account);
                pollTxHistoryUntilNew(txHash);
            }
        } catch (error) {
            const txHashForError = capturedTxHashForUI || error.txHash;
            if (txHashForError && isBlockTimeoutError(error)) {
                setModal({
                    type: "error",
                    message: t("errTxBlockTimeout"),
                    txHash: txHashForError,
                });
            } else if (txHashForError) {
                // TX was broadcast — already in rescue queue from onHashCaptured
                setMsg(t("msgTxSubmittedAuto"), "pending");
            } else {
                const code = error?.code;
                const msg  = String(error?.message || "").toLowerCase();
                const isUserCancel = code === 4001 || code === "ACTION_REJECTED" ||
                    msg.includes("user denied") || msg.includes("user rejected") ||
                    msg.includes("metamask tx signature") || msg.includes("cancelled by user");
                if (isUserCancel) {
                    setModal({ type: "cancelled", message: t("msgUserCancelled") });
                } else if (isMetaMaskTimeoutError(error)) {
                    // MetaMask popup was not confirmed within 10 min — auto-expire the buy flow
                    setModal({ type: "cancelled", message: t("msgTxExpired") });
                } else {
                    setMsg(classifyTxError(error, "USDT"));
                }
            }
        } finally {
            setIsBuying(false);
            // Retry any pending rescue queue entries immediately after buy completes
            setTimeout(() => flushRescueQueue(), 3000);
        }
    }

    // Bidirectional USDT ↔ HYK handlers
    function handleSpendChange(val) {
        const v = normalizeUsdtInput(val);
        setUsdtAmount(v);
        const num = Number(v);
        setThkAmount(v && num > 0 ? Math.floor(num * 66).toString() : "");
    }

    function handleThkChange(val) {
        const v = normalizeUsdtInput(val);
        setThkAmount(v);
        const num = Number(v);
        setUsdtAmount(v && num > 0 ? (num / 66).toFixed(2) : "");
    }

    async function handleDisconnect() {
        await destroySession();
        await disconnectWalletConnect();
        navigate("/", { state: { fromDashboard: true } });
    }

    function normalizeUsdtInput(value) { return value.replace(/[^0-9.]/g, ""); }
    function isValidUsdtAmount(value) { const num = Number(value); return !(!value || Number.isNaN(num)) && num >= 10; }

// ── Effects ───────────────────────────────────────────────────
    useEffect(() => {
        async function init() {
            try {
                // Enforce 30-minute session TTL — redirect if missing or expired
                const sessionValid = await validateSession();
                if (!sessionValid) {
                    await disconnectWalletConnect();
                    navigate("/");
                    return;
                }

                let currentAccount = await getCurrentAccount();
                // WalletConnect fallback: provider may not be available yet, use stored wallet
                if (!currentAccount) {
                    currentAccount = localStorage.getItem("hyk_wallet") || null;
                }
                if (!currentAccount) {
                    await disconnectWalletConnect();
                    navigate("/");
                    return;
                }
                setAccount(currentAccount);
                // Retry chain detection up to 10 times (MetaMask may still be in "Connecting" state)
                let chainId = null;
                for (let i = 0; i < 10; i++) {
                    try {
                        chainId = await getCurrentChainId();
                        if (chainId) break;
                    } catch { /* ignore, retry */ }
                    await new Promise(r => setTimeout(r, 600));
                }
                setIsDetectingChain(false);
                setCurrentChainId(chainId || "");
                const correct = chainId && (String(chainId).toLowerCase() === CONFIG.chainHex.toLowerCase() || Number(chainId) === CONFIG.chainId);
                setIsCorrectNetwork(!!correct);
                if (correct) {
                    loadChainData(currentAccount);
                    loadTxHistory();
                    flushRescueQueue();
                }
            } catch (err) {
                // Only kick to landing page for session/account errors, not network errors
                if (err?.message?.includes("session") || err?.message?.includes("account") || err?.message?.includes("wallet")) {
                    await disconnectWalletConnect();
                    navigate("/");
                }
                // Other errors (RPC timeout etc.) — stay on page, user can retry
            }
            finally { setIsLoading(false); }
        }
        init();

        const ethereum = window.ethereum;
        if (ethereum) {
            function handleAccountsChanged(accounts) {
                if (!accounts || accounts.length === 0) {
                    // MetaMask temporarily reports 0 accounts during network-switch.
                    // Wait 2 s and recheck before redirecting.
                    setTimeout(async () => {
                        const current = await getCurrentAccount().catch(() => null);
                        if (!current) navigate("/");
                    }, 2000);
                } else {
                    setAccount(accounts[0]);
                    loadChainData(accounts[0]);
                    loadTxHistory();
                }
            }
            function handleChainChanged(chainId) {
                setCurrentChainId(chainId);
                const correct = String(chainId).toLowerCase() === CONFIG.chainHex.toLowerCase() || Number(chainId) === CONFIG.chainId;
                setIsCorrectNetwork(correct);
                setSwitchNetworkMessage("");
                if (correct) {
                    getCurrentAccount().then((acc) => {
                        if (acc) {
                            loadChainData(acc);
                            loadTxHistory();
                        }
                    });
                }
            }
            // Fires when MetaMask finishes the "Connecting" approval flow
            function handleConnect({ chainId }) {
                if (!chainId) return;
                setIsDetectingChain(false);
                setCurrentChainId(chainId);
                const correct = String(chainId).toLowerCase() === CONFIG.chainHex.toLowerCase() || Number(chainId) === CONFIG.chainId;
                setIsCorrectNetwork(correct);
                setSwitchNetworkMessage("");
                if (correct) {
                    getCurrentAccount().then((acc) => {
                        if (acc) {
                            setAccount(acc);
                            loadChainData(acc);
                            loadTxHistory();
                            flushRescueQueue();
                        }
                    });
                }
            }
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("chainChanged", handleChainChanged);
            ethereum.on("connect", handleConnect);
            return () => {
                ethereum.removeListener("accountsChanged", handleAccountsChanged);
                ethereum.removeListener("chainChanged", handleChainChanged);
                ethereum.removeListener("connect", handleConnect);
            };
        }
    }, [loadChainData, loadTxHistory, flushRescueQueue, pollTxHistoryUntilNew]);

    // Retry rescue queue every 30 s while on the page (catches failed saves without requiring a refresh)
    useEffect(() => {
        const interval = setInterval(() => flushRescueQueue(), 30000);
        return () => clearInterval(interval);
    }, [flushRescueQueue]);

    // Live BNB price — fetch on mount, then refresh every 15 s
    useEffect(() => {
        async function loadPrice() {
            const data = await fetchBnbPrice();
            if (data?.price) {
                setLiveBnbPrice(data.price);
                setLiveBnbChange(data.percentChange24h ?? null);
            }
        }
        loadPrice();
        const interval = setInterval(loadPrice, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!account) { setBnbQuote(null); setBnbQuoteMessage(""); return; }
        const trimmedAmount = String(bnbAmount ?? "").trim();
        if (!trimmedAmount) { setBnbQuote(null); setBnbQuoteMessage(""); return; }
        const timer = setTimeout(() => handleFetchBnbQuote(trimmedAmount), 300);
        return () => clearTimeout(timer);
    }, [account, bnbAmount]);

    // Refresh USDT allowance whenever account connects or user switches to USDT tab
    useEffect(() => {
        if (!account || paymentTab !== "USDT") return;
        setUsdtAllowance(null); // show loading state while fetching
        refreshUsdtAllowance(account);
    }, [account, paymentTab, refreshUsdtAllowance]);

    useEffect(() => {
        getAnnouncements().then(data => { if (data.length > 0) setAnnouncements(data); });
    }, []);

    // ── Session hard-expires after 30 min — fully disconnect wallet on expiry ──
    useEffect(() => {
        const SESSION_TTL_MS = 30 * 60 * 1000;

        function getRemaining() {
            // Always re-read from localStorage so a fresh login resets the timer
            const createdAt = Number(localStorage.getItem("hyk_session_created_at") ?? 0);
            if (!createdAt) return -1;
            return createdAt + SESSION_TTL_MS - Date.now();
        }

        async function expireSession() {
            // Double-check: session may have been refreshed since the timer was set
            if (getRemaining() > 0) return;
            // Never interrupt an ongoing transaction — defer until it finishes
            if (isBuyingRef.current) {
                setTimeout(expireSession, 5000);
                return;
            }
            await destroySession();
            await disconnectWalletConnect();
            navigate("/", { state: { fromDashboard: true } });
        }

        const remaining = getRemaining();
        if (remaining <= 0) {
            expireSession();
            return;
        }
        const timer = setTimeout(expireSession, remaining);
        return () => clearTimeout(timer);
    }, [navigate]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (langSwitcherRef.current && !langSwitcherRef.current.contains(e.target)) {
                setLangDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Derived display values ────────────────────────────────────
    const shortAddr = account ? account.slice(0, 6) + "..." + account.slice(-4) : "";

    const soldRaw = presaleStats?.totalSold ? BigInt(presaleStats.totalSold) : 0n;
    const capRaw = presaleStats?.saleCap ? BigInt(presaleStats.saleCap) : 0n;
    const soldPct = capRaw > 0n ? Number((soldRaw * 10000n) / capRaw) / 100 : 0;
    const soldDisplay = formatNumber(formatUnits(soldRaw, 18), 2);
    const capDisplay = formatNumber(formatUnits(capRaw, 18), 0);
    const remainingRaw = presaleStats?.remainingForSale ? BigInt(presaleStats.remainingForSale) : 0n;
    const remainingDisplay = formatNumber(formatUnits(remainingRaw, 18), 2);

    const totalAlloc = vestingInfo?.vestingData?.totalAmount
        ? formatNumber(formatUnits(vestingInfo.vestingData.totalAmount, 18), 2) : "—";
    const claimed = vestingInfo?.vestingData?.claimed
        ? formatNumber(formatUnits(vestingInfo.vestingData.claimed, 18), 2) : "—";
    const claimableNow = userStats?.claimable
        ? formatNumber(formatUnits(userStats.claimable, 18), 4) : "0";
    const claimableRaw = userStats?.claimable ? BigInt(userStats.claimable) : 0n;

    // Daily vesting allocation (totalAmount / vesting days)
    const dailyAlloc = (() => {
        const total = vestingInfo?.vestingData?.totalAmount;
        const dur = vestingInfo?.vestingDuration;
        if (!total || !dur || dur === "0") return "—";
        const days = Number(dur) / 86400;
        if (days <= 0) return "—";
        const daily = parseFloat(formatUnits(BigInt(String(total)), 18)) / days;
        return formatNumber(daily.toFixed(2), 2);
    })();

    const tge = vestingInfo?.tgeTimestamp ? Number(vestingInfo.tgeTimestamp) : 0;
    const cliff = vestingInfo?.cliffDuration ? Number(vestingInfo.cliffDuration) : 0;
    const vestDur = vestingInfo?.vestingDuration ? Number(vestingInfo.vestingDuration) : 0;
    const now = Math.floor(Date.now() / 1000);


    const cliffEnd = tge > 0 ? tge + cliff : 0;
    const vestEnd = cliffEnd > 0 ? cliffEnd + vestDur : 0;

    // Lock/cliff end date for display (must be after cliffEnd is defined)
    const lockUntilDate = cliffEnd > 0
        ? new Date(cliffEnd * 1000).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
        : "Aug 1, 2026";

    // filtered TX list
    const displayedTx = txTab === "my"
        ? txHistory.filter(tx => tx.wallet_address?.toLowerCase() === account?.toLowerCase())
        : txHistory;

    // ── Styles ───────────────────────────────────────────────────
    const btnBuyStyle = (active) => ({
        width: "100%", padding: "15px",
        background: active ? "linear-gradient(135deg, #FFD94E, #FFA01C)" : "rgba(255,255,255,0.06)",
        color: active ? "#06060F" : "#6666AA",
        border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: "100px",
        fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 900, fontSize: "16px", letterSpacing: "0.06em",
        cursor: active ? "pointer" : "not-allowed",
        transition: "all 0.25s",
        boxShadow: active ? "0 0 24px rgba(255,216,77,0.3)" : "none",
        marginTop: "10px",
    });

    if (isLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#06060F" }}>
                <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", color: "#6666AA", fontSize: "16px" }}>{t("loading")}</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#F0F0FF" }} className={exiting ? "page-exit" : ""}>
            <style>{`
          .ps-header { padding: 0 48px; }
          .ps-content { padding: 90px 48px 60px; display:flex; flex-direction:column; gap:22px; }
          .ps-stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
          .ps-top-grid { display:grid; grid-template-columns:1.1fr 1fr; gap:20px; align-items:start; }
          .ps-vest-steps { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; }
          .ps-back-btn {}
          .ps-wallet-pill {}
          .ps-logo-text {}
          @media (max-width: 767px) {
            .ps-header { padding: 0 16px !important; }
            .ps-content { padding: 80px 16px 40px !important; }
            .ps-stats-row { grid-template-columns: 1fr !important; }
            .ps-top-grid { grid-template-columns: 1fr !important; }
            .ps-vest-steps { grid-template-columns: 1fr 1fr !important; }
            .ps-back-btn { display: none !important; }
            .ps-wallet-pill { display: none !important; }
            .ps-logo-text { display: none !important; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .ps-header { padding: 0 24px !important; }
            .ps-content { padding: 80px 24px 40px !important; }
            .ps-stats-row { grid-template-columns: repeat(3,1fr) !important; }
            .ps-top-grid { grid-template-columns: 1fr !important; }
            .ps-vest-steps { grid-template-columns: repeat(3,1fr) !important; }
            .ps-back-btn { display: none !important; }
          }
          .ps-lang-btn:hover { border-color: rgba(255,255,255,0.2) !important; color: #F0F0FF !important; }
          .ps-lang-opt:hover { background: rgba(255,255,255,0.06) !important; }
          .vd-step-done { border-color: rgba(106,198,69,0.3) !important; }
          .vd-step-active { border-color: rgba(255,159,28,0.4) !important; box-shadow: 0 0 16px rgba(255,159,28,0.1) !important; }
          .vd-step-done::before { background: #6AC645 !important; opacity:1 !important; }
          .vd-step-active::before { background: #FFA01C !important; opacity:1 !important; }
          @keyframes pstep { 0%,100%{box-shadow:0 0 0 transparent} 50%{box-shadow:0 0 10px rgba(255,159,28,0.5)} }
        `}</style>
            <div className="space-bg" />
            <div className="nebula" />
            {[{ top: "12%", w: "160px", delay: "0s" }, { top: "28%", w: "120px", delay: "3.5s" }, { top: "55%", w: "90px", delay: "6s" }].map((s, i) => (
                <div key={i} style={{ position: "fixed", top: s.top, left: "-5%", width: s.w, height: "1.5px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)", transform: "rotate(-20deg)", animation: `shoot 8s linear ${s.delay} infinite`, zIndex: -1, opacity: 0 }} />
            ))}

            {/* ── Header ── */}
            <header className="ps-header" style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                height: "70px",
                background: "rgba(6,6,15,0.7)", backdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                {/* Logo — click to go back to landing page */}
                <a onClick={() => navigate("/", { state: { fromDashboard: true } })} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", textDecoration: "none" }}>
                    <img src="/HiyokoLogo.png" alt="HIYOKO" style={{ width: "38px", height: "38px", objectFit: "contain", borderRadius: "8px" }} />
                    <span className="ps-logo-text" style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 900, fontSize: "22px", color: "#FFD94E", letterSpacing: "0.04em", textShadow: "0 0 20px rgba(255,216,77,0.4)" }}>HIYOKO</span>
                </a>

                {/* Center decorative banner */}
                <img src="/header-banner.png" alt="" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", height: "50px", opacity: 0.18, pointerEvents: "none" }} />

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Language dropdown */}
                    <div ref={langSwitcherRef} style={{ position: "relative" }}>
                        <button
                            className="ps-lang-btn"
                            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                            style={{
                                display: "flex", alignItems: "center", gap: "7px",
                                padding: "7px 13px",
                                background: "rgba(20,20,40,0.85)", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "100px", cursor: "pointer", transition: "all 0.2s",
                                fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 600, fontSize: "13px",
                                color: "#BCBCBC",
                            }}
                        >
                            <img src={SUPPORTED_LANGS.find(l => l.code === lang)?.flagUrl} alt="" style={{ width: "20px", height: "15px", borderRadius: "2px", objectFit: "cover" }} />
                            {SUPPORTED_LANGS.find(l => l.code === lang)?.shortLabel}
                            <span style={{ fontSize: "9px", opacity: 0.5 }}>▼</span>
                        </button>
                        {langDropdownOpen && (
                            <div style={{
                                position: "absolute", top: "calc(100% + 8px)", right: 0,
                                background: "rgba(14,14,28,0.97)", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px", padding: "6px", zIndex: 300,
                                minWidth: "150px", backdropFilter: "blur(20px)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                            }}>
                                {SUPPORTED_LANGS.map((l) => (
                                    <button
                                        key={l.code}
                                        className="ps-lang-opt"
                                        onClick={() => { setLang(l.code); setLangDropdownOpen(false); }}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "10px",
                                            width: "100%", padding: "9px 12px",
                                            background: lang === l.code ? "rgba(255,216,77,0.1)" : "transparent",
                                            border: "none", borderRadius: "8px",
                                            cursor: "pointer", textAlign: "left",
                                            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "13px",
                                            fontWeight: lang === l.code ? 700 : 500,
                                            color: lang === l.code ? "#FFD94E" : "#F0F0FF",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        <img src={l.flagUrl} alt="" style={{ width: "20px", height: "15px", borderRadius: "2px", objectFit: "cover" }} />
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {account && (
                        <div className="ps-wallet-pill" style={{
                            display: "flex", alignItems: "center", gap: "7px",
                            background: "rgba(20,20,40,0.85)", border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "100px", padding: "7px 14px",
                            fontFamily: "'Courier New', monospace", fontSize: "12px", color: "#6666AA",
                            cursor: "pointer",
                        }}
                            onClick={() => { navigator.clipboard?.writeText(account); }}
                            title="Copy address"
                        >
                            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: isCorrectNetwork ? "#6AC645" : "#FFA01C", boxShadow: `0 0 6px ${isCorrectNetwork ? "#6AC645" : "#FFA01C"}` }} />
                            {shortAddr}
                        </div>
                    )}
                    <button className="ps-back-btn" onClick={() => navigate("/", { state: { fromDashboard: true } })} style={{
                        display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(240,240,255,0.7)", borderRadius: "100px",
                        fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 600, fontSize: "13px",
                        cursor: "pointer", transition: "all 0.2s",
                    }}>← Back</button>
                    <button onClick={handleDisconnect} style={{
                        display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px",
                        background: "rgba(255,60,60,0.12)", border: "1px solid rgba(255,60,60,0.4)",
                        color: "#ff6b6b", borderRadius: "100px",
                        fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 700, fontSize: "13px",
                        cursor: "pointer", transition: "all 0.2s",
                    }}>⏻ Disconnect</button>
                </div>
            </header>

            {/* ── Page content ── */}
            <div className="ps-content" style={{ maxWidth: "1280px", margin: "0 auto" }}>

                {/* Title */}
                <div>
                    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 900, fontSize: "38px", letterSpacing: "-0.02em", lineHeight: 1.08, marginTop: "10px" }}>
                        {t("myDashboard1")} <span style={{ color: "#FFD94E", textShadow: "0 0 30px rgba(255,216,77,0.4)" }}>{t("myDashboard2")}</span>
                    </div>
                </div>

                {/* Detecting network — shown while MetaMask is still in "Connecting" state */}
                {isDetectingChain && !isCorrectNetwork && (
                    <div style={{
                        background: "rgba(255,216,77,0.06)", border: "1px solid rgba(255,216,77,0.2)",
                        borderRadius: "16px", padding: "20px 24px",
                        display: "flex", alignItems: "center", gap: "12px",
                    }}>
                        <div style={{ width: "16px", height: "16px", border: "2px solid #FFD94E", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                        <div style={{ fontSize: "14px", color: "#FFD94E", fontWeight: 600 }}>
                            Mendeteksi jaringan... Harap selesaikan koneksi di MetaMask.
                        </div>
                    </div>
                )}

                {/* Wrong network banner */}
                {!isDetectingChain && !isCorrectNetwork && (
                    <div style={{
                        background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.3)",
                        borderRadius: "16px", padding: "20px 24px",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
                    }}>
                        <div>
                            <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 700, fontSize: "16px", color: "#ff6060", marginBottom: "4px" }}>⚠️ {t("wrongNetwork")}</div>
                            <div style={{ fontSize: "13px", color: "#6666AA" }}>{t("connectedTo")} {currentChainId ? `Chain ${Number(currentChainId) || "unknown"}` : t("unknownNetwork")}. {t("switchTo")}</div>
                            {switchNetworkMessage && <div style={{ fontSize: "12px", color: "#ff6060", marginTop: "6px" }}>{switchNetworkMessage}</div>}
                        </div>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {/* Retry button — re-checks chainId without switching (for when MetaMask was still loading) */}
                            <button
                                onClick={async () => {
                                    try {
                                        const chainId = await getCurrentChainId();
                                        if (!chainId) return;
                                        setCurrentChainId(chainId);
                                        const correct = String(chainId).toLowerCase() === CONFIG.chainHex.toLowerCase() || Number(chainId) === CONFIG.chainId;
                                        setIsCorrectNetwork(correct);
                                        if (correct) {
                                            const acc = await getCurrentAccount();
                                            if (acc) { setAccount(acc); loadChainData(acc); loadTxHistory(); flushRescueQueue(); }
                                        }
                                    } catch { /* ignore */ }
                                }}
                                style={{
                                    padding: "11px 20px",
                                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                                    color: "#F0F0FF", borderRadius: "100px",
                                    fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 700, fontSize: "13px",
                                    cursor: "pointer", whiteSpace: "nowrap",
                                }}
                            >↺ Retry</button>
                            <button
                                onClick={handleSwitchNetwork}
                                disabled={isSwitchingNetwork}
                                style={{
                                    padding: "11px 24px",
                                    background: "linear-gradient(135deg, #FFD94E, #FFA01C)",
                                    color: "#06060F", border: "none", borderRadius: "100px",
                                    fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 800, fontSize: "13px",
                                    cursor: isSwitchingNetwork ? "not-allowed" : "pointer",
                                    opacity: isSwitchingNetwork ? 0.6 : 1,
                                    letterSpacing: "0.04em", whiteSpace: "nowrap",
                                }}
                            >
                                {isSwitchingNetwork ? t("switching") : t("switchNetwork")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Dashboard content — always visible; buy buttons disabled when wrong network */}
                {account && (
                    <>
                        {/* ── Vesting stats row ── */}
                        <div className="ps-stats-row">
                            {/* Total Allocation */}
                            <div style={{
                                background: "rgba(14,14,28,0.9)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "16px", padding: "20px 22px",
                                backdropFilter: "blur(10px)", position: "relative", overflow: "hidden",
                                transition: "all 0.3s",
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, #06E5FF, transparent)", opacity: 0.7 }} />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "22px" }}>📦</span>
                                </div>
                                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "6px" }}>Total Allocation</div>
                                <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "22px", fontWeight: 800, color: "#FFA01C", lineHeight: 1.1 }}>
                                    {totalAlloc === "—" ? "0 HYK" : `${totalAlloc} HYK`}
                                </div>
                                <div style={{ fontSize: "11px", color: "#6666AA", marginTop: "5px" }}>
                                    {totalAlloc !== "—" ? `≈ $${formatNumber((parseFloat(totalAlloc.replace(/,/g, "")) * 0.015).toFixed(2), 2)} ${t("atPresalePrice")}` : t("noAllocationYet")}
                                </div>
                            </div>

                            {/* Daily Allocation */}
                            <div style={{
                                background: "rgba(14,14,28,0.9)", border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "16px", padding: "20px 22px",
                                backdropFilter: "blur(10px)", position: "relative", overflow: "hidden",
                                transition: "all 0.25s",
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, #FFD94E, transparent)", opacity: 0.7 }} />
                                <span style={{ fontSize: "22px", marginBottom: "12px", display: "block" }}>📅</span>
                                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "6px" }}>{t("dailyAllocation")}</div>
                                <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "22px", fontWeight: 800, color: "#FFA01C", lineHeight: 1.1 }}>
                                    {dailyAlloc === "—" ? "— HYK" : `${dailyAlloc} HYK`}
                                </div>
                                <div style={{ fontSize: "11px", color: "#6666AA", marginTop: "5px" }}>{t("afterVestingStarts")}</div>
                            </div>

                            {/* Already Claimed */}
                            <div style={{
                                background: "rgba(14,14,28,0.9)", border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "16px", padding: "20px 22px",
                                backdropFilter: "blur(10px)", position: "relative", overflow: "hidden",
                                transition: "all 0.25s",
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, #6AC645, transparent)", opacity: 0.7 }} />
                                <span style={{ fontSize: "22px", marginBottom: "12px", display: "block" }}>✅</span>
                                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "6px" }}>{t("alreadyClaimed")}</div>
                                <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "22px", fontWeight: 800, color: "#FFA01C", lineHeight: 1.1 }}>
                                    {claimed === "—" ? "0 HYK" : `${claimed} HYK`}
                                </div>
                                <div style={{ fontSize: "11px", color: "#6666AA", marginTop: "5px" }}>
                                    {t("disbursed")}: {claimed === "—" ? "0 HYK" : `${claimed} HYK`}
                                </div>
                            </div>
                        </div>

                        {/* ── Claim bar (always shown) ── */}
                        <div style={{
                            background: "rgba(14,14,28,0.9)",
                            border: `1px solid ${claimableRaw > 0n ? "rgba(106,198,69,0.35)" : "rgba(106,198,69,0.2)"}`,
                            borderRadius: "16px", padding: "18px 24px",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            gap: "24px", position: "relative", overflow: "hidden",
                            backdropFilter: "blur(10px)", transition: "border-color 0.25s",
                        }}>
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, #6AC645, transparent)", opacity: 0.7 }} />
                            <div style={{ display: "flex", alignItems: "center", gap: "28px", flex: 1, flexWrap: "wrap" }}>
                                <div>
                                    <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "4px" }}>{t("claimableNow")}</div>
                                    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "20px", fontWeight: 800, color: claimableRaw > 0n ? "#6AC645" : "#6666AA", lineHeight: 1.1 }}>
                                        {claimableNow} HYK
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#6666AA", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                                        🔒 {t("lockedUntil")} {lockUntilDate}
                                    </div>
                                    {claimMessage && (
                                        <div style={{ fontSize: "12px", color: claimMessage.toLowerCase().includes("success") ? "#6AC645" : "#ff6060", marginTop: "6px" }}>
                                            {claimMessage}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ flexShrink: 0 }}>
                                <button
                                    onClick={handleClaim}
                                    disabled={isClaiming || claimableRaw === 0n}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "8px",
                                        padding: "13px 28px",
                                        background: (isClaiming || claimableRaw === 0n) ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #FFD94E, #FFA01C)",
                                        color: (isClaiming || claimableRaw === 0n) ? "#6666AA" : "#06060F",
                                        border: "none", borderRadius: "100px",
                                        fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 800, fontSize: "16px",
                                        cursor: (isClaiming || claimableRaw === 0n) ? "not-allowed" : "pointer",
                                        letterSpacing: "0.04em", whiteSpace: "nowrap",
                                        boxShadow: (isClaiming || claimableRaw === 0n) ? "none" : "0 0 20px rgba(255,160,28,0.35)",
                                        transition: "all 0.25s",
                                        opacity: (isClaiming || claimableRaw === 0n) ? 0.35 : 1,
                                    }}
                                >
                                    🎁 {isClaiming ? t("claiming") : t("claimTokens")}
                                </button>
                                <div style={{ fontSize: "11px", color: "#6666AA", display: "flex", alignItems: "center", gap: "5px", marginTop: "6px", justifyContent: "flex-end" }}>
                                    {t("availableAfter")} {lockUntilDate}
                                </div>
                            </div>
                        </div>

                        {/* ── Buy card + TX panel ── */}
                        <div className="ps-top-grid">

                            {/* ── BUY CARD ── */}
                            <div style={{
                                background: "#0C0C18", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "22px", padding: "22px 24px",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
                                position: "relative", overflow: "hidden",
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #FFA01C, #FFD94E, #06E5FF)" }} />

                                {/* Price header + progress */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                                    <div>
                                        <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6666AA", marginBottom: "3px", fontWeight: 600 }}>{t("presalePrice")}</div>
                                        <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "28px", fontWeight: 900, color: "#FFD94E", lineHeight: 1, textShadow: "0 0 30px rgba(255,216,77,0.5)" }}>
                                            $0.015 <span style={{ fontSize: "13px", color: "#6666AA", fontWeight: 400 }}>USDT / HYK</span>
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#6666AA", marginTop: "3px" }}>
                                            {paymentTab === "USDT" ? t("rateUsdt") : t("rateThk")}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "10px", color: "#6666AA", marginBottom: "4px" }}>{t("networkBsc")}</div>
                                        <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "11px", fontWeight: 700, color: "#FFA01C" }}>🟡 BEP-20</div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                {presaleStats && (
                                    <div style={{ marginBottom: "14px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6666AA", marginBottom: "5px" }}>
                                            <span>{t("soldLabel")}: <span style={{ color: "#F0F0FF" }}>{soldDisplay} HYK</span></span>
                                            <span>{t("capLabel")}: <span style={{ color: "#F0F0FF" }}>{capDisplay} HYK</span></span>
                                        </div>
                                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                                            <div style={{
                                                height: "100%", borderRadius: "100px",
                                                width: `${Math.min(soldPct, 100)}%`,
                                                background: "linear-gradient(90deg, #FFA01C, #FFD94E)",
                                                boxShadow: "0 0 8px rgba(255,216,77,0.4)",
                                                transition: "width 0.5s ease",
                                            }} />
                                        </div>
                                        <div style={{ fontSize: "10px", color: "#FFA01C", marginTop: "4px", textAlign: "right" }}>
                                            {soldPct.toFixed(1)}% {t("percentSold")}
                                        </div>

                                        {/* Presale Stats */}
                                        <div style={{ display: "flex", gap: "6px", marginTop: "12px", flexWrap: "wrap" }}>
                                            {[
                                                { label: t("totalSoldLabel"), value: `${soldDisplay} HYK`, color: "#FFD94E" },
                                                { label: t("hardCapLabel"), value: `${capDisplay} HYK`, color: "#FFD94E" },
                                                { label: t("remainingLabel"), value: `${remainingDisplay} HYK`, color: "#FFD94E" },
                                            ].map(({ label, value, color }) => (
                                                <div key={label} style={{
                                                    flex: 1, minWidth: "90px",
                                                    background: "rgba(255,255,255,0.04)",
                                                    border: "1px solid rgba(255,255,255,0.08)",
                                                    borderRadius: "10px",
                                                    padding: "8px 10px",
                                                }}>
                                                    <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "3px", fontWeight: 600 }}>{label}</div>
                                                    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "12px", fontWeight: 700, color }}>{value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 0 14px" }} />

                                {/* Currency tabs */}
                                <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6666AA", fontWeight: 700, marginBottom: "8px" }}>{t("selectCurrency")}</div>
                                <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                                    {[{ key: "USDT", label: "USDT (BEP-20)" }, { key: "BNB", label: "BNB" }].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => { setPaymentTab(key); setBuyMessage(""); }}
                                            style={{
                                                flex: 1, padding: "8px 4px",
                                                background: "transparent",
                                                border: `1px solid ${paymentTab === key ? "#FFD94E" : "transparent"}`,
                                                borderRadius: "100px",
                                                fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontWeight: 700, fontSize: "12px",
                                                color: paymentTab === key ? "#FFD94E" : "#6666AA",
                                                cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em",
                                            }}
                                        >{label}</button>
                                    ))}
                                </div>
                                {paymentTab === "USDT" && (
                                    <div style={{
                                        fontSize: "11px", color: "#FFA01C", marginBottom: "12px",
                                        background: "rgba(255,159,28,0.08)", border: "1px solid rgba(255,159,28,0.25)",
                                        borderRadius: "8px", padding: "7px 10px",
                                    }}>
                                        {t("bepWarning")}
                                    </div>
                                )}

                                {/* ── USDT TAB ── */}
                                {paymentTab === "USDT" && (() => {
                                    const isApproved = usdtAllowance !== null && BigInt(usdtAllowance) > 0n;
                                    const isLoadingAllowance = usdtAllowance === null;
                                    return (
                                        <>
                                            {userStats?.usdtBalance !== undefined && (
                                                <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px", textAlign: "right" }}>
                                                    {t("balance")}: <span style={{ color: "#F0F0FF" }}>{formatNumber(formatUnits(userStats.usdtBalance, userStats?.usdtDecimals ?? 6), 2)} USDT</span>
                                                </div>
                                            )}

                                            {/* ── Step 1: Approve (no amount input) ── */}
                                            {!isApproved && (
                                                <>
                                                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: "14px", lineHeight: 1.5 }}>
                                                        {t("firstApprove")}
                                                    </div>
                                                    <button
                                                        onClick={handleApproveUsdt}
                                                        disabled={!isCorrectNetwork || isBuying || isLoadingAllowance}
                                                        style={btnBuyStyle(isCorrectNetwork && !isBuying && !isLoadingAllowance)}
                                                    >
                                                        {!isCorrectNetwork ? t("switchNetworkFirst")
                                                            : isLoadingAllowance ? t("checkingAllowance")
                                                            : isBuying ? `⏳ ${t("approving")}`
                                                            : t("approveUsdt")}
                                                    </button>
                                                </>
                                            )}

                                            {/* ── Step 2: Amount inputs + Buy (only after approval) ── */}
                                            {isApproved && (
                                                <>
                                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6666AA", marginBottom: "6px" }}>
                                                        <span>{t("amountToSpend")}</span>
                                                        <span style={{ color: "rgba(255,255,255,0.7)" }}>Min: 10 USDT</span>
                                                    </div>
                                                    <div style={{
                                                        display: "flex", alignItems: "center",
                                                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                                                        borderRadius: "12px", overflow: "hidden", marginBottom: "10px",
                                                    }}>
                                                        <input
                                                            type="text" placeholder="0.00" value={usdtAmount}
                                                            onChange={(e) => handleSpendChange(e.target.value)}
                                                            style={{
                                                                flex: 1, background: "none", border: "none", outline: "none",
                                                                color: "#F0F0FF", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                                fontSize: "16px", fontWeight: 400, padding: "11px 14px",
                                                            }}
                                                        />
                                                        {userStats?.usdtBalance && (
                                                            <button
                                                                onClick={() => handleSpendChange(formatUnits(userStats.usdtBalance, userStats?.usdtDecimals ?? 6))}
                                                                style={{
                                                                    background: "rgba(255,216,77,0.18)", border: "none", cursor: "pointer",
                                                                    color: "#FFD94E", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                                    fontWeight: 800, fontSize: "10px", padding: "5px 10px",
                                                                    borderRadius: "6px", marginRight: "6px", letterSpacing: "0.06em",
                                                                }}
                                                            >MAX</button>
                                                        )}
                                                        <div style={{
                                                            padding: "0 14px", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                            fontWeight: 700, fontSize: "12px", color: "rgba(255,255,255,0.5)",
                                                            borderLeft: "1px solid rgba(255,255,255,0.07)", height: "100%",
                                                            display: "flex", alignItems: "center",
                                                        }}>USDT</div>
                                                    </div>
                                                    <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px" }}>🐣 {t("hykYouReceive")}</div>
                                                    <div style={{
                                                        display: "flex", alignItems: "center",
                                                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,216,77,0.15)",
                                                        borderRadius: "12px", overflow: "hidden", marginBottom: "10px",
                                                    }}>
                                                        <input
                                                            type="text" placeholder="0" value={thkAmount}
                                                            onChange={(e) => handleThkChange(e.target.value)}
                                                            style={{
                                                                flex: 1, background: "none", border: "none", outline: "none",
                                                                color: "#FFD94E", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                                fontSize: "16px", fontWeight: 700, padding: "11px 14px",
                                                            }}
                                                        />
                                                        <div style={{
                                                            padding: "0 14px", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                            fontWeight: 700, fontSize: "12px", color: "#FFD94E",
                                                            borderLeft: "1px solid rgba(255,216,77,0.15)", height: "100%",
                                                            display: "flex", alignItems: "center",
                                                        }}>HYK</div>
                                                    </div>
                                                    {usdtAmount && !isValidUsdtAmount(usdtAmount) && (
                                                        <div style={{ fontSize: "11px", color: "#FFA01C", textAlign: "center", marginBottom: "8px" }}>Minimum purchase is 10 USDT</div>
                                                    )}
                                                    <button onClick={handleBuyWithUsdt} disabled={!isCorrectNetwork || !isValidUsdtAmount(usdtAmount) || isBuying} style={btnBuyStyle(isCorrectNetwork && isValidUsdtAmount(usdtAmount) && !isBuying)}>
                                                        {!isCorrectNetwork ? t("switchNetworkFirst") : isBuying ? `⏳ ${t("buying")}` : t("buyNow")}
                                                    </button>
                                                </>
                                            )}

                                            {buyMessage && (
                                                <div style={{ marginTop: "10px", fontSize: "13px", color: buyMsgColor(), textAlign: "center" }}>{buyMessage}</div>
                                            )}
                                        </>
                                    );
                                })()}

                                {/* ── BNB TAB ── */}
                                {paymentTab === "BNB" && (
                                    <>
                                        {/* BNB balance */}
                                        {userStats?.bnbBalance !== undefined && (
                                            <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px", textAlign: "right" }}>
                                                {t("balance")}: <span style={{ color: "#F0F0FF" }}>{formatNumber(formatUnits(userStats.bnbBalance, 18), 4)} BNB</span>
                                            </div>
                                        )}
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6666AA", marginBottom: "6px" }}>
                                            <span>{t("amountToSpend")}</span>
                                            <span style={{ color: "rgba(255,255,255,0.7)" }}>Min: ~10 USDT worth</span>
                                        </div>
                                        {/* BNB input + MAX */}
                                        <div style={{
                                            display: "flex", alignItems: "center",
                                            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "12px", overflow: "hidden", marginBottom: "10px",
                                        }}>
                                            <input
                                                type="text" placeholder="0.00" value={bnbAmount}
                                                onChange={(e) => handleBnbChange(e.target.value)}
                                                style={{
                                                    flex: 1, background: "none", border: "none", outline: "none",
                                                    color: "#F0F0FF", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                    fontSize: "16px", fontWeight: 400, padding: "11px 14px",
                                                }}
                                            />
                                            {BigInt(String(userStats?.bnbBalance ?? "0")) > 0n && (
                                                <button
                                                    onClick={() => {
                                                        // Leave small reserve for gas (~0.001 BNB)
                                                        const raw = BigInt(userStats.bnbBalance);
                                                        const reserve = BigInt("1000000000000000"); // 0.001 BNB
                                                        const spendable = raw > reserve ? raw - reserve : 0n;
                                                        const val = (Number(spendable) / 1e18).toFixed(6);
                                                        handleBnbChange(val);
                                                    }}
                                                    style={{
                                                        background: "rgba(255,216,77,0.18)", border: "none", cursor: "pointer",
                                                        color: "#FFD94E", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                        fontWeight: 800, fontSize: "10px", padding: "5px 10px",
                                                        borderRadius: "6px", marginRight: "6px", letterSpacing: "0.06em",
                                                    }}
                                                >MAX</button>
                                            )}
                                            <div style={{
                                                padding: "0 14px", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                fontWeight: 700, fontSize: "12px", color: "rgba(255,255,255,0.5)",
                                                borderLeft: "1px solid rgba(255,255,255,0.07)", height: "100%",
                                                display: "flex", alignItems: "center",
                                            }}>BNB</div>
                                        </div>
                                        {/* BNB live price */}
                                        {lastBnbPrice && (
                                            <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px", textAlign: "right" }}>
                                                1 BNB ≈ <span style={{ color: "#FFD94E" }}>${lastBnbPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                                            </div>
                                        )}
                                        {/* USDT equivalent — read-only, computed from BNB/HYK */}
                                        <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px" }}>≈ USDT value {isFetchingBnbQuote && <span style={{ color: "#FFA01C" }}>⏳</span>}</div>
                                        <div style={{
                                            display: "flex", alignItems: "center",
                                            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                                            borderRadius: "12px", overflow: "hidden", marginBottom: "10px",
                                            opacity: 0.7,
                                        }}>
                                            <input
                                                type="text" placeholder="0.00" value={bnbUsdtDisplay}
                                                readOnly
                                                style={{
                                                    flex: 1, background: "none", border: "none", outline: "none",
                                                    color: "#A0A0CC", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                    fontSize: "16px", fontWeight: 400, padding: "11px 14px",
                                                    cursor: "default",
                                                }}
                                            />
                                            <div style={{
                                                padding: "0 14px", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                fontWeight: 700, fontSize: "12px", color: "rgba(255,255,255,0.4)",
                                                borderLeft: "1px solid rgba(255,255,255,0.05)", height: "100%",
                                                display: "flex", alignItems: "center",
                                            }}>USDT</div>
                                        </div>
                                        {/* HYK receive — editable */}
                                        <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px" }}>🐣 {t("hykYouReceive")}</div>
                                        <div style={{
                                            display: "flex", alignItems: "center",
                                            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,216,77,0.15)",
                                            borderRadius: "12px", overflow: "hidden", marginBottom: "10px",
                                        }}>
                                            <input
                                                type="text" placeholder="0" value={bnbThkDisplay}
                                                onChange={(e) => handleBnbThkChange(e.target.value)}
                                                style={{
                                                    flex: 1, background: "none", border: "none", outline: "none",
                                                    color: "#FFD94E", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                    fontSize: "16px", fontWeight: 700, padding: "11px 14px",
                                                }}
                                            />
                                            <div style={{
                                                padding: "0 14px", fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                                                fontWeight: 700, fontSize: "12px", color: "#FFD94E",
                                                borderLeft: "1px solid rgba(255,216,77,0.15)", height: "100%",
                                                display: "flex", alignItems: "center",
                                            }}>HYK</div>
                                        </div>
                                        {bnbQuoteMessage && (
                                            <div style={{ fontSize: "12px", color: "#ff6060", textAlign: "center", marginBottom: "10px" }}>{bnbQuoteMessage}</div>
                                        )}
                                        <button
                                            onClick={handleBuyWithBnb}
                                            disabled={!isCorrectNetwork || !bnbAmount || !bnbQuote || isBuying || isFetchingBnbQuote}
                                            style={btnBuyStyle(isCorrectNetwork && !!bnbAmount && !!bnbQuote && !isBuying && !isFetchingBnbQuote)}
                                        >
                                            {!isCorrectNetwork ? t("switchNetworkFirst") : isBuying ? t("processing") : t("buyNow")}
                                        </button>
                                        {buyMessage && (
                                            <div style={{ marginTop: "10px", fontSize: "13px", color: buyMsgColor(), textAlign: "center" }}>{buyMessage}</div>
                                        )}
                                    </>
                                )}

                                <div style={{ marginTop: "14px", fontSize: "10px", color: "#6666AA", textAlign: "center" }}>
                                    {t("minimum")}
                                </div>
                                <div style={{ marginTop: "6px", fontSize: "10px", color: "#555588", textAlign: "center", fontStyle: "italic" }}>
                                    {t("priceDisclaimer")}
                                </div>
                            </div>

                            {/* ── TX HISTORY PANEL ── */}
                            <div style={{
                                background: "#111120", border: "1px solid rgba(255,255,255,0.09)",
                                borderRadius: "22px", boxShadow: "0 12px 50px rgba(0,0,0,0.5)",
                                overflow: "hidden",
                            }}>
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                                }}>
                                    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "16px", fontWeight: 800, color: "#F0F0FF" }}>{t("txHistory")}</div>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        {["my", "all"].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setTxTab(tab)}
                                                style={{
                                                    padding: "5px 14px",
                                                    background: txTab === tab ? "rgba(255,216,77,0.12)" : "transparent",
                                                    border: `1px solid ${txTab === tab ? "rgba(255,216,77,0.4)" : "rgba(255,255,255,0.08)"}`,
                                                    borderRadius: "100px", fontSize: "11px", fontWeight: 700,
                                                    color: txTab === tab ? "#FFD94E" : "#6666AA",
                                                    cursor: "pointer",
                                                }}
                                            >{tab === "my" ? t("myTx") : t("all")}</button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ padding: "12px", maxHeight: "360px", overflowY: "auto" }}>
                                    {isLoadingTx ? (
                                        <div style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "#6666AA" }}>{t("loading")}</div>
                                    ) : displayedTx.length === 0 ? (
                                        <div style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "#6666AA" }}>{t("noTx")}</div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            {displayedTx.slice(0, 50).map((tx, i) => {
                                                const isBnb = tx.payment_token === "BNB";
                                                const shortAddr = tx.wallet_address
                                                    ? tx.wallet_address.slice(0, 6) + "..." + tx.wallet_address.slice(-4)
                                                    : "";
                                                const timeStr = tx.created_at
                                                    ? formatDate(Math.floor(new Date(tx.created_at).getTime() / 1000))
                                                    : "—";
                                                const amountLabel = isBnb
                                                    ? `${tx.bnb_amount != null ? parseFloat(tx.bnb_amount).toFixed(4) : "—"} BNB`
                                                    : `${tx.usdt_amount != null ? parseFloat(tx.usdt_amount).toFixed(4) : "—"} USDT`;
                                                return (
                                                    <div key={tx.tx_hash || i} style={{
                                                        background: "rgba(255,255,255,0.03)",
                                                        border: "1px solid rgba(255,255,255,0.06)",
                                                        borderRadius: "12px", padding: "10px 14px",
                                                    }}>
                                                        {/* Row 1: token badge · wallet · time · bscscan link */}
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                <span style={{
                                                                    padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: 700,
                                                                    background: isBnb ? "rgba(255,159,28,0.15)" : "rgba(0,229,255,0.1)",
                                                                    color: isBnb ? "#FFA01C" : "#06E5FF",
                                                                    border: `1px solid ${isBnb ? "rgba(255,159,28,0.3)" : "rgba(0,229,255,0.2)"}`,
                                                                }}>{tx.payment_token}</span>
                                                                <span style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "#6666AA" }}>{shortAddr}</span>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                <span style={{ fontSize: "10px", color: "#6666AA" }}>{timeStr}</span>
                                                                <a
                                                                    href={`https://bscscan.com/tx/${tx.tx_hash}`}
                                                                    target="_blank" rel="noreferrer"
                                                                    style={{ fontSize: "10px", color: "#06E5FF", textDecoration: "none", fontWeight: 600 }}
                                                                >↗ BSCScan</a>
                                                            </div>
                                                        </div>
                                                        {/* Row 2: paid → received */}
                                                        <div style={{ fontSize: "12px", color: "#F0F0FF" }}>
                                                            <span style={{ color: "#6666AA", fontSize: "11px" }}>Paid: </span>
                                                            <span style={{ fontWeight: 600 }}>{amountLabel}</span>
                                                            {tx.token_amount && (
                                                                <>
                                                                    <span style={{ color: "#6666AA", fontSize: "11px", margin: "0 6px" }}>→</span>
                                                                    <span style={{ color: "#FFD94E", fontWeight: 700 }}>
                                                                        {formatNumber(parseFloat(tx.token_amount), 4)} HYK
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Vesting Schedule ── */}
                        <div style={{
                            background: "#111120", border: "1px solid rgba(255,255,255,0.09)",
                            borderRadius: "22px", overflow: "hidden",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                        }}>
                            {/* Header */}
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                                flexWrap: "wrap", gap: "10px",
                            }}>
                                <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "16px", fontWeight: 800, color: "#FFA01C" }}>
                                    🔒 {t("vestingSchedule")}
                                </div>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    background: "rgba(255,216,77,0.08)", border: "1px solid rgba(255,216,77,0.2)",
                                    borderRadius: "8px", padding: "4px 10px",
                                    fontSize: "11px", fontWeight: 700, color: "#FFD94E", letterSpacing: "0.04em",
                                }}>
                                    🔒 {t("lockedUntil")} {lockUntilDate}
                                </div>
                            </div>
                            {/* Steps */}
                            <div style={{ padding: "20px 24px" }}>
                                <div className="ps-vest-steps">
                                    {(() => {
                                        function getStepState(idx) {
                                            if (tge === 0) return idx === 0 ? "active" : "upcoming";
                                            if (now < tge) return idx === 0 ? "active" : "upcoming";
                                            if (now < cliffEnd) {
                                                if (idx === 0) return "done";
                                                if (idx === 1) return "active";
                                                return "upcoming";
                                            }
                                            if (now < vestEnd) {
                                                if (idx <= 1) return "done";
                                                if (idx <= 3) return "active";
                                                return "upcoming";
                                            }
                                            return idx <= 3 ? "done" : "active";
                                        }
                                        // Pre-compute states so steps can reference them for val text
                                        const stepStates = [0, 1, 2, 3, 4].map(i => getStepState(i));
                                        const steps = [
                                            {
                                                icon: "🐣",
                                                date: "Now — June 2026",
                                                name: t("step1name"),
                                                val: stepStates[0] === "done" ? "Completed" : stepStates[0] === "active" ? "Presale Live" : "Not Started",
                                                sub: "Buy at $0.015",
                                                valColor: "#6666AA",
                                            },
                                            {
                                                icon: "🔒",
                                                date: cliffEnd > 0 ? `Until ${formatDate(cliffEnd)}` : "Until Aug 1, 2026",
                                                name: t("step2name"),
                                                val: stepStates[1] === "done" ? "Completed" : stepStates[1] === "active" ? "Tokens Locked" : "Not Started",
                                                sub: "All tokens locked",
                                                valColor: "#6666AA",
                                            },
                                            {
                                                icon: "🔓",
                                                date: cliffEnd > 0 ? formatDate(cliffEnd) : "Aug 1, 2026",
                                                name: t("step3name"),
                                                val: stepStates[2] === "done" ? "Unlocked" : stepStates[2] === "active" ? "Vesting Started" : "Not Started",
                                                sub: "Linear · 7 days",
                                                valColor: "#06E5FF",
                                            },
                                            {
                                                icon: "📅",
                                                date: cliffEnd > 0 && vestEnd > 0 ? `${formatDate(cliffEnd)} — ${formatDate(vestEnd)}` : "TGE + 1h — +7 days",
                                                name: t("step4name"),
                                                val: dailyAlloc !== "—" ? `${dailyAlloc} HYK` : "—",
                                                sub: "per day",
                                                valColor: "#6AC645",
                                            },
                                            {
                                                icon: "🎉",
                                                date: vestEnd > 0 ? formatDate(vestEnd) : "May 2027",
                                                name: t("step5name"),
                                                val: totalAlloc !== "—" ? `${totalAlloc} HYK` : "—",
                                                sub: "100% received",
                                                valColor: "#a78bfa",
                                            },
                                        ];
                                        return steps.map((s, i) => {
                                            const state = stepStates[i];
                                            const isDone = state === "done";
                                            const isActive = state === "active";
                                            const isUpcoming = state === "upcoming";
                                            // Color tokens
                                            const doneGreen = "#6AC645";
                                            const activeGreen = "#4ade80";
                                            const borderColor = isDone ? "rgba(106,198,69,0.4)" : isActive ? "rgba(74,222,128,0.55)" : "rgba(255,255,255,0.07)";
                                            const bgColor = isDone ? "rgba(106,198,69,0.06)" : isActive ? "rgba(74,222,128,0.07)" : "rgba(255,255,255,0.02)";
                                            const accentColor = isDone ? doneGreen : isActive ? activeGreen : "transparent";
                                            const iconBg = isDone ? "rgba(106,198,69,0.18)" : isActive ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)";
                                            return (
                                                <div key={i}
                                                    className={isDone ? "vd-step-done" : isActive ? "vd-step-active" : ""}
                                                    style={{
                                                        background: bgColor,
                                                        border: `1px solid ${borderColor}`,
                                                        borderRadius: "14px", padding: "14px",
                                                        position: "relative", overflow: "hidden",
                                                        transition: "border-color 0.2s",
                                                        opacity: isUpcoming ? 0.45 : 1,
                                                        boxShadow: isActive ? "0 0 16px rgba(74,222,128,0.12)" : "none",
                                                    }}>
                                                    {/* top border accent */}
                                                    <div style={{
                                                        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                                                        background: accentColor,
                                                        borderRadius: "14px 14px 0 0",
                                                    }} />
                                                    {/* header row: icon + active badge */}
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                                                        <div style={{
                                                            width: "28px", height: "28px", borderRadius: "50%",
                                                            background: iconBg,
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontSize: "14px",
                                                        }}>{isDone ? "✓" : s.icon}</div>
                                                        {isActive && (
                                                            <div style={{
                                                                fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em",
                                                                textTransform: "uppercase", color: activeGreen,
                                                                background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)",
                                                                borderRadius: "100px", padding: "2px 8px",
                                                                animation: "pstep 1.5s infinite",
                                                            }}>● Active</div>
                                                        )}
                                                        {isDone && (
                                                            <div style={{
                                                                fontSize: "9px", fontWeight: 800, letterSpacing: "0.08em",
                                                                textTransform: "uppercase", color: doneGreen,
                                                                background: "rgba(106,198,69,0.1)", border: "1px solid rgba(106,198,69,0.25)",
                                                                borderRadius: "100px", padding: "2px 8px",
                                                            }}>✓ Done</div>
                                                        )}
                                                    </div>
                                                    {/* date */}
                                                    <div style={{ fontSize: "10px", color: "#6666AA", letterSpacing: "0.04em", marginBottom: "4px" }}>{s.date}</div>
                                                    {/* step name */}
                                                    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "13px", fontWeight: 700, color: isDone || isActive ? "#F0F0FF" : "#8888AA", lineHeight: 1.2, marginBottom: "8px" }}>{s.name}</div>
                                                    {/* status value */}
                                                    <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "13px", fontWeight: 800, color: isDone ? doneGreen : isActive ? activeGreen : s.valColor }}>{s.val}</div>
                                                    {/* sub text */}
                                                    <div style={{ fontSize: "10px", color: "#6666AA", marginTop: "3px", lineHeight: 1.4 }}>{s.sub}</div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* ── Announcements ── */}
                        <div style={{
                            background: "#111120", border: "1px solid rgba(255,255,255,0.09)",
                            borderRadius: "22px", overflow: "hidden",
                        }}>
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                            }}>
                                <div style={{ fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif", fontSize: "16px", fontWeight: 800, color: "#F0F0FF", display: "flex", alignItems: "center", gap: "8px" }}>
                                    📢 {t("announcements")}
                                    {announcements.length > 0 && (
                                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#FFA01C", color: "#06060F", fontSize: "10px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {announcements.length}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                {(() => {
                                    const items = announcements.length > 0
                                        ? [...announcements].sort((a, b) => (b.id || 0) - (a.id || 0))
                                        : [
                                            { icon: "🚀", title: t("ann1title"), body: t("ann1body"), time_label: t("ann1time") },
                                            { icon: "🏥", title: t("ann2title"), body: t("ann2body"), time_label: t("ann2time") },
                                            { icon: "🚗", title: t("ann3title"), body: t("ann3body"), time_label: t("ann3time") },
                                            { icon: "📅", title: t("ann4title"), body: t("ann4body"), time_label: t("ann4time") },
                                        ];
                                    const iconBgs = [
                                        "rgba(255,159,28,0.12)", "rgba(255,216,77,0.1)",
                                        "rgba(0,229,255,0.08)", "rgba(106,198,69,0.1)",
                                        "rgba(170,85,255,0.1)", "rgba(255,102,136,0.1)",
                                    ];
                                    return items.map((item, i) => (
                                        <div key={item.id || i} className="a-item" style={{
                                            display: "flex", alignItems: "flex-start", gap: "12px",
                                            padding: "13px 20px",
                                            borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                                            cursor: "pointer",
                                        }}>
                                            <div style={{
                                                width: "32px", height: "32px", borderRadius: "8px",
                                                background: iconBgs[i % iconBgs.length],
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: "14px", flexShrink: 0, marginTop: "2px",
                                            }}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "13px", fontWeight: 600, color: item.color || item.text_color || "#F0F0FF", lineHeight: 1.4, marginBottom: "3px" }}>{item.title}</div>
                                                <div style={{ fontSize: "12px", color: "#B8B8D8", lineHeight: 1.5 }}>{item.body}</div>
                                                <div style={{ fontSize: "11px", color: "rgba(180,180,220,0.75)", marginTop: "4px" }}>{item.time_label}</div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </>
                )}

            </div>

            {/* ── MessageModal ── */}
            <MessageModal
                type={modal?.type}
                message={modal?.message}
                txHash={modal?.txHash}
                onClose={() => {
                    const shouldReload = modal?.type === "cancelled" || modal?.type === "success";
                    setModal(null);
                    if (shouldReload) window.location.reload();
                }}
            />
        </div>
    );
}

export default PresalePage;
