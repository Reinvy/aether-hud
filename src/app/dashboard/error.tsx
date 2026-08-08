"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Dashboard segment error boundary — catches uncaught render errors in
 * the /dashboard route tree so a failed module never blanks the whole
 * control panel.
 */

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="dashboard-grid-bg flex min-h-full items-center justify-center p-6 lg:p-8">
      <div className="glass-panel chamfered w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center chamfered border border-hud-danger/30 bg-hud-danger/5">
            <AlertTriangle className="h-6 w-6 text-hud-danger" />
          </div>

          <div className="space-y-2">
            <span className="sys-label-gold text-[10px] tracking-[0.2em]">
              DASHBOARD // MODULE FAULT
            </span>
            <h1 className="font-display text-xl font-bold tracking-[0.08em] text-text-main">
              Control Panel <span className="text-hud-danger">Degraded</span>
            </h1>
            <p className="mx-auto max-w-sm text-sm text-text-muted font-body">
              This module failed to render. Data integrity is preserved —
              retry the operation to restore the interface.
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
            RETRY MODULE
          </Button>
        </div>
      </div>
    </div>
  );
}
