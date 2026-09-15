import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "jade" | "outline";
  size?: "sm" | "md";
}

function Badge({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "codex-badge inline-flex items-center gap-1.5 font-mono transition-all duration-300 hover:border-gold-400/40 hover:shadow-[0_0_12px_rgba(242,201,76,0.12)] hover-scale-sm",

        size === "sm" && "text-[10px] px-2 py-0.5",
        size === "md" && "text-xs px-3 py-1",

        variant === "gold" && "bg-leather-caramel/15 border-leather-caramel/40 text-leather-dark dark:bg-gold-400/10 dark:border-border-glass dark:text-gold-400 font-bold",
        variant === "jade" && "bg-jade-400/10 border-jade-400/30 text-jade-600 dark:bg-jade-400/10 dark:border-jade-400/30 dark:text-jade-400 font-bold",
        variant === "default" && "bg-leather-caramel/10 border-leather-caramel/25 text-leather-dark dark:bg-glass-200 dark:border-border-subtle dark:text-text-muted font-bold",
        variant === "outline" && "bg-transparent border-leather-caramel/30 text-leather-dark dark:border-border-glass dark:text-text-muted font-bold",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
