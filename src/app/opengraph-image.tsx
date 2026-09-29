import { ImageResponse } from "next/og";
import { APP_DESCRIPTION, APP_NAME, PORTFOLIO_CONFIG } from "@/lib/constants";

/**
 * Social share card. Rendered at build time by the `opengraph-image` file
 * convention, so `metadata.openGraph.images` / `twitter.images` are supplied
 * automatically — the retired `/og-image.png` reference pointed at a file that
 * did not exist.
 *
 * `ImageResponse` renders outside the document stylesheet, so the palette is
 * repeated here as literals; keep the values identical to the tokens in
 * `src/app/globals.css`.
 */
const OG_PALETTE = {
  base: "#FAF8F5",
  subtle: "#F3EDDF",
  elevated: "#EDE5D2",
  caramel: "#8C6239",
  goldInk: "#6E4F0E",
  leatherDark: "#2C1E14",
  leatherMuted: "#5E412A",
} as const;

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
          background: `linear-gradient(160deg, ${OG_PALETTE.base} 0%, ${OG_PALETTE.subtle} 55%, ${OG_PALETTE.elevated} 100%)`,
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
              background: OG_PALETTE.base,
              border: `2px solid ${OG_PALETTE.caramel}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: OG_PALETTE.goldInk,
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
              color: OG_PALETTE.caramel,
              fontFamily: "sans-serif",
            }}
          >
            Teyvat Codex / Archive
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 84, color: OG_PALETTE.leatherDark, letterSpacing: 2 }}>
            {APP_NAME}
          </div>
          <div style={{ height: 3, width: 220, background: OG_PALETTE.goldInk }} />
          <div style={{ fontSize: 30, color: OG_PALETTE.leatherMuted, fontFamily: "sans-serif" }}>
            {`${PORTFOLIO_CONFIG.name} — ${PORTFOLIO_CONFIG.tagline}`}
          </div>
        </div>

        <div style={{ fontSize: 20, color: OG_PALETTE.leatherMuted, fontFamily: "sans-serif" }}>
          {APP_DESCRIPTION}
        </div>
      </div>
    ),
    size
  );
}
