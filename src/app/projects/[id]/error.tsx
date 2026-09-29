"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Domain dossier error boundary — a render fault on one artifact page degrades
 * to this card instead of the root boundary, and keeps the visitor one click
 * away from the archive.
 */
export default function DomainDossierError({
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
          <div className="flex h-14 w-14 items-center justify-center codex-radius-card border border-crimson-600/30 bg-crimson-600/8">
            <AlertTriangle className="h-6 w-6 text-crimson-600" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <span className="codex-label-gold block">Domain dossier</span>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-leather-dark">
              This dossier did not <span className="text-crimson-600">open</span>
            </h1>
            <p className="mx-auto max-w-sm text-sm font-body text-leather-muted">
              The artifact page failed to render. The archive itself is unaffected.
            </p>
          </div>

          {error.digest && (
            <span className="text-[10px] tracking-wider text-leather-muted tabular-nums">
              Reference {error.digest}
            </span>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="secondary" size="md" glow="none" onClick={reset}>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </Button>
            <Link href="/" className="codex-btn-primary codex-sheen codex-focus px-6 py-2.5 text-xs tracking-wider">
              Back to the dossier
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
