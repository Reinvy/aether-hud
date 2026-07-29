"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  glow?: "gold" | "stellar" | "none";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = "gold", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300",
          "tactical-btn btn-glow-sweep",

          /* Size */
          size === "sm" && "px-4 py-1.5 text-xs",
          size === "md" && "px-6 py-2.5 text-sm",
          size === "lg" && "px-8 py-3.5 text-base",

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

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, type ButtonProps };
