/**
 * WidgetError — compact HUD fault fallback for dashboard widgets.
 * AETHER-HUD Design System: Obsidian & Imperial Gold
 *
 * Passed as the `fallback` prop of <ErrorBoundary /> around individual
 * dashboard widgets (stat grids, list cards, feeds) so one failing widget
 * renders a small fault card instead of blanking the whole view.
 */
"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WidgetErrorProps {
  /** Widget identifier rendered in the fault label, e.g. "STATS GRID". */
  label?: string;
  className?: string;
}

export function WidgetError({ label = "WIDGET", className }: WidgetErrorProps) {
  return (
    <div
      className={cn(
        "glass-panel chamfered corner-decor relative flex min-h-32 flex-col items-center justify-center gap-2.5 p-6 text-center",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-hud-danger/30 bg-hud-danger/5">
        <AlertTriangle className="h-4 w-4 text-hud-danger" />
      </div>
      <span className="sys-label-gold text-[9px] tracking-[0.2em]">
        {label} // FAULT
      </span>
      <p className="font-mono text-[10px] text-text-muted/70">
        Module failed — system integrity preserved
      </p>
    </div>
  );
}
