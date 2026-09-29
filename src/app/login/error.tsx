"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Login segment error boundary — catches uncaught render errors in the
 * /login route tree so a failed sign-in module never blanks the gate.
 * Mirrors the dashboard segment boundary (dashboard/error.tsx).
 */

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-parchment-base p-4 dark:bg-deep-space">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-70 dark:opacity-50" />

      <div className="codex-panel codex-panel-radius relative w-full max-w-lg p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center codex-radius-sm border border-hud-danger/30 bg-hud-danger/5">
            <AlertTriangle className="h-6 w-6 text-hud-danger" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <span className="codex-label-gold block">Codex Console</span>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              Sign-in is <span className="text-hud-danger">unavailable</span>
            </h1>
            <p className="mx-auto max-w-sm text-sm font-body text-text-muted">
              The sign-in form failed to load. Your password was never sent — try
              again to reopen the console.
            </p>
          </div>

          {error.digest && (
            <span className="text-[10px] tracking-wider text-text-muted/60 dark:text-platinum-200/70 tabular-nums">
              Reference {error.digest}
            </span>
          )}

          <Button variant="secondary" size="md" onClick={reset}>
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
