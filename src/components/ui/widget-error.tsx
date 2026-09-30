"use client";

import { Button } from "@/components/ui/button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { CodexGlyph } from "@/components/ui/codex-glyph";
import { cn } from "@/lib/utils";
import type { GenshinIconKey } from "@/lib/ui-icons";

interface WidgetErrorProps {
  /** What failed, in sentence case, e.g. "Codex stats". */
  label?: string;
  /** Optional specific failure copy; a generic line is used when omitted. */
  message?: string;
  /** Renders a retry control when provided. */
  onRetry?: () => void;
  /** Medallion glyph for the failure mark. Defaults to the warning banner. */
  icon?: GenshinIconKey;
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
  icon = "warning",
  className,
}: WidgetErrorProps) {
  return (
    <div
      className={cn(
        "codex-card codex-radius-card relative flex min-h-32 flex-col items-center justify-center gap-2.5 p-6 text-center",
        className
      )}
    >
      <AssetIcon icon={icon} size="md" />
      <span className="codex-label-gold">{label}</span>
      <p className="text-xs text-leather-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <CodexGlyph name="refresh" className="text-sm" />
          Try again
        </Button>
      )}
    </div>
  );
}
