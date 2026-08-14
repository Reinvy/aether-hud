"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * ArchiveSearch — reusable HUD archive search field with deferred filtering.
 *
 * Modularizes the dashboard search pattern (previously inline in the
 * projects view) into one reusable component that scales with archive
 * size:
 *
 * - The input itself is controlled with the RAW query so keystrokes feel
 *   instant (the recessed input never lags).
 * - The parent filters the list on the DEFERRED query
 *   (React 19 useDeferredValue): filtering a large archive happens in the
 *   background, so typing stays responsive even with hundreds of records.
 * - While the deferred value lags the raw keystrokes, a gold "STABILIZING"
 *   HUD indicator pulses beside the input — an explicit micro loading
 *   state instead of a silently stale list.
 * - An optional live record counter renders as a sys-label ("N RECORDS").
 *
 * Design system: input-recessed (via <Input>), sys-label, gold accent —
 * no rounded corners, no neon.
 */
interface ArchiveSearchProps {
  /** Placeholder shown inside the recessed input. */
  placeholder?: string;
  /** Accessible label for the input. */
  ariaLabel?: string;
  /**
   * Called with the DEFERRED query — the parent filters the archive on
   * this value. Keep it referentially stable (useCallback or a state
   * setter) so the internal effect never re-fires on parent re-renders.
   */
  onQueryChange: (query: string) => void;
  /**
   * Called with the RAW query on every keystroke — for immediate UI copy
   * (e.g. empty-state messages) that must not lag behind typing.
   */
  onRawQueryChange?: (query: string) => void;
  /** Optional live record counter rendered as a HUD sys-label. */
  resultCount?: number;
  className?: string;
}

export function ArchiveSearch({
  placeholder = "Search archive...",
  ariaLabel = "Search archive",
  onQueryChange,
  onRawQueryChange,
  resultCount,
  className,
}: ArchiveSearchProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // Push the deferred query up only when it actually changes. The parent
  // must pass a stable onQueryChange (state setter or useCallback) so this
  // effect never re-fires on parent re-renders.
  useEffect(() => {
    onQueryChange(deferredQuery);
  }, [deferredQuery, onQueryChange]);

  const stabilizing = deferredQuery !== query;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative min-w-0 flex-1">
        <Input
          prefix={<Search className="h-4 w-4" />}
          placeholder={placeholder}
          aria-label={ariaLabel}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onRawQueryChange?.(e.target.value);
          }}
        />
        {/* HUD micro loading state — visible while the deferred filter
            catches up with the raw keystrokes. */}
        {stabilizing && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse bg-gold-400" />
            <span className="sys-label text-[8px] text-gold-400/70">
              STABILIZING
            </span>
          </span>
        )}
      </div>
      {typeof resultCount === "number" && (
        <span className="sys-label text-[9px] text-text-muted">
          {resultCount} {resultCount === 1 ? "RECORD" : "RECORDS"}
        </span>
      )}
    </div>
  );
}
