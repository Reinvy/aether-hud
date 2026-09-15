"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface CodexLoaderProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: { spinner: "h-4 w-4", label: "text-[9px]", duration: "1.1s" },
  md: { spinner: "h-6 w-6", label: "text-[10px]", duration: "1.4s" },
  lg: { spinner: "h-9 w-9", label: "text-xs", duration: "1.8s" },
} as const;

/**
 * CodexLoader — the design-system loading indicator.
 *
 * Mirrors `DESIGNS.md` §5: the sanctioned spinner is the elemental diamond
 * rotation, never a generic circle. A static diamond outline sits under a
 * rotating gold-edged diamond, both driven by `.elemental-rotate` with a
 * loader-speed duration.
 */
export function CodexLoader({ label = "Loading…", size = "md", className }: CodexLoaderProps) {
  const s = sizeStyles[size];
  const spin = { "--codex-spin-duration": s.duration } as CSSProperties;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <span className={cn("relative block", s.spinner)}>
        <span className="absolute inset-0 rotate-45 codex-radius-xs border-2 border-leather-caramel/35 dark:border-gold-400/25" />
        <span
          style={spin}
          className="elemental-rotate absolute inset-0 rotate-45 codex-radius-xs border-2 border-transparent border-t-leather-caramel dark:border-t-gold-400"
        />
      </span>
      <p className={cn("codex-label-gold tracking-[0.2em]", s.label)}>{label}</p>
    </div>
  );
}
