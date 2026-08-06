/**
 * ListTableHeader — reusable column-header row for dashboard list views.
 * AETHER-HUD Design System: Obsidian & Imperial Gold
 *
 * Dedupes the identical `flex items-center gap-4 border-b border-border-subtle
 * px-4 py-2` header row that projects/experiences (and future list views)
 * hand-rolled. Each column renders as a sys-label; pass Tailwind sizing +
 * responsive-visibility classes via `className` (e.g. "hidden w-24 sm:block")
 * and alignment via `align`.
 */
import { cn } from "@/lib/utils";

export interface ListColumn {
  label: string;
  /** Tailwind classes for width + responsive visibility (e.g. "hidden w-24 sm:block"). */
  className?: string;
  align?: "left" | "center" | "right";
}

interface ListTableHeaderProps {
  columns: ListColumn[];
  className?: string;
}

export function ListTableHeader({ columns, className }: ListTableHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b border-border-subtle px-4 py-2",
        className
      )}
    >
      {columns.map((column) => (
        <span
          key={column.label}
          className={cn(
            "sys-label",
            column.align === "center" && "text-center",
            column.align === "right" && "text-right",
            column.className
          )}
        >
          {column.label}
        </span>
      ))}
    </div>
  );
}
