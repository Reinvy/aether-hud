import { ImageResponse } from "next/og";
import { APP_DESCRIPTION, APP_NAME, PORTFOLIO_CONFIG } from "@/lib/constants";

/**
 * Social share card. Rendered at build time by the `opengraph-image` file
 * convention, so `metadata.openGraph.images` / `twitter.images` are supplied
 * automatically — the retired `/og-image.png` reference pointed at a file that
 * did not exist.
 */
export const alt = `${APP_NAME} — Interactive Traveler Dossier`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #FAF8F5 0%, #F3EDDF 55%, #EDE5D2 100%)",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#FAF8F5",
              border: "2px solid #8C6239",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B88414",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#8C6239",
              fontFamily: "sans-serif",
            }}
          >
            Teyvat Codex / Archive
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, color: "#2C1E14", letterSpacing: 2 }}>{APP_NAME}</div>
          <div style={{ height: 3, width: 220, background: "#B88414" }} />
          <div style={{ fontSize: 30, color: "#5E412A", fontFamily: "sans-serif" }}>
            {`${PORTFOLIO_CONFIG.name} — ${PORTFOLIO_CONFIG.tagline}`}
          </div>
        </div>

        <div style={{ fontSize: 20, color: "#8C6239", fontFamily: "sans-serif" }}>
          {APP_DESCRIPTION}
        </div>
      </div>
    ),
    size
  );
}
