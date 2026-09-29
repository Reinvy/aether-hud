"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WidgetErrorProps {
  /** What failed, in sentence case, e.g. "Codex stats". */
  label?: string;
  /** Optional specific failure copy; a generic line is used when omitted. */
  message?: string;
  /** Renders a retry control when provided. */
  onRetry?: () => void;
  className?: string;
}

/**
 * WidgetError — compact fallback for a single failing console widget.
 *
 * Passed as the `fallback` prop of `<ErrorBoundary />` around individual
 * widgets (stat grids, list cards, feeds) so one failure renders a small
 * card instead of blanking the whole view.
 */
export function WidgetError({
  label = "This section",
  message = "Could not be loaded. The rest of the page still works.",
  onRetry,
  className,
}: WidgetErrorProps) {
  return (
    <div
      className={cn(
        "codex-card codex-radius-card relative flex min-h-32 flex-col items-center justify-center gap-2.5 p-6 text-center",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center codex-radius-card border border-crimson-600/30 bg-crimson-600/8">
        <AlertTriangle className="h-4 w-4 text-crimson-600" />
      </div>
      <span className="codex-label-gold">{label}</span>
      <p className="text-xs text-leather-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
