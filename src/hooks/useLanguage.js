import { useState, useEffect, useCallback } from "react";
import { TRANSLATIONS, countryToLang } from "../i18n/translations";

const LS_KEY = "hiyoko_lang";

function detectBrowserLang() {
  const nav = navigator.language || navigator.languages?.[0] || "en";
  const code = nav.toLowerCase();
  if (code.startsWith("id")) return "id";
  if (code.startsWith("ja")) return "ja";
  return "en";
}

export function useLanguage() {
  const [lang, setLangState] = useState(() => {
    // 1. Saved preference
    const saved = localStorage.getItem(LS_KEY);
    if (saved && TRANSLATIONS[saved]) return saved;
    // 2. Browser language as interim fallback while IP loads
    return detectBrowserLang();
  });

  // Detect by IP on first visit (no saved preference)
  useEffect(() => {
    if (localStorage.getItem(LS_KEY)) return; // already chosen

    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) })
      .then((r) => r.json())
      .then((data) => {
        const detected = countryToLang(data.country_code);
        setLangState(detected);
      })
      .catch(() => {
        // fallback: keep browser language — already set
      });
  }, []);

  const setLang = useCallback((code) => {
    if (!TRANSLATIONS[code]) return;
    localStorage.setItem(LS_KEY, code);
    setLangState(code);
  }, []);

  /** t(key) — get translated string */
  const t = useCallback(
    (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key,
    [lang]
  );

  return { lang, setLang, t };
}
