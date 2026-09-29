"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Root error boundary — catches uncaught render errors for the entire app.
 * Complements the section-level `<ErrorBoundary />` with a route-segment
 * fallback (Next.js App Router `error.tsx` convention).
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-parchment-base p-4">
      <div className="pointer-events-none absolute inset-0 codex-grid-bg opacity-10" />

      <div className="codex-card codex-panel-radius codex-rise relative w-full max-w-lg p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center codex-panel-radius border border-crimson-600/30 bg-crimson-600/8">
            <AlertTriangle className="h-6 w-6 text-crimson-600" />
          </div>

          <div className="space-y-2">
            <span className="codex-label-gold text-[10px] tracking-[0.2em]">
              Traveler&apos;s Log
            </span>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-leather-dark">
              Something <span className="text-crimson-600">interrupted</span> this page
            </h1>
            <p className="mx-auto max-w-sm text-sm text-leather-muted font-body">
              The page could not finish loading. Try again, and if it keeps
              failing the reference below will help track it down.
            </p>
          </div>

          {error.digest && (
            <span className="text-[10px] tracking-wider tabular-nums text-leather-muted">
              Reference {error.digest}
            </span>
          )}

          <Button variant="secondary" size="md" onClick={reset}>
            <RefreshCw className="h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
