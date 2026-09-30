"use client";

import { AssetIcon } from "@/components/ui/asset-icon";
import { CodexGlyph } from "@/components/ui/codex-glyph";
import { Button } from "@/components/ui/button";

/**
 * Dashboard segment error boundary — catches uncaught render errors in the
 * /dashboard route tree so one failed view never blanks the whole Codex
 * Console. The sidebar chrome stays mounted around it.
 */

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="codex-panel codex-panel-radius w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <AssetIcon icon="warning" size="md" />

          <div className="space-y-2">
            <span className="codex-label-gold block">Codex Console</span>
            <h1 className="font-display text-xl font-bold tracking-[0.08em] text-leather-dark">
              This page is <span className="text-crimson-600">unavailable</span>
            </h1>
            <p className="mx-auto max-w-sm text-sm font-body text-leather-muted">
              Something went wrong while drawing this section. Nothing was saved
              or lost — try again to restore the view.
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
    </div>
  );
}
