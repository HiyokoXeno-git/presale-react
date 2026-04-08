import { useCallback, useEffect, useRef, useState } from "react";
import { usePageTransition } from "../App";
import MessageModal from "../components/MessageModal";
import { CONFIG } from "../config/config";
import { useLanguage } from "../hooks/useLanguage";
import { SUPPORTED_LANGS } from "../i18n/translations";
import { destroySession, fetchBnbQuote, getAnnouncements, getUserTransactions, savePurchase, validateSession } from "../services/api";
import { formatDate, formatNumber, formatUnits } from "../services/format";
import {
    approveUsdt,
    buyWithBnb,
    buyWithUsdt,
    claimTokens,
    disconnectWalletConnect,
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
    const [isLoading, setIsLoading] = useState(true);
    const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
    const [switchNetworkMessage, setSwitchNetworkMessage] = useState("");
    const { exiting, transitionTo: navigate } = usePageTransition();

    // Buy form
    const [usdtAmount, setUsdtAmount] = useState("");
    const [thkAmount, setThkAmount] = useState("");  // bidirectional THK input
    const [isBuying, setIsBuying] = useState(false);
    const [buyMessage, setBuyMessage] = useState("");
    const [bnbAmount, setBnbAmount] = useState("");
    const [bnbUsdtDisplay, setBnbUsdtDisplay] = useState("");  // editable USDT in BNB tab
    const [bnbThkDisplay, setBnbThkDisplay] = useState("");    // editable THK in BNB tab
    const [lastBnbPrice, setLastBnbPrice] = useState(null);    // BNB/USDT rate from last quote
    const [bnbQuote, setBnbQuote] = useState(null);
    const [bnbQuoteMessage, setBnbQuoteMessage] = useState("");
    const [isFetchingBnbQuote, setIsFetchingBnbQuote] = useState(false);
    const [paymentTab, setPaymentTab] = useState("USDT");
    const [modal, setModal] = useState(null);

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

    const loadTxHistory = useCallback(async (walletAddress) => {
        try {
            setIsLoadingTx(true);
            const rows = await getUserTransactions(walletAddress);
            setTxHistory(rows);
        } catch {
            setTxHistory([]);
        } finally {
            setIsLoadingTx(false);
        }
    }, []);

    // ── Handlers ──────────────────────────────────────────────────
    async function handleSwitchNetwork() {
        if (isSwitchingNetwork) return;
        try {
            setIsSwitchingNetwork(true);
            setSwitchNetworkMessage("");
            await switchNetwork();
        } catch (err) {
            setSwitchNetworkMessage(err.code === 4001 ? "Network switch rejected." : (err.message || "Failed to switch network."));
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
                setClaimMessage("Tokens claimed successfully!");
                await loadChainData(account);
                setModal({ type: "success", message: "THK tokens claimed successfully!", txHash: receipt.transactionHash });
            } else {
                setClaimMessage("Claim transaction failed.");
            }
        } catch (err) {
            if (err?.code === 4001) {
                setClaimMessage("Claim was cancelled.");
            } else {
                setClaimMessage(err?.message || "Claim failed.");
            }
        } finally {
            setIsClaiming(false);
        }
    }

    async function handleBuyWithBnb() {
        if (isBuying) return;
        try {
            setIsBuying(true);
            setBuyMessage("");
            if (!account) { setBuyMessage("Wallet is not connected."); return; }
            const trimmedBnbAmount = String(bnbAmount ?? "").trim();
            if (!trimmedBnbAmount) { setBuyMessage("Please enter BNB amount."); return; }

            let quote = bnbQuote;
            if (!quote) {
                quote = await fetchBnbQuote(account, trimmedBnbAmount);
                if (!quote || quote.success === false) { setBuyMessage(quote?.message || "Failed to fetch BNB quote."); return; }
                setBnbQuote(quote);
            }
            const now = Math.floor(Date.now() / 1000);
            if (!quote.deadline || now > Number(quote.deadline)) {
                const refreshedQuote = await fetchBnbQuote(account, trimmedBnbAmount);
                if (!refreshedQuote || refreshedQuote.success === false) { setBuyMessage(refreshedQuote?.message || "BNB quote expired."); return; }
                quote = refreshedQuote;
                setBnbQuote(refreshedQuote);
            }

            const usdtAmountRaw = String(quote.usdtAmountRaw ?? "");
            const bnbAmountWei = String(quote.bnbAmountWei ?? "");
            const signature = String(quote.signature ?? "");
            const quoteDeadline = String(quote.deadline ?? "");
            const quoteDigest = String(quote.digest ?? "");

            if (!usdtAmountRaw || !bnbAmountWei || !signature || !quoteDeadline) { setBuyMessage("BNB quote data is incomplete."); return; }
            if (BigInt(usdtAmountRaw) < BigInt("10000000")) { setBuyMessage("Minimum purchase is 10 USDT worth of BNB."); return; }

            const tokenAmountRaw = await getTokenAmount(usdtAmountRaw);
            const receipt = await buyWithBnb(account, bnbAmountWei, usdtAmountRaw, quoteDeadline, signature);

            if (receipt?.status) {
                const saveResult = await savePurchase({
                    walletAddress: String(account), txHash: String(receipt.transactionHash),
                    paymentToken: "BNB", bnbAmountRaw: String(bnbAmountWei),
                    bnbAmount: String(quote.bnbAmount ?? trimmedBnbAmount),
                    usdtAmount: String(usdtAmountRaw), tokenAmount: String(tokenAmountRaw),
                    quoteDeadline: String(quoteDeadline), quoteDigest: String(quoteDigest),
                    presaleAddress: String(CONFIG.presaleAddress), vestingAddress: String(CONFIG.vestingAddress),
                    blockNumber: String(receipt.blockNumber), chainId: String(CONFIG.chainId),
                    networkName: String(CONFIG.networkName)
                });
                if (!saveResult?.success) {
                    setModal({ type: "error", message: "Purchase succeeded but DB save failed." });
                } else {
                    setBnbAmount(""); setBnbUsdtDisplay(""); setBnbThkDisplay(""); setBnbQuote(null);
                    setModal({ type: "success", message: "Your THK tokens have been reserved!", txHash: receipt.transactionHash });
                    loadChainData(account);
                    loadTxHistory(account);
                }
            } else {
                setModal({ type: "error", message: "BNB purchase transaction failed." });
            }
        } catch (error) {
            const msg = String(error?.message || "");
            if (msg.includes("User denied") || msg.includes("MetaMask Tx Signature")) {
                setBuyMessage("Transaction was cancelled.");
            } else {
                setBuyMessage(msg || "BNB purchase failed.");
            }
        } finally {
            setIsBuying(false);
        }
    }

    async function handleFetchBnbQuote(inputBnbAmount) {
        try {
            setBnbQuoteMessage(""); setBnbQuote(null);
            const trimmedAmount = String(inputBnbAmount ?? "").trim();
            if (!account) { setBnbQuoteMessage("Wallet is not connected."); return; }
            if (!trimmedAmount) { setBnbQuote(null); return; }
            const numericAmount = Number(trimmedAmount);
            if (!Number.isFinite(numericAmount) || numericAmount <= 0) { setBnbQuoteMessage("Please enter a valid BNB amount."); return; }
            setIsFetchingBnbQuote(true);
            const result = await fetchBnbQuote(account, trimmedAmount);
            if (!result || result.success === false) { setBnbQuote(null); setBnbQuoteMessage(result?.message || "Failed to fetch BNB quote."); return; }
            setBnbQuote(result);
            // Sync USDT and THK display from quote result
            const usdtVal = parseFloat(String(result.usdtAmount).replace(/,/g, ""));
            const thkVal = parseFloat(String(result.tokenAmount).replace(/,/g, ""));
            if (!isNaN(usdtVal)) setBnbUsdtDisplay(usdtVal.toFixed(6));
            if (!isNaN(thkVal)) setBnbThkDisplay(Math.floor(thkVal).toString());
            // Store BNB/USDT rate for reverse conversion
            if (!isNaN(usdtVal) && numericAmount > 0) setLastBnbPrice(usdtVal / numericAmount);
        } catch (error) {
            setBnbQuote(null); setBnbQuoteMessage(error.message || "Failed to fetch BNB quote.");
        } finally {
            setIsFetchingBnbQuote(false);
        }
    }

    // BNB tab bidirectional handlers
    function handleBnbChange(val) {
        const v = normalizeUsdtInput(val);
        setBnbAmount(v);
        // USDT and THK will be updated when quote comes back (debounced)
        if (!v || Number(v) <= 0) { setBnbUsdtDisplay(""); setBnbThkDisplay(""); setBnbQuote(null); }
    }

    function handleBnbUsdtChange(val) {
        const v = normalizeUsdtInput(val);
        setBnbUsdtDisplay(v);
        const usdt = Number(v);
        if (!v || usdt <= 0) { setBnbThkDisplay(""); setBnbAmount(""); setBnbQuote(null); return; }
        // THK = USDT / 0.015
        setBnbThkDisplay(Math.floor(usdt / 0.015).toString());
        // BNB = USDT / rate (use last known price)
        if (lastBnbPrice && lastBnbPrice > 0) {
            const bnb = (usdt / lastBnbPrice).toFixed(8);
            setBnbAmount(bnb);
        }
    }

    function handleBnbThkChange(val) {
        const v = normalizeUsdtInput(val);
        setBnbThkDisplay(v);
        const thk = Number(v);
        if (!v || thk <= 0) { setBnbUsdtDisplay(""); setBnbAmount(""); setBnbQuote(null); return; }
        // USDT = THK * 0.015
        const usdt = (thk * 0.015).toFixed(6);
        setBnbUsdtDisplay(usdt);
        // BNB = USDT / rate
        if (lastBnbPrice && lastBnbPrice > 0) {
            const bnb = (Number(usdt) / lastBnbPrice).toFixed(8);
            setBnbAmount(bnb);
        }
    }

    function parseUsdtToRaw(value, decimals) {
        const d = decimals ?? userStats?.usdtDecimals ?? 6;
        if (!value) return "0";
        const [wholePart, decimalPart = ""] = value.split(".");
        const safeWhole = wholePart.replace(/^0+(?=\d)/, "") || "0";
        const safeDecimal = decimalPart.slice(0, d).padEnd(d, "0");
        return `${safeWhole}${safeDecimal}`;
    }

    function getTokenAmountRawFromUsdtRaw(usdtRaw) {
        const raw = BigInt(usdtRaw);
        return (raw * 66n * 1000000000000n).toString();
    }

    async function handleBuyWithUsdt() {
        if (isBuying) return;
        try {
            setIsBuying(true); setBuyMessage("");
            const usdtAmountRaw = parseUsdtToRaw(usdtAmount);

            // ── Pre-flight: only check saleActive ─────────────────────────
            setBuyMessage("Checking presale status...");
            const freshStats = await getPresaleStats();
            if (!freshStats.saleActive) {
                setBuyMessage("The presale is not currently active.");
                return;
            }
            // ──────────────────────────────────────────────────────────────

            // Auto-approve if allowance is insufficient
            const allowance = await getUsdtAllowance(account);
            if (BigInt(allowance) < BigInt(usdtAmountRaw)) {
                setBuyMessage("Step 1/2: Approving USDT... Please confirm in wallet.");
                await approveUsdt(account);
            }

            setBuyMessage("Step 2/2: Purchasing... Please confirm in wallet.");
            const tokenAmountRaw = getTokenAmountRawFromUsdtRaw(usdtAmountRaw);
            const receipt = await buyWithUsdt(account, usdtAmountRaw);
            if (!receipt?.status) { setBuyMessage("USDT purchase transaction was not successful."); return; }
            const saveResult = await savePurchase({
                walletAddress: String(account), txHash: String(receipt.transactionHash),
                paymentToken: "USDT", usdtAmount: String(usdtAmountRaw), tokenAmount: String(tokenAmountRaw),
                presaleAddress: String(CONFIG.presaleAddress), vestingAddress: String(CONFIG.vestingAddress),
                blockNumber: String(receipt.blockNumber), chainId: String(CONFIG.chainId),
                networkName: String(CONFIG.networkName)
            });
            if (saveResult?.success) {
                setUsdtAmount(""); setThkAmount("");
                setModal({ type: "success", message: "Your THK tokens have been reserved!", txHash: receipt.transactionHash });
                loadChainData(account);
                loadTxHistory(account);
            } else {
                setModal({ type: "error", message: saveResult?.message || "Purchase succeeded but DB save failed." });
            }
        } catch (error) {
            if (error?.code === 4001 || error?.message?.includes("User denied")) {
                setBuyMessage("Transaction was cancelled.");
            } else {
                setBuyMessage(error?.message || "USDT purchase failed.");
            }
        } finally {
            setIsBuying(false);
        }
    }

    // Bidirectional USDT ↔ THK handlers
    function handleSpendChange(val) {
        const v = normalizeUsdtInput(val);
        setUsdtAmount(v);
        const num = Number(v);
        setThkAmount(v && num > 0 ? Math.floor(num / 0.015).toString() : "");
    }

    function handleThkChange(val) {
        const v = normalizeUsdtInput(val);
        setThkAmount(v);
        const num = Number(v);
        setUsdtAmount(v && num > 0 ? (num * 0.015).toFixed(2) : "");
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
                // Enforce 24-hour server session — redirect if missing or expired
                const sessionValid = await validateSession();
                if (!sessionValid) { navigate("/"); return; }

                const currentAccount = await getCurrentAccount();
                if (!currentAccount) { navigate("/"); return; }
                setAccount(currentAccount);
                const chainId = await getCurrentChainId();
                setCurrentChainId(chainId || "");
                const correct = chainId && (String(chainId).toLowerCase() === CONFIG.chainHex.toLowerCase() || Number(chainId) === CONFIG.chainId);
                setIsCorrectNetwork(!!correct);
                if (correct) {
                    loadChainData(currentAccount);
                    loadTxHistory(currentAccount);
                }
            } catch { navigate("/"); }
            finally { setIsLoading(false); }
        }
        init();

        const ethereum = window.ethereum;
        if (ethereum) {
            function handleAccountsChanged(accounts) {
                if (!accounts || accounts.length === 0) { navigate("/"); }
                else {
                    setAccount(accounts[0]);
                    loadChainData(accounts[0]);
                    loadTxHistory(accounts[0]);
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
                            loadTxHistory(acc);
                        }
                    });
                }
            }
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("chainChanged", handleChainChanged);
            return () => {
                ethereum.removeListener("accountsChanged", handleAccountsChanged);
                ethereum.removeListener("chainChanged", handleChainChanged);
            };
        }
    }, [loadChainData, loadTxHistory]);

    useEffect(() => {
        if (!account) { setBnbQuote(null); setBnbQuoteMessage(""); return; }
        const trimmedAmount = String(bnbAmount ?? "").trim();
        if (!trimmedAmount) { setBnbQuote(null); setBnbQuoteMessage(""); return; }
        const timer = setTimeout(() => handleFetchBnbQuote(trimmedAmount), 300);
        return () => clearTimeout(timer);
    }, [account, bnbAmount]);

    useEffect(() => {
        getAnnouncements().then(data => { if (data.length > 0) setAnnouncements(data); });
    }, []);

    // ── Auto-logout at 23:59 local time ──────────────────────────
    useEffect(() => {
        function getMsUntil2359() {
            const now = new Date();
            const target = new Date(
                now.getFullYear(), now.getMonth(), now.getDate(),
                23, 59, 0, 0
            );
            // If 23:59 has already passed today, target tomorrow
            if (now >= target) target.setDate(target.getDate() + 1);
            return target - now;
        }

        let timer;
        function scheduleLogout() {
            const ms = getMsUntil2359();
            timer = setTimeout(async () => {
                await destroySession();
                await disconnectWalletConnect();
                navigate("/", { state: { fromDashboard: true } });
            }, ms);
        }

        scheduleLogout();
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

    const presaleActive = presaleStats?.saleActive ?? true;
    const cliffEnd = tge > 0 ? tge + cliff : 0;
    const vestEnd = cliffEnd > 0 ? cliffEnd + vestDur : 0;

    // Lock/cliff end date for display (must be after cliffEnd is defined)
    const lockUntilDate = cliffEnd > 0
        ? new Date(cliffEnd * 1000).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
        : "Aug 1, 2026";

    // Live THK preview from current input (updates Total Allocation card in real-time)
    const previewHyk = (() => {
        if (paymentTab === "USDT" && usdtAmount && Number(usdtAmount) > 0) {
            return Math.floor(Number(usdtAmount) / 0.015);
        }
        if (paymentTab === "BNB" && bnbQuote?.tokenAmount) {
            const raw = parseFloat(String(bnbQuote.tokenAmount).replace(/,/g, ""));
            return isNaN(raw) ? null : Math.floor(raw);
        }
        return null;
    })();

    // filtered TX list
    const displayedTx = txTab === "my"
        ? txHistory.filter(tx => tx.wallet_address?.toLowerCase() === account?.toLowerCase())
        : txHistory;

    // ── Styles ───────────────────────────────────────────────────
    const btnBuyStyle = (active) => ({
        width: "100%", padding: "15px",
        background: active ? "linear-gradient(135deg, #FFD84D, #FF9F1C)" : "rgba(255,255,255,0.06)",
        color: active ? "#06060F" : "#6666AA",
        border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: "100px",
        fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "16px", letterSpacing: "0.06em",
        cursor: active ? "pointer" : "not-allowed",
        transition: "all 0.25s",
        boxShadow: active ? "0 0 24px rgba(255,216,77,0.3)" : "none",
        marginTop: "10px",
    });

    if (isLoading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#06060F" }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", color: "#6666AA", fontSize: "16px" }}>{t("loading")}</div>
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
          .vd-step-active::before { background: #FF9F1C !important; opacity:1 !important; }
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
                    <span className="ps-logo-text" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "22px", color: "#FFD84D", letterSpacing: "0.04em", textShadow: "0 0 20px rgba(255,216,77,0.4)" }}>HIYOKO</span>
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
                                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "13px",
                                color: "#F0F0FF",
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
                                            fontFamily: "'Outfit', sans-serif", fontSize: "13px",
                                            fontWeight: lang === l.code ? 700 : 500,
                                            color: lang === l.code ? "#FFD84D" : "#F0F0FF",
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

                    {isCorrectNetwork && (
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
                            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6AC645", boxShadow: "0 0 6px #6AC645" }} />
                            {shortAddr}
                        </div>
                    )}
                    <button className="ps-back-btn" onClick={() => navigate("/", { state: { fromDashboard: true } })} style={{
                        display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(240,240,255,0.7)", borderRadius: "100px",
                        fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "13px",
                        cursor: "pointer", transition: "all 0.2s",
                    }}>← Back</button>
                    <button onClick={handleDisconnect} style={{
                        display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px",
                        background: "rgba(255,60,60,0.12)", border: "1px solid rgba(255,60,60,0.4)",
                        color: "#ff6b6b", borderRadius: "100px",
                        fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "13px",
                        cursor: "pointer", transition: "all 0.2s",
                    }}>⏻ Disconnect</button>
                </div>
            </header>

            {/* ── Page content ── */}
            <div className="ps-content" style={{ maxWidth: "1280px", margin: "0 auto" }}>

                {/* Title */}
                <div>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "7px",
                        padding: "5px 14px",
                        background: presaleActive ? "rgba(255,159,28,0.12)" : "rgba(106,198,69,0.08)",
                        border: `1px solid ${presaleActive ? "rgba(255,159,28,0.35)" : "rgba(106,198,69,0.25)"}`,
                        borderRadius: "100px", fontSize: "11px", fontWeight: 700,
                        color: presaleActive ? "#FF9F1C" : "#6AC645",
                        letterSpacing: "0.1em", textTransform: "uppercase", width: "fit-content",
                    }}>
                        <div style={{ width: "7px", height: "7px", background: presaleActive ? "#FF9F1C" : "#6AC645", borderRadius: "50%", boxShadow: `0 0 8px ${presaleActive ? "#FF9F1C" : "#6AC645"}`, animation: "blink 1.8s infinite" }} />
                        {presaleActive ? t("presaleLive") : t("presaleEnded")}
                    </div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "38px", letterSpacing: "-0.02em", lineHeight: 1.08, marginTop: "10px" }}>
                        {t("myDashboard1")} <span style={{ color: "#FFD84D", textShadow: "0 0 30px rgba(255,216,77,0.4)" }}>{t("myDashboard2")}</span>
                    </div>
                </div>

                {/* Wrong network banner */}
                {!isCorrectNetwork && (
                    <div style={{
                        background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.3)",
                        borderRadius: "16px", padding: "20px 24px",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
                    }}>
                        <div>
                            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "16px", color: "#ff6060", marginBottom: "4px" }}>⚠️ {t("wrongNetwork")}</div>
                            <div style={{ fontSize: "13px", color: "#6666AA" }}>{t("connectedTo")} {currentChainId || "unknown"}. {t("switchTo")}</div>
                            {switchNetworkMessage && <div style={{ fontSize: "12px", color: "#ff6060", marginTop: "6px" }}>{switchNetworkMessage}</div>}
                        </div>
                        <button
                            onClick={handleSwitchNetwork}
                            disabled={isSwitchingNetwork}
                            style={{
                                padding: "11px 24px",
                                background: "linear-gradient(135deg, #FFD84D, #FF9F1C)",
                                color: "#06060F", border: "none", borderRadius: "100px",
                                fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "13px",
                                cursor: isSwitchingNetwork ? "not-allowed" : "pointer",
                                opacity: isSwitchingNetwork ? 0.6 : 1,
                                letterSpacing: "0.04em", whiteSpace: "nowrap",
                            }}
                        >
                            {isSwitchingNetwork ? t("switching") : t("switchNetwork")}
                        </button>
                    </div>
                )}

                {isCorrectNetwork && (
                    <>
                        {/* ── Vesting stats row ── */}
                        <div className="ps-stats-row">
                            {/* Total Allocation */}
                            <div style={{
                                background: "rgba(14,14,28,0.9)",
                                border: `1px solid ${previewHyk !== null ? "rgba(255,216,77,0.25)" : "rgba(255,255,255,0.07)"}`,
                                borderRadius: "16px", padding: "20px 22px",
                                backdropFilter: "blur(10px)", position: "relative", overflow: "hidden",
                                transition: "all 0.3s",
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", borderRadius: "16px 16px 0 0", background: previewHyk !== null ? "linear-gradient(90deg, #FFD84D, transparent)" : "linear-gradient(90deg, #00E5FF, transparent)", opacity: 0.7, transition: "background 0.3s" }} />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "22px" }}>📦</span>
                                    {previewHyk !== null && (
                                        <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#FFD84D", background: "rgba(255,216,77,0.1)", border: "1px solid rgba(255,216,77,0.25)", borderRadius: "100px", padding: "2px 8px" }}>Preview</span>
                                    )}
                                </div>
                                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "6px" }}>Total Allocation</div>
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 800, color: previewHyk !== null ? "#FFD84D" : "#00E5FF", lineHeight: 1.1, transition: "color 0.2s" }}>
                                    {previewHyk !== null
                                        ? `${formatNumber(previewHyk.toString(), 0)} THK`
                                        : totalAlloc === "—" ? "0 THK" : `${totalAlloc} THK`}
                                </div>
                                <div style={{ fontSize: "11px", color: "#6666AA", marginTop: "5px" }}>
                                    {previewHyk !== null
                                        ? `≈ $${formatNumber((previewHyk * 0.015).toFixed(2), 2)} ${t("atPresalePrice")}`
                                        : totalAlloc !== "—" ? `≈ $${formatNumber((parseFloat(totalAlloc.replace(/,/g, "")) * 0.015).toFixed(2), 2)} ${t("atPresalePrice")}` : t("noAllocationYet")}
                                </div>
                            </div>

                            {/* Daily Allocation */}
                            <div style={{
                                background: "rgba(14,14,28,0.9)", border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "16px", padding: "20px 22px",
                                backdropFilter: "blur(10px)", position: "relative", overflow: "hidden",
                                transition: "all 0.25s",
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, #FFD84D, transparent)", opacity: 0.7 }} />
                                <span style={{ fontSize: "22px", marginBottom: "12px", display: "block" }}>📅</span>
                                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "6px" }}>{t("dailyAllocation")}</div>
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 800, color: "#FFD84D", lineHeight: 1.1 }}>
                                    {dailyAlloc === "—" ? "— THK" : `${dailyAlloc} THK`}
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
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 800, color: "#6AC645", lineHeight: 1.1 }}>
                                    {claimed === "—" ? "0 THK" : `${claimed} THK`}
                                </div>
                                <div style={{ fontSize: "11px", color: "#6666AA", marginTop: "5px" }}>
                                    {t("Provided")}: {claimed === "—" ? "0 THK" : `${claimed} THK`}
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
                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 800, color: claimableRaw > 0n ? "#6AC645" : "#6666AA", lineHeight: 1.1 }}>
                                        {claimableNow} THK
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
                                        background: (isClaiming || claimableRaw === 0n) ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #6AC645, #4ade80)",
                                        color: (isClaiming || claimableRaw === 0n) ? "#6666AA" : "#06060F",
                                        border: "none", borderRadius: "100px",
                                        fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "14px",
                                        cursor: (isClaiming || claimableRaw === 0n) ? "not-allowed" : "pointer",
                                        letterSpacing: "0.04em", whiteSpace: "nowrap",
                                        boxShadow: (isClaiming || claimableRaw === 0n) ? "none" : "0 0 20px rgba(106,198,69,0.25)",
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
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #FF9F1C, #FFD84D, #00E5FF)" }} />

                                {/* Price header + progress */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                                    <div>
                                        <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6666AA", marginBottom: "3px", fontWeight: 600 }}>{t("presalePrice")}</div>
                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "28px", fontWeight: 900, color: "#FFD84D", lineHeight: 1, textShadow: "0 0 30px rgba(255,216,77,0.5)" }}>
                                            $0.015 <span style={{ fontSize: "13px", color: "#6666AA", fontWeight: 400 }}>USDT / THK</span>
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#6666AA", marginTop: "3px" }}>
                                            {paymentTab === "USDT" ? "= 66.67 THK per USDT" : "≈ $0.015 per THK"}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "10px", color: "#6666AA", marginBottom: "4px" }}>BSC (BEP-20)</div>
                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, color: "#FF9F1C" }}>🟡 BEP-20</div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                {presaleStats && (
                                    <div style={{ marginBottom: "14px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6666AA", marginBottom: "5px" }}>
                                            <span>Sold: <span style={{ color: "#F0F0FF" }}>{soldDisplay} THK</span></span>
                                            <span>Cap: <span style={{ color: "#F0F0FF" }}>{capDisplay} THK</span></span>
                                        </div>
                                        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                                            <div style={{
                                                height: "100%", borderRadius: "100px",
                                                width: `${Math.min(soldPct, 100)}%`,
                                                background: "linear-gradient(90deg, #FF9F1C, #FFD84D)",
                                                boxShadow: "0 0 8px rgba(255,216,77,0.4)",
                                                transition: "width 0.5s ease",
                                            }} />
                                        </div>
                                        <div style={{ fontSize: "10px", color: "#FF9F1C", marginTop: "4px", textAlign: "right" }}>
                                            {soldPct.toFixed(1)}% {t("percentSold")}
                                        </div>
                                    </div>
                                )}

                                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 0 14px" }} />

                                {/* Currency tabs */}
                                <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6666AA", fontWeight: 700, marginBottom: "8px" }}>{t("selectCurrency")}</div>
                                <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
                                    {["USDT", "BNB"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => { setPaymentTab(tab); setBuyMessage(""); }}
                                            style={{
                                                flex: 1, padding: "8px 4px",
                                                background: "transparent",
                                                border: `1px solid ${paymentTab === tab ? "#FFD84D" : "transparent"}`,
                                                borderRadius: "100px",
                                                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "12px",
                                                color: paymentTab === tab ? "#FFD84D" : "#6666AA",
                                                cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em",
                                            }}
                                        >{tab}</button>
                                    ))}
                                </div>

                                {/* ── USDT TAB ── */}
                                {paymentTab === "USDT" && (
                                    <>
                                        {userStats?.usdtBalance !== undefined && (
                                            <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px", textAlign: "right" }}>
                                                Balance: <span style={{ color: "#F0F0FF" }}>{formatNumber(formatUnits(userStats.usdtBalance, userStats?.usdtDecimals ?? 6), 2)} USDT</span>
                                            </div>
                                        )}
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
                                                    color: "#F0F0FF", fontFamily: "'Outfit', sans-serif",
                                                    fontSize: "16px", fontWeight: 400, padding: "11px 14px",
                                                }}
                                            />
                                            {userStats?.usdtBalance && (
                                                <button
                                                    onClick={() => handleSpendChange(formatUnits(userStats.usdtBalance, userStats?.usdtDecimals ?? 6))}
                                                    style={{
                                                        background: "rgba(255,216,77,0.18)", border: "none", cursor: "pointer",
                                                        color: "#FFD84D", fontFamily: "'Outfit', sans-serif",
                                                        fontWeight: 800, fontSize: "10px", padding: "5px 10px",
                                                        borderRadius: "6px", marginRight: "6px", letterSpacing: "0.06em",
                                                    }}
                                                >MAX</button>
                                            )}
                                            <div style={{
                                                padding: "0 14px", fontFamily: "'Outfit', sans-serif",
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
                                                    color: "#FFD84D", fontFamily: "'Outfit', sans-serif",
                                                    fontSize: "16px", fontWeight: 700, padding: "11px 14px",
                                                }}
                                            />
                                            <div style={{
                                                padding: "0 14px", fontFamily: "'Outfit', sans-serif",
                                                fontWeight: 700, fontSize: "12px", color: "#FFD84D",
                                                borderLeft: "1px solid rgba(255,216,77,0.15)", height: "100%",
                                                display: "flex", alignItems: "center",
                                            }}>THK</div>
                                        </div>
                                        {usdtAmount && !isValidUsdtAmount(usdtAmount) && (
                                            <div style={{ fontSize: "11px", color: "#FF9F1C", textAlign: "center", marginBottom: "8px" }}>Minimum purchase is 10 USDT</div>
                                        )}
                                        <button onClick={handleBuyWithUsdt} disabled={!isValidUsdtAmount(usdtAmount) || isBuying} style={btnBuyStyle(isValidUsdtAmount(usdtAmount) && !isBuying)}>
                                            {isBuying ? `⏳ ${t("buying")}` : t("buyNow")}
                                        </button>
                                        {buyMessage && (
                                            <div style={{ marginTop: "10px", fontSize: "13px", color: buyMessage.startsWith("Step") ? "#FF9F1C" : "#ff6060", textAlign: "center" }}>{buyMessage}</div>
                                        )}
                                    </>
                                )}

                                {/* ── BNB TAB ── */}
                                {paymentTab === "BNB" && (
                                    <>
                                        {/* BNB balance + min row */}
                                        {userStats?.bnbBalance !== undefined && (
                                            <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px", textAlign: "right" }}>
                                                Balance: <span style={{ color: "#F0F0FF" }}>{formatNumber(formatUnits(userStats.bnbBalance, 18), 4)} BNB</span>
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
                                                    color: "#F0F0FF", fontFamily: "'Outfit', sans-serif",
                                                    fontSize: "16px", fontWeight: 400, padding: "11px 14px",
                                                }}
                                            />
                                            {userStats?.bnbBalance && BigInt(userStats.bnbBalance) > 0n && (
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
                                                        color: "#FFD84D", fontFamily: "'Outfit', sans-serif",
                                                        fontWeight: 800, fontSize: "10px", padding: "5px 10px",
                                                        borderRadius: "6px", marginRight: "6px", letterSpacing: "0.06em",
                                                    }}
                                                >MAX</button>
                                            )}
                                            <div style={{
                                                padding: "0 14px", fontFamily: "'Outfit', sans-serif",
                                                fontWeight: 700, fontSize: "12px", color: "rgba(255,255,255,0.5)",
                                                borderLeft: "1px solid rgba(255,255,255,0.07)", height: "100%",
                                                display: "flex", alignItems: "center",
                                            }}>BNB</div>
                                        </div>
                                        {/* USDT equivalent — editable */}
                                        <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px" }}>≈ USDT value {isFetchingBnbQuote && <span style={{ color: "#FF9F1C" }}>⏳</span>}</div>
                                        <div style={{
                                            display: "flex", alignItems: "center",
                                            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "12px", overflow: "hidden", marginBottom: "10px",
                                        }}>
                                            <input
                                                type="text" placeholder="0.00" value={bnbUsdtDisplay}
                                                onChange={(e) => handleBnbUsdtChange(e.target.value)}
                                                style={{
                                                    flex: 1, background: "none", border: "none", outline: "none",
                                                    color: "#F0F0FF", fontFamily: "'Outfit', sans-serif",
                                                    fontSize: "16px", fontWeight: 400, padding: "11px 14px",
                                                }}
                                            />
                                            <div style={{
                                                padding: "0 14px", fontFamily: "'Outfit', sans-serif",
                                                fontWeight: 700, fontSize: "12px", color: "rgba(255,255,255,0.5)",
                                                borderLeft: "1px solid rgba(255,255,255,0.07)", height: "100%",
                                                display: "flex", alignItems: "center",
                                            }}>USDT</div>
                                        </div>
                                        {/* THK receive — editable */}
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
                                                    color: "#FFD84D", fontFamily: "'Outfit', sans-serif",
                                                    fontSize: "16px", fontWeight: 700, padding: "11px 14px",
                                                }}
                                            />
                                            <div style={{
                                                padding: "0 14px", fontFamily: "'Outfit', sans-serif",
                                                fontWeight: 700, fontSize: "12px", color: "#FFD84D",
                                                borderLeft: "1px solid rgba(255,216,77,0.15)", height: "100%",
                                                display: "flex", alignItems: "center",
                                            }}>THK</div>
                                        </div>
                                        {bnbQuoteMessage && (
                                            <div style={{ fontSize: "12px", color: "#ff6060", textAlign: "center", marginBottom: "10px" }}>{bnbQuoteMessage}</div>
                                        )}
                                        <button
                                            onClick={handleBuyWithBnb}
                                            disabled={!bnbAmount || !bnbQuote || isBuying || isFetchingBnbQuote}
                                            style={btnBuyStyle(!!bnbAmount && !!bnbQuote && !isBuying && !isFetchingBnbQuote)}
                                        >
                                            {isBuying ? "⏳ Processing..." : "BUY NOW"}
                                        </button>
                                        {buyMessage && (
                                            <div style={{ marginTop: "10px", fontSize: "13px", color: "#ff6060", textAlign: "center" }}>{buyMessage}</div>
                                        )}
                                    </>
                                )}

                                <div style={{ marginTop: "14px", fontSize: "10px", color: "#6666AA", textAlign: "center" }}>
                                    {t("minimum")}
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
                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", fontWeight: 800, color: "#F0F0FF" }}>{t("txHistory")}</div>
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
                                                    color: txTab === tab ? "#FFD84D" : "#6666AA",
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
                                            {displayedTx.slice(0, 20).map((tx, i) => (
                                                <div key={tx.id || tx.tx_hash || i} style={{
                                                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                                                    borderRadius: "12px", padding: "12px 14px",
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                            <span style={{
                                                                padding: "2px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: 700,
                                                                background: tx.payment_token === "BNB" ? "rgba(255,159,28,0.15)" : "rgba(0,229,255,0.1)",
                                                                color: tx.payment_token === "BNB" ? "#FF9F1C" : "#00E5FF",
                                                                border: `1px solid ${tx.payment_token === "BNB" ? "rgba(255,159,28,0.3)" : "rgba(0,229,255,0.2)"}`,
                                                            }}>{tx.payment_token}</span>
                                                            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "#6666AA" }}>
                                                                {tx.wallet_address ? tx.wallet_address.slice(0, 6) + "..." + tx.wallet_address.slice(-4) : ""}
                                                            </span>
                                                        </div>
                                                        <a
                                                            href={`https://testnet.bscscan.com/tx/${tx.tx_hash}`}
                                                            target="_blank" rel="noreferrer"
                                                            style={{ fontSize: "10px", color: "#00E5FF", textDecoration: "none" }}
                                                        >↗ Tx</a>
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div>
                                                            <span style={{ fontSize: "11px", color: "#6666AA" }}>USDT: </span>
                                                            <span style={{ fontSize: "12px", color: "#F0F0FF", fontWeight: 600 }}>{tx.usdt_amount}</span>
                                                        </div>
                                                        <div>
                                                            <span style={{ fontSize: "11px", color: "#6666AA" }}>THK: </span>
                                                            <span style={{ fontSize: "12px", color: "#FFD84D", fontWeight: 700 }}>
                                                                {tx.token_amount ? formatNumber(parseFloat(tx.token_amount), 0) : "—"}
                                                            </span>
                                                        </div>
                                                        <div style={{ fontSize: "10px", color: "#6666AA" }}>{formatDate(tx.created_at ? Math.floor(new Date(tx.created_at).getTime() / 1000) : null)}</div>
                                                    </div>
                                                </div>
                                            ))}
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
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", fontWeight: 800, color: "#F0F0FF" }}>
                                    🔒 {t("vestingSchedule")}
                                </div>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    background: "rgba(255,216,77,0.08)", border: "1px solid rgba(255,216,77,0.2)",
                                    borderRadius: "8px", padding: "4px 10px",
                                    fontSize: "11px", fontWeight: 700, color: "#FFD84D", letterSpacing: "0.04em",
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
                                                sub: "10% × 10 months",
                                                valColor: "#00E5FF",
                                            },
                                            {
                                                icon: "📅",
                                                date: cliffEnd > 0 && vestEnd > 0 ? `${formatDate(cliffEnd)} — ${formatDate(vestEnd)}` : "Aug 2026 — May 2027",
                                                name: t("step4name"),
                                                val: dailyAlloc !== "—" ? `${dailyAlloc} THK` : "—",
                                                sub: "per month",
                                                valColor: "#6AC645",
                                            },
                                            {
                                                icon: "🎉",
                                                date: vestEnd > 0 ? formatDate(vestEnd) : "May 2027",
                                                name: t("step5name"),
                                                val: totalAlloc !== "—" ? `${totalAlloc} THK` : "—",
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
                                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 700, color: isDone || isActive ? "#F0F0FF" : "#8888AA", lineHeight: 1.2, marginBottom: "8px" }}>{s.name}</div>
                                                    {/* status value */}
                                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 800, color: isDone ? doneGreen : isActive ? activeGreen : s.valColor }}>{s.val}</div>
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
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", fontWeight: 800, color: "#F0F0FF", display: "flex", alignItems: "center", gap: "8px" }}>
                                    📢 {t("announcements")}
                                    {announcements.length > 0 && (
                                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#FF9F1C", color: "#06060F", fontSize: "10px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {announcements.length}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                {(() => {
                                    // Use API data if available, fallback to hardcoded
                                    const items = announcements.length > 0
                                        ? announcements
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
                                                <div style={{ fontSize: "13px", fontWeight: 600, color: "#F0F0FF", lineHeight: 1.4, marginBottom: "3px" }}>{item.title}</div>
                                                <div style={{ fontSize: "12px", color: "#6666AA", lineHeight: 1.5 }}>{item.body}</div>
                                                <div style={{ fontSize: "11px", color: "rgba(102,102,170,0.6)", marginTop: "4px" }}>{item.time_label}</div>
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
                onClose={() => setModal(null)}
            />
        </div>
    );
}

export default PresalePage;
