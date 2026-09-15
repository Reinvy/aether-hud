"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WidgetErrorProps {
  /** What failed, e.g. "Statistics". */
  label?: string;
  className?: string;
}

/**
 * WidgetError — compact fallback for a single failing console widget.
 *
 * Passed as the `fallback` prop of `<ErrorBoundary />` around individual
 * widgets (stat grids, list cards, feeds) so one failure renders a small
 * card instead of blanking the whole view.
 */
export function WidgetError({ label = "This widget", className }: WidgetErrorProps) {
  return (
    <div
      className={cn(
        "codex-card codex-panel-radius relative flex min-h-32 flex-col items-center justify-center gap-2.5 p-6 text-center",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center codex-radius-sm border border-hud-danger/30 bg-hud-danger/5">
        <AlertTriangle className="h-4 w-4 text-hud-danger" />
      </div>
      <span className="codex-label-gold text-[9px] tracking-[0.2em]">{label}</span>
      <p className="text-xs text-text-muted">
        Could not be loaded. The rest of the page still works.
      </p>
    </div>
  );
}
