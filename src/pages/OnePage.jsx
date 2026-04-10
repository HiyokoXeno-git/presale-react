import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePageTransition } from "../App";
import { CONFIG } from "../config/config";
import { useLanguage } from "../hooks/useLanguage";
import { SUPPORTED_LANGS } from "../i18n/translations";
import { createSession, getPresaleStats, getRoadmap, validateSession } from "../services/api";
import { formatUnits } from "../services/format";
import { connectWithWalletConnect, getCurrentAccount, getPresaleStats as getPresaleStatsChain, switchNetwork } from "../services/web3";

// ── Donut chart data ──────────────────────────────────────
const DONUT_SEGMENTS = [
  { pct: 0.10, color: "#00E5FF", label: "Ecosystem", amount: "100,000,000" },
  { pct: 0.05, color: "#FF9F1C", label: "Game to Earn (CheePoint)", amount: "50,000,000" },
  { pct: 0.10, color: "#8888CC", label: "Team", amount: "100,000,000" },
  { pct: 0.10, color: "#44AAFF", label: "Marketing / KOL / Listing", amount: "100,000,000" },
  { pct: 0.10, color: "#FF6688", label: "Foundation / Reserve", amount: "100,000,000" },
  { pct: 0.35, color: "#FFD84D", label: "Market Make", amount: "350,000,000" },
  { pct: 0.10, color: "#AA55FF", label: "Investors", amount: "100,000,000" },
  { pct: 0.10, color: "#FF6B35", label: "Presale", amount: "~100,000,000" },
];
const C = 2 * Math.PI * 88; // ≈ 552.92


function DonutChart() {
  let offset = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
      <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: "420px", overflow: "visible" }}>
        <defs>
          <linearGradient id="presaleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9F1C" />
            <stop offset="100%" stopColor="#FFD84D" />
          </linearGradient>
          <filter id="presaleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle cx="160" cy="160" r="88" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="32" />

        {/* Segments */}
        {DONUT_SEGMENTS.map((seg, i) => {
          const da = seg.pct * C;
          const curOffset = offset;
          offset += da;
          return (
            <circle key={i} cx="160" cy="160" r="88" fill="none"
              stroke={i === 7 ? "url(#presaleGrad)" : seg.color}
              strokeWidth={i === 7 ? 34 : 32}
              strokeDasharray={`${da} ${C}`}
              strokeDashoffset={-curOffset}
              transform="rotate(-90 160 160)"
              filter={i === 7 ? "url(#presaleGlow)" : undefined}
            />
          );
        })}

        {/* ── SVG Labels with leader lines (matching HTML reference) ── */}
        {/* Ecosystem – cyan, top-right */}
        <line x1="192.1" y1="61.1" x2="198.9" y2="40.2" stroke="#00E5FF" strokeWidth="1.2" opacity="0.7" />
        <line x1="198.9" y1="40.2" x2="220.9" y2="40.2" stroke="#00E5FF" strokeWidth="1.2" opacity="0.7" />
        <text x="224.9" y="37.2" fontFamily="Outfit,sans-serif" fontSize="12" fontWeight="700" fill="#00E5FF" textAnchor="start">Ecosystem</text>
        <text x="224.9" y="49.2" fontFamily="DM Sans,sans-serif" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="start">10%</text>

        {/* Game to Earn – orange, right */}
        <line x1="233.5" y1="86.5" x2="249.1" y2="70.9" stroke="#FF9F1C" strokeWidth="1.2" opacity="0.7" />
        <line x1="249.1" y1="70.9" x2="271.1" y2="70.9" stroke="#FF9F1C" strokeWidth="1.2" opacity="0.7" />
        <text x="275.1" y="67.9" fontFamily="Outfit,sans-serif" fontSize="12" fontWeight="700" fill="#FF9F1C" textAnchor="start">Game to Earn</text>
        <text x="275.1" y="79.9" fontFamily="DM Sans,sans-serif" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="start">5%</text>

        {/* Team – lavender, right-middle */}
        <line x1="258.9" y1="127.9" x2="279.8" y2="121.1" stroke="#8888CC" strokeWidth="1.2" opacity="0.7" />
        <line x1="279.8" y1="121.1" x2="301.8" y2="121.1" stroke="#8888CC" strokeWidth="1.2" opacity="0.7" />
        <text x="305.8" y="118.1" fontFamily="Outfit,sans-serif" fontSize="12" fontWeight="700" fill="#8888CC" textAnchor="start">Team</text>
        <text x="305.8" y="130.1" fontFamily="DM Sans,sans-serif" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="start">10%</text>

        {/* Marketing – blue, right-lower */}
        <line x1="258.9" y1="192.1" x2="279.8" y2="198.9" stroke="#44AAFF" strokeWidth="1.2" opacity="0.7" />
        <line x1="279.8" y1="198.9" x2="301.8" y2="198.9" stroke="#44AAFF" strokeWidth="1.2" opacity="0.7" />
        <text x="305.8" y="195.9" fontFamily="Outfit,sans-serif" fontSize="12" fontWeight="700" fill="#44AAFF" textAnchor="start">Marketing</text>
        <text x="305.8" y="207.9" fontFamily="DM Sans,sans-serif" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="start">10%</text>

        {/* Foundation – pink, bottom-right */}
        <line x1="221.1" y1="244.1" x2="234.1" y2="261.9" stroke="#FF6688" strokeWidth="1.2" opacity="0.7" />
        <line x1="234.1" y1="261.9" x2="256.1" y2="261.9" stroke="#FF6688" strokeWidth="1.2" opacity="0.7" />
        <text x="260.1" y="258.9" fontFamily="Outfit,sans-serif" fontSize="12" fontWeight="700" fill="#FF6688" textAnchor="start">Foundation</text>
        <text x="260.1" y="270.9" fontFamily="DM Sans,sans-serif" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="start">10%</text>

        {/* Market Make – yellow, left-bottom */}
        <line x1="86.5" y1="233.5" x2="70.9" y2="249.1" stroke="#FFD84D" strokeWidth="1.2" opacity="0.7" />
        <line x1="70.9" y1="249.1" x2="48.9" y2="249.1" stroke="#FFD84D" strokeWidth="1.2" opacity="0.7" />
        <text x="44.9" y="246.1" fontFamily="Outfit,sans-serif" fontSize="12" fontWeight="700" fill="#FFD84D" textAnchor="end">Market Make</text>
        <text x="44.9" y="258.1" fontFamily="DM Sans,sans-serif" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="end">35%</text>

        {/* Investors – violet, left */}
        <line x1="75.9" y1="98.9" x2="58.1" y2="85.9" stroke="#AA55FF" strokeWidth="1.2" opacity="0.7" />
        <line x1="58.1" y1="85.9" x2="36.1" y2="85.9" stroke="#AA55FF" strokeWidth="1.2" opacity="0.7" />
        <text x="32.1" y="82.9" fontFamily="Outfit,sans-serif" fontSize="12" fontWeight="700" fill="#AA55FF" textAnchor="end">Investors</text>
        <text x="32.1" y="94.9" fontFamily="DM Sans,sans-serif" fontSize="10" fill="rgba(255,255,255,0.5)" textAnchor="end">10%</text>

        {/* Presale – gradient yellow, top-left */}
        <line x1="127.9" y1="61.1" x2="121.1" y2="40.2" stroke="#FFD84D" strokeWidth="1.5" opacity="0.9" />
        <line x1="121.1" y1="40.2" x2="99.1" y2="40.2" stroke="#FFD84D" strokeWidth="1.5" opacity="0.9" />
        <text x="95.1" y="35.2" fontFamily="Outfit,sans-serif" fontSize="13" fontWeight="700" fill="#FFD84D" textAnchor="end">🔥 Presale</text>
        <text x="95.1" y="49.2" fontFamily="DM Sans,sans-serif" fontSize="10" fill="rgba(255,216,77,0.8)" textAnchor="end">10%</text>

        {/* Center text */}
        <text x="160" y="152" fontFamily="Outfit,sans-serif" fontSize="30" fontWeight="900" fill="#FFD84D" textAnchor="middle">1B</text>
        <text x="160" y="170" fontFamily="DM Sans,sans-serif" fontSize="11" fill="rgba(160,160,220,0.7)" textAnchor="middle">Total THK</text>
      </svg>
    </div>
  );
}


function OnePage() {
  const { exiting, transitionTo } = usePageTransition();
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const FAQ_ITEMS = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
    { q: t("faq5q"), a: t("faq5a") },
    { q: t("faq6q"), a: t("faq6a") },
    { q: t("faq7q"), a: t("faq7a") },
    { q: t("faq8q"), a: t("faq8a") },
    { q: t("faq9q"), a: t("faq9a") },
    { q: t("faq10q"), a: t("faq10a") },
    { q: t("faq11q"), a: t("faq11a") },
    { q: t("faq12q"), a: t("faq12a") },
    { q: t("faq13q"), a: t("faq13a") },
    { q: t("faq14q"), a: t("faq14a") },
    { q: t("faq15q"), a: t("faq15a") },
    { q: t("faq16q"), a: t("faq16a") },
    { q: t("faq17q"), a: t("faq17a") },
    { q: t("faq18q"), a: t("faq18a") },
    { q: t("faq19q"), a: t("faq19a") },
    { q: t("faq20q"), a: t("faq20a") },
    { q: t("faq21q"), a: t("faq21a") },
    { q: t("faq22q"), a: t("faq22a") },
    { q: t("faq23q"), a: t("faq23a") },
    { q: t("faq24q"), a: t("faq24a") },
    { q: t("faq25q"), a: t("faq25a") },
    { q: t("faq26q"), a: t("faq26a") },
  ];

  const [roadmap, setRoadmap] = useState([]);
  const [roadmapLoading, setRoadmapLoading] = useState(true);

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langSwitcherRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [countdown, setCountdown] = useState({ d: "--", h: "--", m: "--", s: "--" });
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(null);
  const PRESALE_GOAL = 1500000;
  const [presaleStats, setPresaleStats] = useState(null);
  const presaleRaised = presaleStats?.totalUsdt ?? 0;
  const presaleProgress = Math.min((presaleRaised / PRESALE_GOAL) * 100, 100);
  const presalePurchases = presaleStats?.totalPurchases ?? 0;

  const [chainStats, setChainStats] = useState(null);
  const soldDisplay = chainStats?.totalSold ? parseFloat(formatUnits(BigInt(chainStats.totalSold), 18)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "--";
  const capDisplay = chainStats?.saleCap ? parseFloat(formatUnits(BigInt(chainStats.saleCap), 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "--";
  const remainingDisplay = chainStats?.remainingForSale ? parseFloat(formatUnits(BigInt(chainStats.remainingForSale), 18)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "--";

  useEffect(() => {
    getPresaleStats().then((data) => { if (data) setPresaleStats(data); }).catch(() => { });
    getPresaleStatsChain().then((data) => { if (data) setChainStats(data); }).catch(() => { });
  }, []);

  // fetch roadmap from backend whenever language changes
  useEffect(() => {
    setRoadmapLoading(true);
    getRoadmap(lang).then(data => {
      setRoadmap(data);
      setRoadmapLoading(false);
    }).catch(() => setRoadmapLoading(false));
  }, [lang]);

  // Check if wallet is connected AND server session is still valid (< 24 h)
  useEffect(() => {
    async function checkSession() {
      const valid = await validateSession();
      if (!valid) return;
      const acc = await getCurrentAccount().catch(() => null);
      if (acc) setWalletConnected(true);
    }
    checkSession();
  }, [location.state]);

  // countdown timer — uses endDate from API stats if available, falls back to CONFIG
  useEffect(() => {
    const endDateStr = presaleStats?.endDate || CONFIG.presaleEndDate;
    const target = new Date(endDateStr).getTime();
    if (isNaN(target)) return;
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) { setCountdown({ d: "0", h: "0", m: "0", s: "0" }); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown({ d: String(d).padStart(2, "0"), h: String(h).padStart(2, "0"), m: String(m).padStart(2, "0"), s: String(s).padStart(2, "0") });
    }
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [presaleStats?.endDate]);

  // close lang dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (langSwitcherRef.current && !langSwitcherRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // animate progress bar
  const [progWidth, setProgWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgWidth(presaleProgress), 400);
    return () => clearTimeout(t);
  }, [presaleProgress]);

  async function handleConnectWC() {
    if (isConnecting) return;
    try {
      setIsConnecting(true);
      setConnectError("");
      await connectWithWalletConnect();
      // Auto-switch to BSC Testnet — silently ignore if wallet rejects (PresalePage will prompt)
      try { await switchNetwork(); } catch { /* handled in PresalePage */ }
      const acc = await getCurrentAccount();
      await createSession(acc);
      transitionTo("/presale");
    } catch (err) {
      if (err?.code === -32002) setConnectError("Pending request in MetaMask. Please check the extension.");
      else if (err?.code === 4001 || err?.message?.includes("User rejected")) setConnectError("Connection rejected.");
      else setConnectError(err?.message || "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function copyAddr(addr, idx) {
    navigator.clipboard.writeText(addr).then(() => {
      setCopiedAddr(idx);
      setTimeout(() => setCopiedAddr(null), 1500);
    });
  }

  const ALLOC_ADDRESSES = [
    "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    "0x3c4d5e6f7890abcdef1234567890abcdef123456",
    "0x4d5e6f7890abcdef1234567890abcdef12345678",
    "0x5e6f7890abcdef1234567890abcdef1234567890",
    "0x6f7890abcdef1234567890abcdef123456789012",
    "0x7890abcdef1234567890abcdef12345678901234",
    "0x890abcdef1234567890abcdef123456789012345",
    "0x90abcdef1234567890abcdef1234567890123456",
  ];


  const WC_SVG = <svg width="13" height="13" viewBox="0 0 300 185" fill="currentColor"><path d="M61.4 36.3C104.8-5.4 175.2-5.4 218.6 36.3l7.1 6.9c2.1 2 2.1 5.2 0 7.2l-24.3 23.7c-1 1-2.7 1-3.7 0l-9.8-9.5c-30.5-29.7-80-29.7-110.4 0l-10.5 10.2c-1 1-2.7 1-3.7 0L39.1 51.1c-2.1-2-2.1-5.2 0-7.2l22.3-7.6zm185.3 34.5 21.6 21.1c2.1 2 2.1 5.2 0 7.2L165.4 199.6c-2.1 2-5.4 2-7.4 0l-72.1-70.3c-.5-.5-1.3-.5-1.8 0l-72.1 70.3c-2.1 2-5.4 2-7.4 0L1.7 99.1c-2.1-2-2.1-5.2 0-7.2l21.6-21.1c2.1-2 5.4-2 7.4 0l72.1 70.3c.5.5 1.3.5 1.8 0l72.1-70.3c2.1-2 5.4-2 7.4 0l72.1 70.3c.5.5 1.3.5 1.8 0l72.1-70.3c2-2 5.4-2 7.4 0z" /></svg>;

  const SS_BASE = { position: "fixed", height: "1.5px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)", transform: "rotate(-20deg)", animation: "shoot 8s linear infinite", zIndex: -1, opacity: 0 };

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }} className={exiting ? "page-exit" : ""}>
      <div className="space-bg" />
      <div className="nebula" />
      <div style={{ ...SS_BASE, top: "12%", left: "-5%", width: "160px" }} />
      <div style={{ ...SS_BASE, top: "28%", left: "-5%", width: "120px", animationDelay: "3.5s" }} />
      <div style={{ ...SS_BASE, top: "55%", left: "-5%", width: "90px", animationDelay: "6s" }} />

      {/* ── HEADER ── */}
      <header>
        <a className="logo" href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <img className="logo-img" src="/HiyokoLogo.png" alt="HIYOKO" />
          <img className="logo-name-img" src="/HiyokoName.png" alt="HIYOKO" />
        </a>
        <img className="header-banner" src="/header-banner.png" alt="" />

        {/* Desktop nav */}
        <nav>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("tokenomics"); }}>{t("navTokenomics")}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("roadmap"); }}>{t("navRoadmap")}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }}>{t("navFaq")}</a>
          <a className="tg-link" href="https://t.me/hiyoko_Official" target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.607c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.796l-2.95-.924c-.64-.203-.653-.64.136-.948l11.527-4.446c.537-.194 1.006.13.37.77z" /></svg>
            {t("navCommunity")}
          </a>
        </nav>

        {/* Language dropdown — all screen sizes */}
        <div ref={langSwitcherRef} className="onepage-lang-wrap" style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setLangDropdownOpen((v) => !v)}
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

        {/* Desktop: wallet button */}
        <div className="header-wallet-desktop">
          {walletConnected ? (
            <button onClick={() => transitionTo("/presale")} style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "11px 24px",
              background: "linear-gradient(135deg, #FFD84D, #FF9F1C)",
              color: "#06060F", border: "none", borderRadius: "100px",
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "15px",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 0 20px rgba(255,216,77,0.35)",
            }}>
              🐣 Go to Dashboard
            </button>
          ) : (
            <button onClick={handleConnectWC} disabled={isConnecting} style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "11px 24px",
              background: "rgba(255,216,77,0.12)", border: "1px solid rgba(255,216,77,0.45)",
              color: "#FFD84D", borderRadius: "100px", fontFamily: "'Outfit', sans-serif",
              fontWeight: 700, fontSize: "15px", cursor: isConnecting ? "not-allowed" : "pointer",
              opacity: isConnecting ? 0.7 : 1, transition: "all 0.2s",
              boxShadow: "0 0 16px rgba(255,216,77,0.12)",
            }}>
              {WC_SVG} {isConnecting ? t("connectingBtn") : t("connectWalletBtn")}
            </button>
          )}
        </div>

        {/* Mobile/tablet: hamburger */}
        <button
          className={`hamburger${mobileMenuOpen ? " open" : ""}`}
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div className="mobile-menu open">
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("tokenomics"); setMobileMenuOpen(false); }}>{t("navTokenomics")}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("roadmap"); setMobileMenuOpen(false); }}>{t("navRoadmap")}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("faq"); setMobileMenuOpen(false); }}>{t("navFaq")}</a>
          <a className="tg-link" href="https://t.me/hiyoko_Official" target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.607c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.796l-2.95-.924c-.64-.203-.653-.64.136-.948l11.527-4.446c.537-.194 1.006.13.37.77z" /></svg>
            {t("navCommunity")}
          </a>
          <div className="mobile-lang-section">
            <div className="mobile-lang-label">Language</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {SUPPORTED_LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setMobileMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "9px 12px", width: "100%",
                    background: lang === l.code ? "rgba(255,216,77,0.1)" : "transparent",
                    border: lang === l.code ? "1px solid rgba(255,216,77,0.3)" : "1px solid transparent",
                    borderRadius: "8px", cursor: "pointer", textAlign: "left",
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
          </div>
          <div className="mobile-bottom">
            {walletConnected ? (
              <button onClick={() => { transitionTo("/presale"); setMobileMenuOpen(false); }} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "13px 24px", width: "100%",
                background: "linear-gradient(135deg, #FFD84D, #FF9F1C)",
                color: "#06060F", border: "none", borderRadius: "100px",
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "15px", cursor: "pointer",
              }}>
                🐣 Go to Dashboard
              </button>
            ) : (
              <button onClick={() => { handleConnectWC(); setMobileMenuOpen(false); }} disabled={isConnecting} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "13px 24px", width: "100%",
                background: "rgba(255,216,77,0.12)", border: "1px solid rgba(255,216,77,0.45)",
                color: "#FFD84D", borderRadius: "100px",
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "15px",
                cursor: isConnecting ? "not-allowed" : "pointer", opacity: isConnecting ? 0.7 : 1,
              }}>
                {WC_SVG} {isConnecting ? t("connectingBtn") : t("connectWalletBtn")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-left">
          <div className="live-badge">
            <span className="live-dot" />
            {t("heroBadge")}
          </div>
          <h1>
            Play More. Live Better.<br />
            <span className="y">Earn </span>
            <span className="c">THK.</span>
          </h1>
          <p className="hero-sub">{t("heroSubtitle")}</p>

          <div className="price-card">
            <div className="price-label">{t("heroPresalePrice")}</div>
            <div className="price-main">
              <span className="price-num">$0.015</span>
              <span className="price-unit">USDT / THK</span>
            </div>
            <div className="prog-labels">
              <span>{t("heroRaised")}: <b>THK {presaleRaised.toLocaleString()}</b></span>
              <span>{t("heroGoal")}: THK 1,500,000 &nbsp;<strong style={{ color: "#00E5FF" }}>{presaleProgress.toFixed(1)}%</strong></span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill" style={{ width: `${progWidth}%` }} />
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
              {[
                { label: "Total Sold", value: `${soldDisplay} THK`, color: "#FFD84D" },
                { label: "Hard Cap", value: `${capDisplay} THK`, color: "#00E5FF" },
                { label: "Remaining", value: `${remainingDisplay} THK`, color: "#AA55FF" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  flex: 1, minWidth: "100px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6666AA", marginBottom: "5px", fontWeight: 600 }}>{label}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 700, color }}>{value}</div>
                </div>
              ))}
            </div>
            <div className="countdown">
              {[["d", t("heroCountDays")], ["h", t("heroCountHours")], ["m", t("heroCountMins")], ["s", t("heroCountSecs")]].map(([k, lbl]) => (
                <div key={k} className="cnt-box">
                  <div className="cnt-num">{countdown[k]}</div>
                  <div className="cnt-label">{lbl}</div>
                </div>
              ))}
            </div>
            <div className="cta-area">
              <div className="btn-row">
                <div className="btn-flow wc hero-wc" onClick={handleConnectWC} style={{ opacity: isConnecting ? 0.7 : 1, cursor: isConnecting ? "not-allowed" : "pointer" }}>
                  <span className="btn-flow-buy">{isConnecting ? t("connectingBtn") : t("heroBuyNow")}</span>
                  <span className="btn-flow-arrow">→</span>
                  <span className="btn-flow-wallet">{WC_SVG} WalletConnect</span>
                </div>
                <a className="btn-how" href="#" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }}>{t("heroHowToBuy")}</a>
              </div>
            </div>
            {connectError && <div style={{ marginTop: "10px", fontSize: "12px", color: "#ff6060", textAlign: "center" }}>{connectError}</div>}
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-glow" />
          <div className="hero-glow-inner" />
          <img className="hero-chick" src="/HiyokoHero.png" alt="HIYOKO" onError={(e) => { e.target.src = "/HiyokoHero.png"; }} />
          <div className="stats-row">
            {[["54M+", "Global Users"], [presalePurchases.toLocaleString(), "Pre-orders"], ["1B", "Total Supply"]].map(([num, lbl]) => (
              <div key={lbl} className="stat-box">
                <div className="stat-num">{num}</div>
                <div className="stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="features">
          {[
            { cls: "o", icon: "🎮", title: t("feat1title"), desc: t("feat1desc") },
            { cls: "c", icon: "👁️", title: t("feat2title"), desc: t("feat2desc") },
            { cls: "y", icon: "💎", title: t("feat3title"), desc: t("feat3desc") },
          ].map((f) => (
            <div key={f.cls} className={`feat-card ${f.cls}`}>
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HAPPY CHICK ── */}
      <div className="vitalis-section">
        <div className="vitalis-card" style={{ borderColor: "rgba(255,159,28,0.2)", boxShadow: "0 0 60px rgba(255,159,28,0.06)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 20% 50%, rgba(255,159,28,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div className="vitalis-text">
            <span className="vitalis-tag" style={{ color: "#FF9F1C" }}>{t("happyChickTag")}</span>
            <div className="vitalis-title">{t("happyChickTitle")}</div>
            <p className="vitalis-desc">{t("happyChickDesc")}</p>
            <div className="vitalis-badge" style={{ borderColor: "rgba(255,159,28,0.3)", background: "rgba(255,159,28,0.08)", color: "#FF9F1C" }}>{t("happyChickBadge")}</div>
          </div>
          <img className="vitalis-img" src="/HiyokoHero.png" alt="Happy Chick" onError={(e) => { e.target.style.display = "none"; }} />
        </div>
      </div>

      {/* ── VITALIS ── */}
      <div className="vitalis-section">
        <div className="vitalis-card">
          <div className="vitalis-text">
            <span className="vitalis-tag">{t("vitalisTag")}</span>
            <div className="vitalis-title">{t("vitalisTitle")}</div>
            <p className="vitalis-desc">{t("vitalisDesc")}</p>
            <div className="vitalis-badge">{t("vitalisBadge")}</div>
          </div>
          <img className="vitalis-img" src="/download.png" alt="Vitalis" onError={(e) => { e.target.style.display = "none"; }} />
        </div>
      </div>

      {/* ── CHEEPOINT ── */}
      <div className="vitalis-section">
        <div className="vitalis-card" style={{ borderColor: "rgba(255,216,77,0.2)", boxShadow: "0 0 60px rgba(255,216,77,0.06)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 80% 50%, rgba(255,216,77,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div className="vitalis-text">
            <span className="vitalis-tag" style={{ color: "#FFD84D" }}>{t("cheepointTag")}</span>
            <div className="vitalis-title">{t("cheepointTitle")}</div>
            <p className="vitalis-desc">{t("cheepointDesc")}</p>
            <div className="vitalis-badge" style={{ borderColor: "rgba(255,216,77,0.3)", background: "rgba(255,216,77,0.08)", color: "#FFD84D" }}>{t("cheepointBadge")}</div>
          </div>
          <img className="vitalis-img" src="/CheePoint.png" alt="CheePoint" onError={(e) => { e.target.style.display = "none"; }} />
        </div>
      </div>

      {/* ── TOKENOMICS ── */}
      <div id="tokenomics" className="section">
        <div className="sec-tag">{t("tokenDistribution")}</div>
        <div className="sec-title">{t("tokenomicsTitle")}</div>
        <div className="tknm-grid">
          <DonutChart />
          <div className="alloc-list">
            {DONUT_SEGMENTS.map((seg, i) => (
              <div key={i} className="alloc-item">
                <div className="alloc-top">
                  <div className="alloc-dot" style={{ background: seg.color }} />
                  <span className="alloc-name">{seg.label}</span>
                  <span className="alloc-amount" style={{ color: seg.color }}>{seg.amount}</span>
                </div>
                {i < ALLOC_ADDRESSES.length && (
                  <div className="alloc-addr">
                    <span>{ALLOC_ADDRESSES[i]}</span>
                    <button className="copy-btn" onClick={() => copyAddr(ALLOC_ADDRESSES[i], i)}>
                      {copiedAddr === i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROADMAP ── */}
      <div id="roadmap" className="section">
        <div className="sec-tag">{t("projectTimeline")}</div>
        <div className="sec-title">{t("roadmapTitle")}</div>
        <div className="rm-grid">
          {roadmapLoading ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", padding: "32px 0" }}>Loading roadmap...</div>
          ) : roadmap.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", padding: "32px 0" }}>No roadmap data.</div>
          ) : roadmap.map((ph) => (
            <div key={ph.phase_number} className={`rm-card${ph.is_active ? " now" : ""}`}>
              <div className="rm-dot" />
              <div className="rm-phase">{ph.period}</div>
              <div className="rm-title">{ph.title}</div>
              <ul className="rm-list">
                {ph.items.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
              {ph.is_active && (
                <div style={{
                  marginTop: "10px", display: "inline-block",
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
                  background: "linear-gradient(90deg,#FF9F1C,#FFD84D)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>▶ NOW</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div id="faq" className="section">
        <div className="sec-tag">{t("questionsLabel")}</div>
        <div className="sec-title">{t("faqTitle")}</div>
        <div className="faq-wrap">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                {item.q}
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="section" style={{ textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(255,159,28,0.1), rgba(0,229,255,0.08))", border: "1px solid rgba(255,216,77,0.2)", borderRadius: "28px", padding: "64px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,216,77,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ fontSize: "52px", marginBottom: "18px" }}>🐣</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "14px" }}>
            Join the <span style={{ color: "#FFD84D" }}>HIYOKO</span> Ecosystem <span style={{ color: "#00E5FF" }}>Early.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(240,240,255,0.7)", maxWidth: "520px", margin: "0 auto 36px", lineHeight: 1.75 }}>{t("ctaSubtitle")}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            <div className="btn-flow hero-wc" onClick={handleConnectWC} style={{ maxWidth: "420px", opacity: isConnecting ? 0.7 : 1, cursor: isConnecting ? "not-allowed" : "pointer" }}>
              <span className="btn-flow-buy" style={{ padding: "15px 22px", fontSize: "15px" }}>{isConnecting ? t("connectingBtn") : t("heroBuyNow")}</span>
              <span className="btn-flow-arrow" style={{ padding: "15px 12px", fontSize: "18px" }}>→</span>
              <span className="btn-flow-wallet" style={{ padding: "13px 24px", fontSize: "15px", display: "flex", alignItems: "center", gap: "7px" }}>{WC_SVG} WalletConnect</span>
            </div>
          </div>
          <p style={{ marginTop: "20px", fontSize: "12px", color: "rgba(240,240,255,0.45)" }}>{t("ctaDisclaimer")}</p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="foot-logo">HIYOKO</div>
        <div className="foot-links">
          <a href="https://hiyokotoken.com" target="_blank" rel="noreferrer">Website</a>
          <a href="https://x.com/HiyokoGlobal" target="_blank" rel="noreferrer">X (Twitter)</a>
          <a href="https://t.me/hiyoko_Official" target="_blank" rel="noreferrer">Telegram</a>
          <a href="https://www.instagram.com/hiyokop2e/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@hiyokoglobal" target="_blank" rel="noreferrer">YouTube</a>
          <a href="https://hiyokotoken.com/wp/EN_HIYOKO_Whitepaper.pdf" target="_blank" rel="noreferrer">Whitepaper</a>
        </div>
        <p className="foot-disc">{t("footerDisclaimer")}<br />{t("footerRights")}</p>
      </footer>
    </div>
  );
}

export default OnePage;
