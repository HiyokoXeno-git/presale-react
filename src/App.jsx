import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import OnePage from "./pages/OnePage";
import PresalePage from "./pages/PresalePage";

// Wraps each page with an enter animation and handles exit animation before navigation
export function usePageTransition() {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);
  const pendingNav = useRef(null);

  useEffect(() => {
    if (!exiting || !pendingNav.current) return;
    const timer = setTimeout(() => {
      const { to, options } = pendingNav.current;
      pendingNav.current = null;
      setExiting(false);
      navigate(to, options);
    }, 340); // matches pageExit duration
    return () => clearTimeout(timer);
  }, [exiting, navigate]);

  function transitionTo(to, options) {
    if (exiting) return;
    pendingNav.current = { to, options };
    setExiting(true);
  }

  return { exiting, transitionTo };
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      {/* Fixed backgrounds live OUTSIDE the animated wrapper so transforms don't break position:fixed */}
      <div className="space-bg" />
      <div className="nebula" />
      <div className="shooting-star" />
      <div className="shooting-star" style={{ top: "28%", animationDelay: "3.5s", width: "120px" }} />
      <div className="shooting-star" style={{ top: "55%", animationDelay: "6s", width: "90px" }} />

      <div key={location.pathname} className="page-enter">
        <Routes location={location}>
          <Route path="/" element={<OnePage />} />
          <Route path="/presale" element={<PresalePage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
