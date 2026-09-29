"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * IconButton — reusable icon-only button.
 *
 * Deduplicates the codex-btn radius icon buttons scattered across the shell
 * (sidebar close, header mobile toggle, dashboard hamburger) into one
 * component with the standard micro-interaction set: gold hover, hover
 * scale, press scale, and focus ring.
 *
 * Design: Teyvat Codex — warm fantasy.
 */

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * sm = compact (p-1.5, inline icon buttons).
   * md = touch-friendly (min-h-10 min-w-10, mobile shell controls).
   */
  size?: "sm" | "md";
  /** Accessible name for the icon-only control (rendered as aria-label + title). */
  label: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "sm", label, children, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center codex-btn text-leather-muted transition-all duration-300",
          "hover:text-gold-ink hover-scale-sm press-scale codex-focus",
          size === "sm" && "p-1.5",
          size === "md" && "min-h-10 min-w-10 p-0",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton };
