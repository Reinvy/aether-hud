"use client";

/**
 * AETHER-HUD HudLoader — reusable HUD-style loading indicator.
 *
 * Replaces ad-hoc `animate-spin rounded-full` spinners with a design-system
 * consistent diamond spinner + sys-label, used across dashboard layouts,
 * login, and content pages. Mirrors the Obsidian & Imperial Gold aesthetic.
 */
import { cn } from "@/lib/utils";

interface HudLoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: { spinner: "h-4 w-4 border-[1.5px]", label: "text-[9px]" },
  md: { spinner: "h-6 w-6 border-2", label: "text-[10px]" },
  lg: { spinner: "h-9 w-9 border-2", label: "text-xs" },
} as const;

export function HudLoader({ label = "INITIALIZING...", size = "md", className }: HudLoaderProps) {
  const s = sizeStyles[size];
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <div className="relative">
        <span className={cn("hud-spinner block", s.spinner)} />
        {/* Diamond corner indicator */}
        <span className="pointer-events-none absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rotate-45 bg-gold-400/50" />
      </div>
      <p className={cn("sys-label-gold tracking-[0.2em]", s.label)}>
        [SYS_NODE] // {label}
      </p>
    </div>
  );
}
