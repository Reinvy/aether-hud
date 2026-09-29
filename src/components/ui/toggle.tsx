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
 * Toggle — reusable switch.
 *
 * Teyvat Codex treatment of a binary control: a codex-panel-radius
 * (squared) track with a rotated knob that slides right and glows
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
  const control = (
    <>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />
      {/* Sliding track */}
      <div
        className={cn(
          "h-6 w-11 rounded-full border transition-all duration-300",
          "border-leather-caramel/30 bg-parchment-subtle peer-focus-visible:shadow-[0_0_0_2px_rgba(140,98,57,0.3)]",
          "peer-checked:border-leather-caramel peer-checked:bg-leather-caramel/20"
        )}
      />
      {/* Diamond knob */}
      <div
        className={cn(
          "pointer-events-none absolute left-[3px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45",
          "border border-leather-caramel/40 bg-parchment-elevated transition-all duration-300",
          "peer-checked:translate-x-[21px] peer-checked:border-leather-dark peer-checked:bg-leather-caramel",
          "peer-checked:shadow-[0_0_10px_rgba(140,98,57,0.4)]"
        )}
      />
    </>
  );

  const shell = cn(
    "relative inline-flex cursor-pointer items-center after:absolute after:-inset-1.5 after:content-['']",
    disabled && "cursor-not-allowed opacity-50",
    className
  );

  // Without its own label text the switch must not introduce a second
  // `<label>` for the control — the caller owns the single description.
  if (!label) {
    return <span className={shell}>{control}</span>;
  }

  return (
    <label htmlFor={id} className={shell}>
      {control}
      <span className="ml-3 font-mono text-[10px] tracking-wider text-leather-muted">{label}</span>
    </label>
  );
}
