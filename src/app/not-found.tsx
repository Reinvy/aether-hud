import type { Metadata } from "next";
import Link from "next/link";
import { AssetIcon } from "@/components/ui/asset-icon";

/**
 * 404 page — the requested page is not in the codex.
 */
export const metadata: Metadata = {
  title: "404 — Page not found",
  description: "This page is not part of the Teyvat Codex. Return to the traveler dossier.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-parchment-base p-4">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-20" />
      <div className="pointer-events-none absolute inset-0 codex-grid-bg opacity-10" />

      <div className="codex-card codex-panel-radius codex-rise relative w-full max-w-lg p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-baseline gap-3">
            <span className="codex-gradient-text font-display text-6xl font-black tracking-[0.08em]">
              404
            </span>
            <span className="codex-label text-[10px]">Not in the archive</span>
          </div>

          <div className="space-y-2">
            <span className="codex-label-gold text-[10px] tracking-[0.2em]">
              Lost Wayfarer
            </span>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-leather-dark">
              This page <span className="text-crimson-600">is not here</span>
            </h1>
            <p className="mx-auto max-w-sm text-sm text-leather-muted font-body">
              The trail you followed does not lead anywhere in the codex. Check
              the address, or head back to the traveler dossier.
            </p>
          </div>

          <Link
            href="/"
            className="codex-btn-secondary codex-sheen codex-focus px-6 py-2.5 text-xs tracking-wider"
          >
            <AssetIcon icon="back" tone="ink" size="sm" />
            Return to the dossier
          </Link>
        </div>
      </div>
    </main>
  );
}
