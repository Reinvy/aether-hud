import { cn } from "@/lib/utils";

/**
 * StatusDot — reusable HUD diamond status indicator.
 *
 * Replaces ad-hoc `h-2 w-2 rounded-full bg-hud-*` dots scattered across the
 * header, sidebar, login, contact, dashboard headers and activity feed with
 * a single design-system-consistent diamond indicator (rotate-45), matching
 * the AETHER-HUD "diamond indicators" micro-detail language.
 *
 * Tones map to the HUD status palette: active (stellar green), warning
 * (amber), danger (rose), gold (imperial), stellar (cyan), muted (titanium).
 */

export type StatusTone = "active" | "warning" | "danger" | "gold" | "stellar" | "muted";

interface StatusDotProps {
  /** HUD status tone. Defaults to "active". */
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
  active: "bg-hud-active",
  warning: "bg-hud-warning",
  danger: "bg-hud-danger",
  gold: "bg-gold-400",
  stellar: "bg-stellar-400",
  muted: "bg-text-muted/40",
};

const GLOW_STYLES: Record<StatusTone, string> = {
  active: "shadow-[0_0_6px_rgba(0,255,135,0.6)]",
  warning: "shadow-[0_0_6px_rgba(255,153,0,0.6)]",
  danger: "shadow-[0_0_6px_rgba(255,0,85,0.6)]",
  gold: "shadow-[0_0_6px_rgba(242,201,76,0.6)]",
  stellar: "shadow-[0_0_6px_rgba(0,210,255,0.6)]",
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
        pulse && "animate-energy-pulse",
        className
      )}
    >
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
