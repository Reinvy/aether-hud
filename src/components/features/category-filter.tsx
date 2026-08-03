import { cn } from "@/lib/utils";

/**
 * CategoryFilter — reusable tech-badge filter bar for dashboard list pages.
 * Extracted from the skills page's category filter so any list page
 * (skills, projects, experiences, testimonials) can render the same
 * hexagonal tech-badge filter without duplicating markup.
 */
interface CategoryFilterProps<T extends string> {
  categories: T[];
  active: T | null;
  onSelect: (category: T | null) => void;
  /** Total count for the "ALL" badge. */
  total: number;
  /** Per-category counts. Defaults to category presence in `categories`. */
  counts?: Partial<Record<T, number>>;
  className?: string;
}

export function CategoryFilter<T extends string>({
  categories,
  active,
  onSelect,
  total,
  counts,
  className,
}: CategoryFilterProps<T>) {
  const badgeClass = (isActive: boolean) =>
    cn(
      "tech-badge px-3 py-1.5 text-[10px] font-mono tracking-wider transition-all hover-scale-sm press-scale",
      isActive
        ? "border-border-glass bg-[rgba(242,201,76,0.12)] text-gold-400"
        : "border-border-subtle text-text-muted hover:border-border-glass hover:text-gold-400"
    );

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button onClick={() => onSelect(null)} className={badgeClass(!active)}>
        ALL // {total}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(active === cat ? null : cat)}
          className={badgeClass(active === cat)}
        >
          {cat.toUpperCase()} // {counts?.[cat] ?? 0}
        </button>
      ))}
    </div>
  );
}
