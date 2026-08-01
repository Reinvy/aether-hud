"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Root error boundary — catches uncaught render errors for the entire
 * app. Complements the section-level <ErrorBoundary /> with a
 * route-segment fallback (Next.js App Router `error.tsx` convention).
 */

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep-space p-4">
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-10" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-violet" />
      <div className="scanline pointer-events-none absolute inset-0" />

      <div className="glass-panel chamfered relative w-full max-w-lg p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Error icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-hud-danger/30 bg-hud-danger/5">
            <AlertTriangle className="h-6 w-6 text-hud-danger" />
          </div>

          <div className="space-y-2">
            <span className="sys-label-gold text-[10px] tracking-[0.2em]">
              AETHER-HUD // CRITICAL FAULT
            </span>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              System <span className="text-hud-danger">Interrupted</span>
            </h1>
            <p className="mx-auto max-w-sm text-sm text-text-muted font-body">
              An unexpected error occurred while rendering this module. Core
              systems remain intact — reinitialize the interface to continue.
            </p>
          </div>

          {error.digest && (
            <span className="font-mono text-[9px] tracking-wider text-text-muted/40">
              [ERR_DIGEST // {error.digest}]
            </span>
          )}

          <button
            onClick={reset}
            className="btn-glow-sweep tactical-btn inline-flex items-center gap-2 border border-border-glass bg-glass-card px-6 py-2.5 text-xs font-mono tracking-wider text-gold-400 transition-all hover:bg-[rgba(242,201,76,0.12)]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            REINITIALIZE INTERFACE
          </button>

          <span className="absolute bottom-3 right-3 sys-label text-[8px] text-text-muted/20">
            [ERR_NODE]
          </span>
        </div>
      </div>
    </main>
  );
}
