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
        "codex-badge inline-flex items-center gap-1.5 font-mono transition-all duration-300 hover:border-leather-caramel/50 hover-scale-sm",

        size === "sm" && "text-[10px] px-2 py-0.5",
        size === "md" && "text-xs px-3 py-1",

        variant === "gold" && "bg-leather-caramel/15 border-leather-caramel/40 text-leather-dark font-bold",
        variant === "jade" && "bg-jade-500/12 border-jade-500/30 text-jade-ink font-bold",
        variant === "default" && "bg-leather-caramel/10 border-leather-caramel/25 text-leather-dark font-bold",
        variant === "outline" && "bg-transparent border-leather-caramel/30 text-leather-dark font-bold",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
