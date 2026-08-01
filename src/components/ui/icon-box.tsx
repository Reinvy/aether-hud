import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * IconBox — reusable HUD icon container (chamfered/rounded box with
 * glass border + deep-space fill). Extracted from dashboard list rows
 * (projects, experiences, skills, sections) so every row-level icon
 * keeps the same Obsidian & Imperial Gold treatment.
 */
interface IconBoxProps {
  children: ReactNode;
  size?: "sm" | "md";
  shape?: "rounded" | "circle";
  className?: string;
}

export function IconBox({ children, size = "sm", shape = "rounded", className }: IconBoxProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border border-border-glass bg-deep-space/50",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        shape === "rounded" ? "rounded" : "rounded-full",
        className
      )}
    >
      {children}
    </div>
  );
}
