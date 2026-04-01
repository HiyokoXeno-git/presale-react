import { useCallback, useEffect, useState } from "react";
import { usePageTransition } from "../App";
import MessageModal from "../components/MessageModal";
import { CONFIG } from "../config/config";
import { useLanguage } from "../hooks/useLanguage";
import { SUPPORTED_LANGS } from "../i18n/translations";
import { destroySession, fetchBnbQuote, getUserTransactions, savePurchase, validateSession } from "../services/api";
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
    const [isApproving, setIsApproving] = useState(false);
    const [approveMessage, setApproveMessage] = useState("");
    const [isApproved, setIsApproved] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [buyMessage, setBuyMessage] = useState("");
    const [bnbAmount, setBnbAmount] = useState("");
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

    // ── Data loaders ──────────────────────────────────────────────
    const loadChainData = useCallback(async (walletAddress) => {
        try {
            const [stats, user, vesting] = await Promise.all([
                getPresaleStats(),
                getUserStats(walletAddress),
                getVestingInfo(walletAddress),
            ]);
            setPresaleStats(stats);
            setUserStats(user);
            setVestingInfo(vesting);
        } catch {
            // silently fail — contract may not have all methods
        }
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
                setModal({ type: "success", message: "HDT tokens claimed successfully!", txHash: receipt.transactionHash });
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
            setApproveMessage("");
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
                    setBnbAmount(""); setBnbQuote(null);
                    setModal({ type: "success", message: "Your HDT tokens have been reserved!", txHash: receipt.transactionHash });
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
        } catch (error) {
            setBnbQuote(null); setBnbQuoteMessage(error.message || "Failed to fetch BNB quote.");
        } finally {
            setIsFetchingBnbQuote(false);
        }
    }

    function parseUsdtToRaw(value) {
        if (!value) return "0";
        const [wholePart, decimalPart = ""] = value.split(".");
        const safeWhole = wholePart.replace(/^0+(?=\d)/, "") || "0";
        const safeDecimal = decimalPart.slice(0, 6).padEnd(6, "0");
        return `${safeWhole}${safeDecimal}`;
    }

    function getTokenAmountRawFromUsdtRaw(usdtRaw) {
        const raw = BigInt(usdtRaw);
        return (raw * 66n * 1000000000000n).toString();
    }

    async function handleBuyWithUsdt() {
        if (isBuying) return;
        try {
            setIsBuying(true); setBuyMessage(""); setApproveMessage("");
            const usdtAmountRaw = parseUsdtToRaw(usdtAmount);
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
                setUsdtAmount("");
                setModal({ type: "success", message: "Your HDT tokens have been reserved!", txHash: receipt.transactionHash });
                loadChainData(account);
                loadTxHistory(account);
            } else {
                setModal({ type: "error", message: saveResult?.message || "Purchase succeeded but DB save failed." });
            }
        } catch (error) {
            if (error?.code === 4001) setBuyMessage("Transaction was cancelled.");
            else setBuyMessage(error?.message || "USDT purchase failed.");
        } finally {
            setIsBuying(false);
        }
    }

    async function handleDisconnect() {
        await destroySession();
        await disconnectWalletConnect();
        navigate("/", { state: { fromDashboard: true } });
    }

    async function checkApprovalStatus(walletAddress) {
        try {
            const allowance = await getUsdtAllowance(walletAddress);
            setIsApproved(BigInt(allowance) > 0n);
        } catch { setIsApproved(false); }
    }

    async function handleApproveUsdt() {
        if (isApproving) return;
        try {
            setIsApproving(true); setApproveMessage("");
            const receipt = await approveUsdt(account);
            if (receipt?.status) { setIsApproved(true); setApproveMessage("USDT approval completed successfully."); }
            else setApproveMessage("USDT approval transaction was not successful.");
        } catch (error) {
            if (error?.code === 4001) setApproveMessage("USDT approval was rejected.");
            else setApproveMessage(error?.message || "USDT approval failed.");
        } finally {
            setIsApproving(false);
        }
    }

    function getEstimatedHdt(usdtValue) {
        const num = Number(usdtValue);
        if (!usdtValue || Number.isNaN(num) || num <= 0) return "0";
        return (num * 66).toFixed(6);
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
                await checkApprovalStatus(currentAccount);
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
                    checkApprovalStatus(accounts[0]);
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
                            checkApprovalStatus(acc);
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
        : "TGE + Cliff";

    function getScheduleStep() {
        if (tge === 0) return 0;        // no TGE set yet
        if (now < tge) return 0;        // before TGE
        if (now < cliffEnd) return 1;   // lock period
        if (now < vestEnd) return 2;    // vesting active
        return 3;                       // vesting complete
    }
    const scheduleStep = getScheduleStep();

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
            <div className="space-bg" />
            <div className="nebula" />
            {[{ top: "12%", w: "160px", delay: "0s" }, { top: "28%", w: "120px", delay: "3.5s" }, { top: "55%", w: "90px", delay: "6s" }].map((s, i) => (
                <div key={i} style={{ position: "fixed", top: s.top, left: "-5%", width: s.w, height: "1.5px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)", transform: "rotate(-20deg)", animation: `shoot 8s linear ${s.delay} infinite`, zIndex: -1, opacity: 0 }} />
            ))}

            {/* ── Header ── */}
            <header style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0 48px", height: "70px",
                background: "rgba(6,6,15,0.7)", backdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                {/* Logo — click to go back to landing page */}
                <a onClick={() => navigate("/", { state: { fromDashboard: true } })} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", textDecoration: "none" }}>
                    <img src="/HiyokoLogo.png" alt="HIYOKO" style={{ width: "38px", height: "38px", objectFit: "contain", borderRadius: "8px" }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "22px", color: "#FFD84D", letterSpacing: "0.04em", textShadow: "0 0 20px rgba(255,216,77,0.4)" }}>HIYOKO</span>
                </a>

                {/* Center decorative banner */}
                <img src="/header-banner.png" alt="" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", height: "50px", opacity: 0.18, pointerEvents: "none" }} />

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Language selector */}
                    <div style={{ display: "flex", gap: "4px" }}>
                        {SUPPORTED_LANGS.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => setLang(l.code)}
                                style={{
                                    padding: "5px 10px",
                                    background: lang === l.code ? "rgba(255,216,77,0.15)" : "rgba(20,20,40,0.85)",
                                    border: `1px solid ${lang === l.code ? "rgba(255,216,77,0.5)" : "rgba(255,255,255,0.07)"}`,
                                    borderRadius: "8px", fontSize: "12px", fontWeight: lang === l.code ? 700 : 400,
                                    color: lang === l.code ? "#FFD84D" : "#6666AA",
                                    cursor: "pointer", transition: "all 0.15s",
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >{l.label}</button>
                        ))}
                    </div>

                    {isCorrectNetwork && (
                        <div style={{
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
                    <button onClick={() => navigate("/", { state: { fromDashboard: true } })} style={{
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
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "90px 48px 60px", display: "flex", flexDirection: "column", gap: "22px" }}>

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
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                            {/* Total Allocation */}
                            <div style={{
                                background: "rgba(14,14,28,0.9)", border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "16px", padding: "20px 22px",
                                backdropFilter: "blur(10px)", position: "relative", overflow: "hidden",
                                transition: "all 0.25s",
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, #00E5FF, transparent)", opacity: 0.7 }} />
                                <span style={{ fontSize: "22px", marginBottom: "12px", display: "block" }}>📦</span>
                                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "6px" }}>Total Allocation</div>
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 800, color: "#00E5FF", lineHeight: 1.1 }}>
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
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, #FFD84D, transparent)", opacity: 0.7 }} />
                                <span style={{ fontSize: "22px", marginBottom: "12px", display: "block" }}>📅</span>
                                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "6px" }}>{t("dailyAllocation")}</div>
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 800, color: "#FFD84D", lineHeight: 1.1 }}>
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
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 800, color: "#6AC645", lineHeight: 1.1 }}>
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
                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", fontWeight: 800, color: claimableRaw > 0n ? "#6AC645" : "#6666AA", lineHeight: 1.1 }}>
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
                        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "20px", alignItems: "start" }}>

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
                                            1 USDT <span style={{ fontSize: "13px", color: "#6666AA", fontWeight: 400 }}>= 66 HDT</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "10px", color: "#6666AA", marginBottom: "4px" }}>BSC Testnet</div>
                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, color: "#FF9F1C" }}>🟡 BEP-20</div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                {presaleStats && (
                                    <div style={{ marginBottom: "14px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6666AA", marginBottom: "5px" }}>
                                            <span>Sold: <span style={{ color: "#F0F0FF" }}>{soldDisplay} HDT</span></span>
                                            <span>Cap: <span style={{ color: "#F0F0FF" }}>{capDisplay} HDT</span></span>
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
                                            onClick={() => { setPaymentTab(tab); setBuyMessage(""); setApproveMessage(""); }}
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
                                        {!isApproved ? (
                                            <>
                                                <div style={{ fontSize: "13px", color: "#6666AA", marginBottom: "14px", lineHeight: 1.6 }}>
                                                    {t("firstApprove")}
                                                </div>
                                                <button onClick={handleApproveUsdt} disabled={isApproving} style={btnBuyStyle(!isApproving)}>
                                                    {isApproving ? `⏳ ${t("approving")}` : t("approveUsdt")}
                                                </button>
                                                {approveMessage && (
                                                    <div style={{ marginTop: "10px", fontSize: "13px", color: approveMessage.includes("success") ? "#6AC645" : "#ff6060", textAlign: "center" }}>
                                                        {approveMessage}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {userStats?.usdtBalance !== undefined && (
                                                    <div style={{ fontSize: "11px", color: "#6666AA", marginBottom: "6px", textAlign: "right" }}>
                                                        Balance: <span style={{ color: "#F0F0FF" }}>{formatNumber(formatUnits(userStats.usdtBalance, 6), 2)} USDT</span>
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
                                                        onChange={(e) => setUsdtAmount(normalizeUsdtInput(e.target.value))}
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
                                                <div style={{
                                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                                                    borderRadius: "10px", padding: "9px 14px", marginBottom: "10px",
                                                }}>
                                                    <span style={{ fontSize: "11px", color: "#6666AA" }}>🐣 {t("hykYouReceive")}</span>
                                                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 900, color: "#FFD84D", textShadow: "0 0 10px rgba(255,216,77,0.3)" }}>
                                                        {usdtAmount ? `${getEstimatedHdt(usdtAmount)} HDT` : "— HDT"}
                                                    </span>
                                                </div>
                                                {usdtAmount && !isValidUsdtAmount(usdtAmount) && (
                                                    <div style={{ fontSize: "11px", color: "#FF9F1C", textAlign: "center", marginBottom: "8px" }}>Minimum purchase is 10 USDT</div>
                                                )}
                                                <button onClick={handleBuyWithUsdt} disabled={!isValidUsdtAmount(usdtAmount) || isBuying} style={btnBuyStyle(isValidUsdtAmount(usdtAmount) && !isBuying)}>
                                                    {isBuying ? `⏳ ${t("buying")}` : t("buyNow")}
                                                </button>
                                                {buyMessage && (
                                                    <div style={{ marginTop: "10px", fontSize: "13px", color: "#ff6060", textAlign: "center" }}>{buyMessage}</div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}

                                {/* ── BNB TAB ── */}
                                {paymentTab === "BNB" && (
                                    <>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6666AA", marginBottom: "6px" }}>
                                            <span>{t("amountToSpend")}</span>
                                            <span style={{ color: "rgba(255,255,255,0.7)" }}>Min: ~10 USDT worth</span>
                                        </div>
                                        <div style={{
                                            display: "flex", alignItems: "center",
                                            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "12px", overflow: "hidden", marginBottom: "10px",
                                        }}>
                                            <input
                                                type="text" placeholder="0.00" value={bnbAmount}
                                                onChange={(e) => setBnbAmount(normalizeUsdtInput(e.target.value))}
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
                                            }}>BNB</div>
                                        </div>
                                        {isFetchingBnbQuote && (
                                            <div style={{ fontSize: "12px", color: "#6666AA", textAlign: "center", marginBottom: "10px" }}>⏳ {t("fetchingQuote")}</div>
                                        )}
                                        {bnbQuoteMessage && (
                                            <div style={{ fontSize: "12px", color: "#ff6060", textAlign: "center", marginBottom: "10px" }}>{bnbQuoteMessage}</div>
                                        )}
                                        {bnbQuote && !isFetchingBnbQuote && (
                                            <>
                                                <div style={{
                                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                                                    borderRadius: "10px", padding: "9px 14px", marginBottom: "6px",
                                                }}>
                                                    <span style={{ fontSize: "11px", color: "#6666AA" }}>≈ USDT value</span>
                                                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 700, color: "#F0F0FF" }}>{bnbQuote.usdtAmount} USDT</span>
                                                </div>
                                                <div style={{
                                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                                                    borderRadius: "10px", padding: "9px 14px", marginBottom: "10px",
                                                }}>
                                                    <span style={{ fontSize: "11px", color: "#6666AA" }}>🐣 {t("hykYouReceive")}</span>
                                                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 900, color: "#FFD84D", textShadow: "0 0 10px rgba(255,216,77,0.3)" }}>
                                                        {bnbQuote.tokenAmount} HDT
                                                    </span>
                                                </div>
                                            </>
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
                                                            <span style={{ fontSize: "11px", color: "#6666AA" }}>HDT: </span>
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
                            background: "#0C0C18", border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "22px", padding: "24px",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                        }}>
                            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "18px", fontWeight: 800, color: "#F0F0FF", marginBottom: "20px" }}>
                                {t("vestingSchedule")}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                                {[
                                    { step: 0, label: t("step1name"), desc: t("step1sub"), color: "#FF9F1C", active: presaleActive },
                                    { step: 1, label: t("step2name"), desc: tge > 0 ? formatDate(tge) : "TGE pending", color: "#FFD84D", active: scheduleStep >= 1 },
                                    { step: 2, label: t("step3name"), desc: cliffEnd > 0 ? formatDate(cliffEnd) : `+${cliff > 0 ? Math.floor(cliff / 86400) : "?"} days`, color: "#00E5FF", active: scheduleStep >= 2 },
                                    { step: 3, label: t("step4name"), desc: t("step4sub"), color: "#6AC645", active: scheduleStep >= 2 },
                                    { step: 4, label: t("step5name"), desc: vestEnd > 0 ? formatDate(vestEnd) : "—", color: "#a78bfa", active: scheduleStep >= 3 },
                                ].map((item) => (
                                    <div key={item.step} style={{
                                        background: item.active ? `${item.color}0D` : "rgba(255,255,255,0.02)",
                                        border: `1px solid ${item.active ? `${item.color}40` : "rgba(255,255,255,0.06)"}`,
                                        borderRadius: "14px", padding: "16px",
                                        opacity: item.active ? 1 : 0.5,
                                    }}>
                                        <div style={{
                                            width: "28px", height: "28px", borderRadius: "50%",
                                            background: item.active ? item.color : "rgba(255,255,255,0.08)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "12px", fontWeight: 900, color: item.active ? "#06060F" : "#6666AA",
                                            marginBottom: "10px",
                                        }}>{item.step + 1}</div>
                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 800, color: item.active ? "#F0F0FF" : "#6666AA", marginBottom: "4px" }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#6666AA", lineHeight: 1.5 }}>{item.desc}</div>
                                    </div>
                                ))}
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
                                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#FF9F1C", color: "#06060F", fontSize: "10px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>4</div>
                                </div>
                            </div>
                            <div>
                                {[
                                    { icon: "🚀", iconBg: "rgba(255,159,28,0.12)", title: t("ann1title"), body: t("ann1body"), time: t("ann1time") },
                                    { icon: "🏥", iconBg: "rgba(255,216,77,0.1)", title: t("ann2title"), body: t("ann2body"), time: t("ann2time") },
                                    { icon: "🚗", iconBg: "rgba(0,229,255,0.08)", title: t("ann3title"), body: t("ann3body"), time: t("ann3time") },
                                    { icon: "📅", iconBg: "rgba(106,198,69,0.1)", title: t("ann4title"), body: t("ann4body"), time: t("ann4time") },
                                ].map((item, i) => (
                                    <div key={i} className="a-item" style={{
                                        display: "flex", alignItems: "flex-start", gap: "12px",
                                        padding: "13px 20px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                                        cursor: "pointer",
                                    }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0, marginTop: "2px" }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#F0F0FF", lineHeight: 1.4, marginBottom: "3px" }}>{item.title}</div>
                                            <div style={{ fontSize: "12px", color: "#6666AA", lineHeight: 1.5 }}>{item.body}</div>
                                            <div style={{ fontSize: "11px", color: "rgba(102,102,170,0.6)", marginTop: "4px" }}>{item.time}</div>
                                        </div>
                                    </div>
                                ))}
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
