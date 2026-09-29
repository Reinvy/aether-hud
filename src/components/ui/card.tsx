import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass";
  hover?: "lift" | "sweep" | "glow" | "none";
}

function Card({ className, variant = "glass", hover = "sweep", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "codex-panel-radius relative group",
        variant === "glass" && "codex-panel",
        variant === "default" && "bg-parchment-subtle border border-leather-caramel/25",
        hover === "lift" && "codex-lift",
        hover === "sweep" && "codex-sheen",
        hover === "glow" && "codex-glow-gold",
        className
      )}
      {...props}
    >
      {/* Diamond accent on hover */}
      <div className="pointer-events-none absolute -top-px -right-px h-3 w-3 rotate-45 border-t border-r border-leather-caramel/40 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-leather-caramel" />
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
        "font-display text-lg font-bold tracking-wider uppercase text-leather-dark",
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
