"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Optional accessible label rendered next to the switch. */
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * Toggle — reusable HUD switch.
 *
 * Obsidian & Imperial Gold treatment of a binary control: a chamfered
 * (squared) track with a rotated diamond knob that slides right and glows
 * gold when active. Replaces hand-rolled peer-checked switch markup across
 * dashboard settings so every toggle shares the same interaction language.
 */
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className,
  id,
}: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative inline-flex cursor-pointer items-center",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />
      {/* Chamfered track */}
      <div
        className={cn(
          "h-6 w-11 rounded-none border bg-deep-space transition-all duration-300",
          "border-border-glass peer-focus-visible:shadow-[0_0_0_2px_rgba(242,201,76,0.3)]",
          "peer-checked:border-gold-400/60 peer-checked:bg-[rgba(242,201,76,0.18)]"
        )}
      />
      {/* Diamond knob */}
      <div
        className={cn(
          "pointer-events-none absolute left-[3px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45",
          "border border-border-glass bg-glass-300 transition-all duration-300",
          "peer-checked:translate-x-[21px] peer-checked:border-gold-300 peer-checked:bg-gold-400",
          "peer-checked:shadow-[0_0_10px_rgba(242,201,76,0.55)]"
        )}
      />
      {label && (
        <span className="ml-3 font-mono text-[10px] tracking-wider text-text-muted">
          {label}
        </span>
      )}
    </label>
  );
}
