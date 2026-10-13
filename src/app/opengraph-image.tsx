import { ImageResponse } from "next/og";
import { store } from "@/config/store";

/** Branded preview card shown when a Kumbha link is shared on WhatsApp, Facebook, X, etc. */
export const alt = `${store.name} — ${store.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const POT =
  "M25 19H39C39 21 39.6 22.6 41.2 23.6C50.6 27.2 55 34 55 41.5C55 52.6 45 61.5 32 61.5C19 61.5 9 52.6 9 41.5C9 34 13.4 27.2 22.8 23.6C24.4 22.6 25 21 25 19Z";

export default function OgImage() {
  const { theme } = store;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "70px 80px",
          background: `linear-gradient(135deg, #17181c 0%, #2a1a10 60%, ${theme.brand} 140%)`,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="86" height="86" viewBox="0 0 64 64">
              <path d="M32 1.5C35.6 5 37.2 8 37.2 10.2A5.2 5.2 0 0 1 26.8 10.2C26.8 8 28.4 5 32 1.5Z" fill={theme.accent} />
              <path d="M19.5 14H44.5A2.5 2.5 0 0 1 44.5 19H19.5A2.5 2.5 0 0 1 19.5 14Z" fill="#fff" />
              <path d={POT} fill="#fff" />
              <path d="M11.5 39.5Q32 47 52.5 39.5" stroke="#17181c" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>{store.name}</span>
          </div>
          <div style={{ marginTop: 40, fontSize: 52, fontWeight: 800, lineHeight: 1.1, maxWidth: 820 }}>{store.tagline}</div>
          <div style={{ marginTop: 28, fontSize: 30, opacity: 0.8, maxWidth: 820 }}>
            Clay pots · Diwali diyas · Eco Ganesh idols · Etikoppaka toys · Bricks to your site
          </div>
          <div style={{ display: "flex", marginTop: 40 }}>
            <span style={{ background: theme.accent, color: "#17181c", fontSize: 28, fontWeight: 800, padding: "10px 24px", borderRadius: 999 }}>
              Handmade · Delivered with care
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
