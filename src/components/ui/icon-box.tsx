import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * IconBox — reusable HUD icon container (chamfered box with
 * glass border + deep-space fill). Extracted from dashboard list rows
 * (projects, experiences, skills, sections) so every row-level icon
 * keeps the same Obsidian & Imperial Gold treatment.
 */
interface IconBoxProps {
  children: ReactNode;
  size?: "sm" | "md";
  className?: string;
}

export function IconBox({ children, size = "sm", className }: IconBoxProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center chamfered-xs border border-leather-caramel/30 bg-leather-caramel/10 text-leather-caramel dark:border-border-glass dark:bg-deep-space/50 dark:text-gold-400",
        "transition-all duration-300",
        // Micro-interaction: the sibling row/card hover brightens the icon
        // box (gold border + clipped-shape glow + slight scale). `group`
        // is set by the wrapping Card/row; drop-shadow follows the
        // chamfered clip-path so the glow hugs the cut corners.
        "group-hover:border-leather-caramel dark:group-hover:border-gold-400/50 group-hover:drop-shadow-[0_0_10px_rgba(242,201,76,0.2)] group-hover:scale-105",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className
      )}
    >
      {children}
    </div>
  );
}
