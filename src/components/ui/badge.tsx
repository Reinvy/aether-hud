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
        "tech-badge inline-flex items-center gap-1.5 font-mono transition-all duration-300 hover:border-gold-400/40 hover:shadow-[0_0_12px_rgba(242,201,76,0.12)] hover-scale-sm",

        size === "sm" && "text-[10px] px-2 py-0.5",
        size === "md" && "text-xs px-3 py-1",

        variant === "gold" && "bg-leather-caramel/15 border-leather-caramel/40 text-leather-dark dark:bg-[rgba(242,201,76,0.1)] dark:border-border-glass dark:text-gold-400 font-bold",
        variant === "stellar" && "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:bg-[rgba(56,239,125,0.1)] dark:border-stellar-400/30 dark:text-stellar-400 font-bold",
        variant === "default" && "bg-leather-caramel/10 border-leather-caramel/25 text-[#1E1208] dark:bg-glass-200 dark:border-border-subtle dark:text-text-muted font-bold",
        variant === "outline" && "bg-transparent border-leather-caramel/30 text-[#1E1208] dark:border-border-glass dark:text-text-muted font-bold",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
