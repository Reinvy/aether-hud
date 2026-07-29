import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "stellar" | "outline";
  size?: "sm" | "md";
}

function Badge({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "tech-badge inline-flex items-center gap-1.5 font-mono",

        size === "sm" && "text-[10px] px-2 py-0.5",
        size === "md" && "text-xs px-3 py-1",

        variant === "gold" && "bg-[rgba(242,201,76,0.1)] border-border-glass text-gold-400",
        variant === "stellar" && "bg-[rgba(56,239,125,0.1)] border-stellar-400/30 text-stellar-400",
        variant === "default" && "bg-glass-200 border-border-subtle text-text-muted",
        variant === "outline" && "bg-transparent border-border-glass text-text-muted",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
