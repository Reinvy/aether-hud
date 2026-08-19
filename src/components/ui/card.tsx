import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered";
  hover?: "lift" | "sweep" | "glow" | "none";
  diamond?: boolean;
}

function Card({ className, variant = "glass", hover = "sweep", diamond = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl relative group",
        variant === "glass" && "parchment-panel dark:glass-panel",
        variant === "default" && "bg-parchment-subtle dark:bg-surface-primary border border-leather-caramel/25 dark:border-border-subtle",
        variant === "bordered" && "bg-parchment-subtle dark:bg-surface-primary border border-leather-caramel/40 dark:border-border-glass",
        hover === "lift" && "card-lift",
        hover === "sweep" && "energy-sweep",
        hover === "glow" && "card-lift",
        "corner-decor",
        diamond && "diamond-corner",
        className
      )}
      {...props}
    >
      {/* Diamond accent on hover */}
      <div className="pointer-events-none absolute -top-px -right-px h-3 w-3 rotate-45 border-t border-r border-leather-caramel/40 dark:border-border-glass opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-leather-caramel dark:group-hover:border-gold-400/40" />
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-lg font-bold tracking-wider uppercase text-leather-dark dark:text-text-main",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
