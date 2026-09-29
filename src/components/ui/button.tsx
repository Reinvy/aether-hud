"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  glow?: "gold" | "none";
  /** Renders the elemental diamond spinner and disables the button while true. */
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = "gold", loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300",
          "codex-btn codex-sheen codex-focus",
          "active:scale-[0.97] disabled:active:scale-100",

          /* Size */
          size === "sm" && "px-4 py-1.5 text-xs min-h-[32px]",
          size === "md" && "px-6 py-2.5 text-sm min-h-[40px]",
          size === "lg" && "px-8 py-3.5 text-base min-h-[48px] sm:px-10",

          /* Variant */
          variant === "primary" &&
            "bg-leather-caramel text-parchment-base font-semibold hover:opacity-90 shadow-md",
          variant === "secondary" &&
            "bg-parchment-subtle border border-leather-caramel/30 text-leather-dark hover:bg-leather-caramel/10",
          variant === "outline" &&
            "border border-leather-caramel/30 text-leather-dark hover:border-leather-caramel hover:bg-parchment-subtle/60",
          variant === "ghost" &&
            "text-leather-muted hover:text-leather-dark hover:bg-leather-caramel/10",
          variant === "danger" &&
            "bg-crimson-600 text-parchment-base hover:bg-crimson-700",

          /* Glow */
          glow === "gold" && "codex-glow-gold",
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
            className="elemental-rotate h-3.5 w-3.5 shrink-0"
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
