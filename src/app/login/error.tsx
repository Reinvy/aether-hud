"use client";

import { AssetIcon } from "@/components/ui/asset-icon";
import { CodexGlyph } from "@/components/ui/codex-glyph";
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-parchment-base p-4">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-70" />

      <div className="codex-panel codex-panel-radius codex-rise relative w-full max-w-lg p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <AssetIcon icon="warning" size="md" />

          <div className="space-y-2">
            <span className="codex-label-gold block">Codex Console</span>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-leather-dark">
              Sign-in is <span className="text-crimson-600">unavailable</span>
            </h1>
            <p className="mx-auto max-w-sm text-sm font-body text-leather-muted">
              The sign-in form failed to load. Your password was never sent — try
              again to reopen the console.
            </p>
          </div>

          {error.digest && (
            <span className="text-[10px] tracking-wider text-leather-muted tabular-nums">
              Reference {error.digest}
            </span>
          )}

          <Button variant="secondary" size="md" onClick={reset}>
            <CodexGlyph name="refresh" className="text-base" />
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
