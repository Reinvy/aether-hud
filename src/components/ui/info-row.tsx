import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InfoRowTone = "default" | "titanium" | "stellar" | "gold" | "danger";

const TONE_CLASS: Record<InfoRowTone, string> = {
  default: "text-text-main",
  titanium: "text-platinum-100",
  stellar: "text-stellar-400",
  gold: "text-gold-400",
  danger: "text-hud-danger",
};

interface InfoRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Mono sys label rendered on the left side of the row. */
  label: ReactNode;
  /** Value rendered on the right side. Ignored when `children` is provided. */
  value?: ReactNode;
  /** Accent color for the value (and icon). */
  tone?: InfoRowTone;
  /** Optional leading icon (e.g. a 3.5–4 sized Lucide icon). */
  icon?: ReactNode;
  /** Custom right-side content; overrides `value` when present. */
  children?: ReactNode;
}

/**
 * InfoRow — chamfered HUD key/value row used for read-only system data
 * (framework, database, deploy targets, …). Replaces hand-rolled
 * `rounded border` rows with the design-system chamfered treatment and a
 * shared hover micro-interaction.
 */
function InfoRow({
  className,
  label,
  value,
  tone = "default",
  icon,
  children,
  ...props
}: InfoRowProps) {
  return (
    <div
      className={cn(
        "chamfered-sm flex items-center justify-between gap-3 border border-leather-caramel/20 bg-parchment-subtle/60 px-4 py-3 transition-colors duration-300 hover:border-leather-caramel/40 hover:bg-leather-caramel/10 dark:border-border-subtle dark:bg-deep-space/40 dark:hover:border-border-glass dark:hover:bg-[rgba(242,201,76,0.04)]",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {icon && <span className={cn("shrink-0", tone === "default" ? "text-gold-400/60" : TONE_CLASS[tone])}>{icon}</span>}
        <span className="min-w-0 truncate font-mono text-xs text-text-muted">{label}</span>
      </div>
      {children ?? <span className={cn("shrink-0 font-mono text-xs", TONE_CLASS[tone])}>{value}</span>}
    </div>
  );
}

export { InfoRow, type InfoRowTone };
