import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { SUPPORTED_LANGS } from "../i18n/translations";
import { connectWallet, connectWithWalletConnect, getCurrentAccount, switchNetwork } from "../services/web3";

// ── Donut chart data ──────────────────────────────────────
const DONUT_SEGMENTS = [
  { pct: 0.22, color: "#00E5FF", label: "Ecosystem", amount: "100,000,000" },
  { pct: 0.11, color: "#FF9F1C", label: "Game to Earn", amount: "50,000,000" },
  { pct: 0.22, color: "#8888CC", label: "Team", amount: "100,000,000" },
  { pct: 0.22, color: "#44AAFF", label: "Marketing", amount: "100,000,000" },
  { pct: 0.22, color: "#FF6688", label: "Foundation", amount: "100,000,000" },
  { pct: 0.01, color: "#FFD84D", label: "Presale", amount: "~50,000,000" },
];
const C = 2 * Math.PI * 88; // ≈ 552.92


function DonutChart() {
  let offset = 0;
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 220 220" style={{ width: "100%", maxWidth: "280px" }}>
        <circle cx="110" cy="110" r="88" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="32" />
        {DONUT_SEGMENTS.map((seg, i) => {
          const da = seg.pct * C;
          const curOffset = offset;
          offset += da;
          return (
            <circle key={i}
              cx="110" cy="110" r="88"
              fill="none"
              stroke={seg.color}
              strokeWidth="32"
              strokeDasharray={`${da} ${C}`}
              strokeDashoffset={-curOffset}
              transform="rotate(-90 110 110)"
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", textAlign: "center", pointerEvents: "none" }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "26px", fontWeight: 900, color: "#FFD84D" }}>1B</div>
        <div style={{ fontSize: "11px", color: "#6666AA" }}>HYK Total</div>
      </div>
    </div>
  );
}


function OnePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const FAQ_ITEMS = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
  ];

  const ROADMAP = [
    { phase: t("rm1phase"), title: t("rm1title"), now: true, items: [t("rm1item1"), t("rm1item2"), t("rm1item3")] },
    { phase: t("rm2phase"), title: t("rm2title"), now: false, items: [t("rm2item1"), t("rm2item2"), t("rm2item3"), t("rm2item4")] },
    { phase: t("rm3phase"), title: t("rm3title"), now: false, items: [t("rm3item1"), t("rm3item2"), t("rm3item3")] },
    { phase: t("rm4phase"), title: t("rm4title"), now: false, items: [t("rm4item1"), t("rm4item2"), t("rm4item3")] },
  ];

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [countdown, setCountdown] = useState({ d: "--", h: "--", m: "--", s: "--" });
  const [openFaq, setOpenFaq] = useState(0);
  const [copiedAddr, setCopiedAddr] = useState(null);
  const [presaleProgress] = useState(28); // 28% sold

  // Auto-redirect to dashboard if wallet already connected,
  // but skip if user explicitly navigated back from the dashboard.
  useEffect(() => {
    if (location.state?.fromDashboard) return;
    getCurrentAccount().then((acc) => {
      if (acc) navigate("/presale");
    }).catch(() => { });
  }, [navigate, location.state]);

  // countdown timer
  useEffect(() => {
    const target = new Date("2026-08-01T00:00:00Z").getTime();
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
  }, []);

  // animate progress bar
  const [progWidth, setProgWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgWidth(presaleProgress), 400);
    return () => clearTimeout(t);
  }, [presaleProgress]);

  async function handleConnect() {
    if (isConnecting) return;
    try {
      setIsConnecting(true);
      setConnectError("");
      await connectWallet();
      navigate("/presale");
    } catch (err) {
      if (err?.code === -32002) setConnectError("Pending request in MetaMask. Please check.");
      else if (err?.code === 4001) setConnectError("Connection rejected.");
      else setConnectError(err?.message || "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleConnectWC() {
    if (isConnecting) return;
    try {
      setIsConnecting(true);
      setConnectError("");
      await connectWithWalletConnect();
      // Auto-switch to BSC Testnet — silently ignore if wallet rejects (PresalePage will prompt)
      try { await switchNetwork(); } catch { /* handled in PresalePage */ }
      navigate("/presale");
    } catch (err) {
      if (err?.code === 4001 || err?.message?.includes("User rejected")) setConnectError("Connection rejected.");
      else setConnectError(err?.message || "WalletConnect failed.");
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
  ];


  const WC_SVG = <svg width="13" height="13" viewBox="0 0 300 185" fill="currentColor"><path d="M61.4 36.3C104.8-5.4 175.2-5.4 218.6 36.3l7.1 6.9c2.1 2 2.1 5.2 0 7.2l-24.3 23.7c-1 1-2.7 1-3.7 0l-9.8-9.5c-30.5-29.7-80-29.7-110.4 0l-10.5 10.2c-1 1-2.7 1-3.7 0L39.1 51.1c-2.1-2-2.1-5.2 0-7.2l22.3-7.6zm185.3 34.5 21.6 21.1c2.1 2 2.1 5.2 0 7.2L165.4 199.6c-2.1 2-5.4 2-7.4 0l-72.1-70.3c-.5-.5-1.3-.5-1.8 0l-72.1 70.3c-2.1 2-5.4 2-7.4 0L1.7 99.1c-2.1-2-2.1-5.2 0-7.2l21.6-21.1c2.1-2 5.4-2 7.4 0l72.1 70.3c.5.5 1.3.5 1.8 0l72.1-70.3c2.1-2 5.4-2 7.4 0l72.1 70.3c.5.5 1.3.5 1.8 0l72.1-70.3c2-2 5.4-2 7.4 0z" /></svg>;

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <div className="space-bg" />
      <div className="nebula" />
      <div className="shooting-star" />
      <div className="shooting-star" style={{ top: "28%", animationDelay: "3.5s", width: "120px" }} />
      <div className="shooting-star" style={{ top: "55%", animationDelay: "6s", width: "90px" }} />

      {/* ── HEADER ── */}
      <header>
        <a className="logo" href="#">
          <img className="logo-img" src="/HiyokoLogo.png" alt="HIYOKO" />
          <span className="logo-text">HIYOKO</span>
        </a>
        <img className="header-banner" src="/header-banner.png" alt="" />
        <nav>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("tokenomics"); }}>{t("navTokenomics")}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("roadmap"); }}>{t("navRoadmap")}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }}>{t("navFaq")}</a>
          <a className="tg-link" href="https://t.me/hiyoko_Official" target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.607c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.796l-2.95-.924c-.64-.203-.653-.64.136-.948l11.527-4.446c.537-.194 1.006.13.37.77z" /></svg>
            {t("navCommunity")}
          </a>
        </nav>
        <div style={{ display: "flex", gap: "4px" }}>
          {SUPPORTED_LANGS.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)} style={{
              padding: "5px 10px", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer",
              background: lang === l.code ? "rgba(255,216,77,0.2)" : "transparent",
              color: lang === l.code ? "#FFD84D" : "rgba(240,240,255,0.45)",
              outline: lang === l.code ? "1px solid rgba(255,216,77,0.4)" : "none",
              transition: "all 0.15s",
            }}>{l.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleConnect} disabled={isConnecting} className="connect-btn" style={{ opacity: isConnecting ? 0.7 : 1, cursor: isConnecting ? "not-allowed" : "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" /><circle cx="17" cy="14" r="1.5" fill="currentColor" /></svg>
            {isConnecting ? t("connectingBtn") : t("connectWalletBtn")}
          </button>
          <button onClick={handleConnectWC} disabled={isConnecting} style={{
            display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px",
            background: "rgba(0,100,255,0.15)", border: "1px solid rgba(0,100,255,0.4)",
            color: "#6aa3ff", borderRadius: "100px", fontFamily: "'Outfit', sans-serif",
            fontWeight: 700, fontSize: "13px", cursor: isConnecting ? "not-allowed" : "pointer",
            opacity: isConnecting ? 0.7 : 1, transition: "all 0.2s",
          }}>
            {WC_SVG} WalletConnect
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-left">
          <div className="live-badge">
            <span className="live-dot" />
            {t("heroBadge")}
          </div>
          <h1>
            Game. Health.<br />
            <span className="y">Earn </span>
            <span className="c">HYK.</span>
          </h1>
          <p className="hero-sub">{t("heroSubtitle")}</p>

          <div className="price-card">
            <div className="price-label">{t("heroPresalePrice")}</div>
            <div className="price-main">
              <span className="price-num">$0.015</span>
              <span className="price-unit">USDT / HYK</span>
            </div>
            <div className="prog-labels">
              <span>{t("heroRaised")}: <b>$420,000</b></span>
              <span>{t("heroGoal")}: $1,500,000 &nbsp;<strong style={{ color: "#00E5FF" }}>28%</strong></span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill" style={{ width: `${progWidth}%` }} />
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
                <div className="btn-flow" onClick={handleConnect} style={{ opacity: isConnecting ? 0.7 : 1, cursor: isConnecting ? "not-allowed" : "pointer" }}>
                  <span className="btn-flow-buy">{isConnecting ? t("connectingBtn") : t("heroBuyNow")}</span>
                  <span className="btn-flow-arrow">→</span>
                  <span className="btn-flow-wallet">MetaMask</span>
                </div>
                <div className="btn-flow wc" onClick={handleConnectWC} style={{ opacity: isConnecting ? 0.7 : 1, cursor: isConnecting ? "not-allowed" : "pointer" }}>
                  <span className="btn-flow-buy">{isConnecting ? t("connectingBtn") : t("heroBuyNow")}</span>
                  <span className="btn-flow-arrow">→</span>
                  <span className="btn-flow-wallet">{WC_SVG} WalletConnect</span>
                </div>
              </div>
              <a className="btn-how" href="#" onClick={(e) => { e.preventDefault(); scrollTo("faq"); }}>{t("heroHowToBuy")}</a>
            </div>
            {connectError && <div style={{ marginTop: "10px", fontSize: "12px", color: "#ff6060", textAlign: "center" }}>{connectError}</div>}
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-glow" />
          <div className="hero-glow-inner" />
          <img className="hero-chick" src="/HiyokoHero.png" alt="HIYOKO" onError={(e) => { e.target.src = "/HiyokoHero.png"; }} />
          <div className="stats-row">
            {[["54M+", "Global Users"], ["36K+", "Pre-orders"], ["1B", "Total Supply"]].map(([num, lbl]) => (
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
          {ROADMAP.map((ph) => (
            <div key={ph.phase} className={`rm-card${ph.now ? " now" : ""}`}>
              <div className="rm-dot" />
              <div className="rm-phase">{ph.phase}</div>
              <div className="rm-title">{ph.title}</div>
              <ul className="rm-list">
                {ph.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
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

      {/* ── CTA ── */}
      <div className="section" style={{ textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(255,159,28,0.1), rgba(0,229,255,0.08))", border: "1px solid rgba(255,216,77,0.2)", borderRadius: "28px", padding: "64px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,216,77,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ fontSize: "52px", marginBottom: "18px" }}>🐣</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "14px" }}>
            Join the <span style={{ color: "#FFD84D" }}>HIYOKO</span> Ecosystem <span style={{ color: "#00E5FF" }}>Early.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "#6666AA", maxWidth: "520px", margin: "0 auto 36px", lineHeight: 1.75 }}>{t("ctaSubtitle")}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            <div className="btn-flow" onClick={handleConnect} style={{ maxWidth: "380px", opacity: isConnecting ? 0.7 : 1, cursor: isConnecting ? "not-allowed" : "pointer", fontSize: "15px" }}>
              <span className="btn-flow-buy" style={{ padding: "15px 22px" }}>{isConnecting ? t("connectingBtn") : t("heroBuyNow")}</span>
              <span className="btn-flow-arrow" style={{ padding: "15px 12px", fontSize: "18px" }}>→</span>
              <span className="btn-flow-wallet" style={{ padding: "15px 24px", fontSize: "15px" }}>MetaMask</span>
            </div>
            <div className="btn-flow wc" onClick={handleConnectWC} style={{ maxWidth: "420px", opacity: isConnecting ? 0.7 : 1, cursor: isConnecting ? "not-allowed" : "pointer", fontSize: "15px" }}>
              <span className="btn-flow-buy" style={{ padding: "15px 22px" }}>{isConnecting ? t("connectingBtn") : t("heroBuyNow")}</span>
              <span className="btn-flow-arrow" style={{ padding: "15px 12px", fontSize: "18px" }}>→</span>
              <span className="btn-flow-wallet" style={{ padding: "15px 24px", fontSize: "15px" }}>{WC_SVG} WalletConnect</span>
            </div>
          </div>
          <p style={{ marginTop: "20px", fontSize: "12px", color: "rgba(100,100,160,0.6)" }}>{t("ctaDisclaimer")}</p>
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
          <a href="#">Whitepaper</a>
        </div>
        <p className="foot-disc">{t("footerDisclaimer")}<br />{t("footerRights")}</p>
      </footer>
    </div>
  );
}

export default OnePage;
