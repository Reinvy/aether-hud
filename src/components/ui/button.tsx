"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  glow?: "gold" | "stellar" | "none";
  crosshair?: boolean;
  /** Renders a HUD diamond spinner and disables the button while true. */
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = "gold", crosshair = false, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300",
          "tactical-btn btn-glow-sweep focus-ring-gold",
          "active:scale-[0.97] disabled:active:scale-100",
          crosshair && "crosshair-ring",

          /* Size */
          size === "sm" && "px-4 py-1.5 text-xs min-h-[32px]",
          size === "md" && "px-6 py-2.5 text-sm min-h-[40px]",
          size === "lg" && "px-8 py-3.5 text-base min-h-[48px] sm:px-10",

          /* Variant */
          variant === "primary" &&
            "bg-gradient-to-r from-gold-600 to-gold-500 text-deep-space hover:from-gold-500 hover:to-gold-400",
          variant === "secondary" &&
            "bg-glass-card border border-border-glass text-gold-400 hover:bg-[rgba(242,201,76,0.12)]",
          variant === "outline" &&
            "border border-border-subtle text-text-main hover:border-border-glass hover:bg-glass-card",
          variant === "ghost" &&
            "text-text-muted hover:text-gold-400 hover:bg-glass-200",
          variant === "danger" &&
            "bg-gradient-to-r from-hud-danger to-rose-700 text-white hover:from-rose-600 hover:to-rose-800",

          /* Glow */
          glow === "gold" && variant === "primary" && "glow-gold",
          glow === "stellar" && "glow-stellar",
          glow === "none" && "shadow-none",

          /* Loading / disabled */
          loading && "cursor-wait opacity-80",
          (disabled || loading) && "disabled:opacity-40 disabled:cursor-not-allowed",

          className
        )}
        {...props}
      >
        {loading && (
          <span
            className="hud-spinner shrink-0"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
