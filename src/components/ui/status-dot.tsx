import { cn } from "@/lib/utils";

/**
 * StatusDot — reusable status indicator.
 *
 * Replaces ad-hoc `h-2 w-2 rounded-full` dots scattered across the
 * header, sidebar, login, contact, dashboard headers and activity feed with
 * a single design-system-consistent indicator (rotate-45), matching
 * the Teyvat Codex "indicators" micro-detail language.
 *
 * Tones map to the status palette: active (jade green), warning
 * (amber), danger (rose), gold (imperial), jade (cyan), muted (default).
 */

export type StatusTone = "active" | "warning" | "danger" | "gold" | "jade" | "muted";

interface StatusDotProps {
  /** Status tone. Defaults to "active". */
  tone?: StatusTone;
  size?: "sm" | "md";
  /** Enables the energy-pulse animation (used for live/online states). */
  pulse?: boolean;
  /** Enables the matching colored glow shadow. Defaults to true. */
  glow?: boolean;
  /** Optional accessible label (rendered as sr-only text). */
  label?: string;
  className?: string;
}

const TONE_STYLES: Record<StatusTone, string> = {
  active: "bg-jade-ink",
  warning: "bg-amber-ink",
  danger: "bg-crimson-600",
  gold: "bg-gold-400",
  jade: "bg-jade-500",
  muted: "bg-leather-muted/40",
};

const GLOW_STYLES: Record<StatusTone, string> = {
  active: "shadow-[0_0_6px_rgba(10,110,58,0.45)]",
  warning: "shadow-[0_0_6px_rgba(138,90,0,0.45)]",
  danger: "shadow-[0_0_6px_rgba(179,38,30,0.45)]",
  gold: "shadow-[0_0_6px_rgba(242,201,76,0.6)]",
  jade: "shadow-[0_0_6px_rgba(25,196,106,0.45)]",
  muted: "",
};

export function StatusDot({
  tone = "active",
  size = "sm",
  pulse = false,
  glow = true,
  label,
  className,
}: StatusDotProps) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      className={cn(
        "inline-block shrink-0 rotate-45",
        size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5",
        TONE_STYLES[tone],
        glow && GLOW_STYLES[tone],
        pulse && "animate-pulse",
        className
      )}
    >
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
