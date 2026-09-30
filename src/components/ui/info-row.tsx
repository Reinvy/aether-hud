import type { HTMLAttributes, ReactNode } from "react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { cn } from "@/lib/utils";
import type { GenshinIconKey } from "@/lib/ui-icons";

type InfoRowTone = "default" | "jade" | "gold" | "danger" | "muted";

const TONE_CLASS: Record<InfoRowTone, string> = {
  default: "text-gold-ink",
  jade: "text-jade-ink",
  gold: "text-gold-ink",
  danger: "text-crimson-600",
  muted: "text-leather-muted",
};

interface InfoRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Mono sys label rendered on the left side of the row. */
  label: ReactNode;
  /** Value rendered on the right side. Ignored when `children` is provided. */
  value?: ReactNode;
  /** Accent color for the value (and icon). */
  tone?: InfoRowTone;
  /** Optional leading glyph from the artwork pool. */
  icon?: GenshinIconKey;
  /** Custom right-side content; overrides `value` when present. */
  children?: ReactNode;
}

/**
 * InfoRow — codex key/value row used for read-only system data
 * (framework, database, deploy targets, …). Replaces hand-rolled
 * `rounded border` rows with the design-system codex treatment and a
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
        "codex-radius-card flex items-center justify-between gap-3 border border-leather-caramel/20 bg-parchment-subtle/60 px-4 py-3 transition-colors duration-300 hover:border-leather-caramel/40 hover:bg-leather-caramel/10",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {icon && (
          <span className={cn("shrink-0", TONE_CLASS[tone])}>
            <AssetIcon icon={icon} tone="ink" size="sm" />
          </span>
        )}
        <span className="codex-label min-w-0 truncate">{label}</span>
      </div>
      {children ?? (
        <span className={cn("shrink-0 font-display tabular-nums text-xs", TONE_CLASS[tone])}>
          {value}
        </span>
      )}
    </div>
  );
}

export { InfoRow };
