import type { HTMLAttributes, ReactNode } from "react";
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
        "chamfered relative group",
        variant === "glass" && "glass-panel",
        variant === "default" && "bg-surface-primary border border-border-subtle",
        variant === "bordered" && "bg-surface-primary border border-border-glass",
        hover === "lift" && "card-lift",
        hover === "sweep" && "energy-sweep",
        hover === "glow" && "card-lift animate-glow-pulse",
        "corner-decor",
        diamond && "diamond-corner",
        className
      )}
      {...props}
    >
      {/* Diamond accent on hover */}
      <div className="pointer-events-none absolute -top-px -right-px h-3 w-3 rotate-45 border-t border-r border-border-glass opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-gold-400/40" />
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
        "font-display text-lg font-bold tracking-wider uppercase text-text-main",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-text-muted font-body", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
