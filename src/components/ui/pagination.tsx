"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Pagination — shared previous/next pager for console lists.
 *
 * Rendered only when a list actually spans more than one page, so short
 * archives keep the single-screen layout they had before.
 */
export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  if (pageCount <= 1) return null;

  const buttonClass =
    "inline-flex items-center gap-1.5 codex-radius-sm border border-leather-caramel/25 dark:border-border-subtle px-3 py-2 text-xs font-semibold text-text-muted transition-colors hover:text-leather-dark dark:hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-40 codex-focus";

  return (
    <nav
      aria-label="Pagination"
      className={cn("mt-6 flex items-center justify-center gap-4", className)}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Previous
      </button>
      <span className="text-xs tabular-nums text-text-muted">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
      >
        Next
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </nav>
  );
}
