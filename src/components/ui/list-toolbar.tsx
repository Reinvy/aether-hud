"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";

interface ListToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  searchPlaceholder?: string;
  sort: string;
  onSortChange: (sort: string) => void;
  sortOptions: SelectOption[];
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  /** Rows left after filtering. */
  filteredCount: number;
  /** Unfiltered row count. */
  total: number;
  /** Number of rows currently selected. */
  selectionCount: number;
  /** Rendered on the trailing edge once at least one row is selected. */
  bulkActions?: ReactNode;
}

const DEFAULT_PAGE_SIZES = [10, 25, 50];

/**
 * ListToolbar — the shared search / sort / page-size bar for console lists.
 *
 * Replaces the per-view ad-hoc filter rows and the standalone ArchiveSearch /
 * CategoryFilter widgets, so every list is filtered the same way and the bulk
 * action slot only appears when there is a selection to act on.
 */
export function ListToolbar({
  query,
  onQueryChange,
  searchPlaceholder = "Search…",
  sort,
  onSortChange,
  sortOptions,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  filteredCount,
  total,
  selectionCount,
  bulkActions,
}: ListToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end">
      <div className="flex-1">
        <Input
          id="list-search"
          label="Search"
          type="search"
          value={query}
          placeholder={searchPlaceholder}
          onChange={(event) => onQueryChange(event.target.value)}
          prefix={<Search className="h-4 w-4" aria-hidden="true" />}
        />
      </div>

      <div className="sm:w-48">
        <Select
          id="list-sort"
          label="Sort by"
          value={sort}
          options={sortOptions}
          onChange={(event) => onSortChange(event.target.value)}
        />
      </div>

      <div className="sm:w-32">
        <Select
          id="list-page-size"
          label="Per page"
          value={String(pageSize)}
          options={pageSizeOptions.map((size) => ({ value: String(size), label: String(size) }))}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:pb-2">
        <p className="text-xs tabular-nums text-text-muted" aria-live="polite">
          {filteredCount} of {total} shown
        </p>
        {selectionCount > 0 && bulkActions}
      </div>
    </div>
  );
}
