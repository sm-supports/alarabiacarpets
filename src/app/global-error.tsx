"use client";

import { useEffect, useRef } from "react";
import { hasStoredDraft } from "@/lib/draft";

/**
 * Replaces the whole document when a root layout itself throws, so the locale provider,
 * the stylesheet and the fonts may all be gone. Next loads this file on every page of
 * both languages: importing a dictionary here would put both on every page, and
 * check-page-weight wouldn't notice. Hence plain strings, inline styles and a literal
 * phone number.
 */
const COPY = {
  en: {
    lang: "en",
    dir: "ltr",
    brand: "Al Arabia Carpets",
    headline: "This page didn't load.",
    saved: "Your message is saved.",
    call: "Call",
    reload: "Reload",
  },
  ar: {
    lang: "ar-QA",
    dir: "rtl",
    brand: "سجاد العربية",
    headline: "الصفحة ما انفتحت.",
    saved: "رسالتك محفوظة.",
    call: "اتصل",
    reload: "أعد التحميل",
  },
};

const FOREST = "#0A2A1F";
const BUTTON: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  width: "100%",
  minHeight: 48,
  marginTop: 8,
  padding: "12px 24px",
  borderRadius: 9999,
  border: `1px solid ${FOREST}`,
  font: "inherit",
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
  cursor: "pointer",
};

export default function GlobalError() {
  const headline = useRef<HTMLHeadingElement>(null);
  const t = COPY[typeof location !== "undefined" && /^\/ar(\/|$)/.test(location.pathname) ? "ar" : "en"];

  useEffect(() => {
    headline.current?.focus();
  }, []);

  return (
    <html lang={t.lang} dir={t.dir}>
      <head>
        <title>{t.headline}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          boxSizing: "border-box",
          background: "#FAFAFA",
          color: FOREST,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif",
          lineHeight: 1.6,
        }}
      >
        <main style={{ width: "100%", maxWidth: 448, padding: 24, boxSizing: "border-box", background: "#fff", borderRadius: 16, border: "1px solid #E5E5E5" }}>
          <p style={{ margin: "0 0 8px", fontSize: 14 }}>{t.brand}</p>
          <h1 ref={headline} tabIndex={-1} style={{ margin: 0, fontSize: 18, fontWeight: 600, outline: "none" }}>
            {t.headline}
          </h1>
          {hasStoredDraft() && <p style={{ margin: "8px 0 0", fontSize: 14 }}>{t.saved}</p>}
          <div style={{ marginTop: 16 }}>
            <a href="tel:+97455512858" style={{ ...BUTTON, background: "#fff", color: FOREST }}>
              {t.call}
            </a>
            <button type="button" onClick={() => location.reload()} style={{ ...BUTTON, background: FOREST, color: "#fff" }}>
              {t.reload}
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
