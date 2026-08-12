import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

/**
 * HUD-styled 404 page — unknown coordinates outside the tactical grid.
 */

export const metadata: Metadata = {
  title: "404 — Signal Lost",
  description: "The requested sector does not exist in the tactical grid. Return to base.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep-space p-4">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-10" />
      <div className="scanline pointer-events-none absolute inset-0" />

      <div className="glass-panel chamfered relative w-full max-w-lg p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* 404 status */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-6xl font-black tracking-[0.08em] text-gradient-gold">
              404
            </span>
            <span className="sys-label text-[10px] text-text-muted">// STATUS</span>
          </div>

          <div className="space-y-2">
            <span className="sys-label-gold text-[10px] tracking-[0.2em]">
              SIGNAL LOST // UNKNOWN COORDINATES
            </span>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              Coordinates <span className="text-hud-danger">Not Found</span>
            </h1>
            <p className="mx-auto max-w-sm text-sm text-text-muted font-body">
              The requested sector does not exist in the tactical grid. Verify
              the coordinates or return to base.
            </p>
          </div>

          <Link
            href="/"
            className="btn-glow-sweep tactical-btn inline-flex items-center gap-2 border border-border-glass bg-glass-card px-6 py-2.5 text-xs font-mono tracking-wider text-gold-400 transition-all hover:bg-[rgba(242,201,76,0.12)] hover-scale-sm press-scale focus-ring-gold"
          >
            <Compass className="h-3.5 w-3.5" />
            RETURN TO BASE
          </Link>

          <span className="absolute bottom-3 right-3 sys-label text-[8px] text-text-muted/20">
            [LOST_NODE]
          </span>
        </div>
      </div>
    </main>
  );
}
