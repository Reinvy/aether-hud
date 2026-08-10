"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Login segment error boundary — catches uncaught render errors in the
 * /login route tree so a failed auth module never blanks the whole gate.
 * Mirrors the dashboard segment boundary (dashboard/error.tsx) with
 * auth-specific copy.
 */

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep-space p-4">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-10" />
      <div className="scanline pointer-events-none absolute inset-0" />

      <div className="glass-panel chamfered relative w-full max-w-lg p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Error icon */}
          <div className="flex h-14 w-14 items-center justify-center chamfered border border-hud-danger/30 bg-hud-danger/5">
            <AlertTriangle className="h-6 w-6 text-hud-danger" />
          </div>

          <div className="space-y-2">
            <span className="sys-label-gold text-[10px] tracking-[0.2em]">
              AUTH GATE // SESSION FAULT
            </span>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              Secure Channel <span className="text-hud-danger">Interrupted</span>
            </h1>
            <p className="mx-auto max-w-sm text-sm text-text-muted font-body">
              The authentication module failed to initialize. Credentials are
              not transmitted — reinitialize the gate to continue.
            </p>
          </div>

          {error.digest && (
            <span className="font-mono text-[9px] tracking-wider text-text-muted/40">
              [ERR_DIGEST // {error.digest}]
            </span>
          )}

          <Button
            variant="secondary"
            size="md"
            onClick={reset}
            className="font-mono tracking-wider"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            REINITIALIZE GATE
          </Button>

          <span className="absolute bottom-3 right-3 sys-label text-[8px] text-text-muted/20">
            [AUTH_ERR_NODE]
          </span>
        </div>
      </div>
    </main>
  );
}
