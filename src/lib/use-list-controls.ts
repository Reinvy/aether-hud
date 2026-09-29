"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

interface ListControlsConfig<T> {
  items: T[];
  getId: (item: T) => string;
  /** Fields scanned (case-insensitive substring) by the search box. */
  searchFields: readonly (keyof T)[];
  /** Named comparators; the selected name is the active sort. */
  sorters: Record<string, (a: T, b: T) => number>;
  defaultSort: string;
  defaultPageSize?: number;
}

interface ListControlsResult<T> {
  query: string;
  setQuery: (query: string) => void;
  sort: string;
  setSort: (sort: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageCount: number;
  pageItems: T[];
  /** Unfiltered row count. */
  total: number;
  /** Rows left after the search filter. */
  filteredCount: number;
  selected: Set<string>;
  toggleSelected: (id: string) => void;
  setSelected: (ids: string[]) => void;
  clearSelection: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * useListControls — search, sort, pagination and row selection for the
 * console list views.
 *
 * The search term is deferred so typing stays responsive on long archives,
 * and any change to the query, sort or page size returns to page one — a
 * filter that leaves the operator on page 7 of 2 reads as an empty list.
 */
export function useListControls<T>(config: ListControlsConfig<T>): ListControlsResult<T> {
  const [query, setQueryState] = useState("");
  const [sort, setSortState] = useState(config.defaultSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(config.defaultPageSize ?? DEFAULT_PAGE_SIZE);
  const [selected, setSelectedState] = useState<Set<string>>(new Set());
  const deferredQuery = useDeferredValue(query);

  // Comparators and field lists are typically inline literals; read them
  // through a ref so they never re-trigger the memo.
  const configRef = useRef(config);
  configRef.current = config;

  // Selection follows the list: a deleted row (or one filtered out by a
  // refetch) must not stay selected, or a bulk action would target an id that
  // no longer exists. Returning the previous Set when nothing changed keeps the
  // effect from re-rendering on every parent render.
  useEffect(() => {
    setSelectedState((previous) => {
      if (previous.size === 0) return previous;
      const present = new Set(config.items.map((item) => config.getId(item)));
      const next = new Set<string>();
      for (const id of previous) {
        if (present.has(id)) next.add(id);
      }
      return next.size === previous.size ? previous : next;
    });
  }, [config]);

  const filtered = useMemo(() => {
    const { items, searchFields, sorters } = configRef.current;
    const needle = deferredQuery.trim().toLowerCase();
    const matched = needle
      ? items.filter((item) =>
          searchFields.some((field) =>
            String(item[field] ?? "").toLowerCase().includes(needle)
          )
        )
      : items;
    const comparator = sorters[sort];
    return comparator ? [...matched].sort(comparator) : matched;
  }, [config.items, deferredQuery, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize]
  );

  const setQuery = (next: string) => {
    setQueryState(next);
    setPage(1);
  };

  const setSort = (next: string) => {
    setSortState(next);
    setPage(1);
  };

  const setPageSize = (next: number) => {
    setPageSizeState(next);
    setPage(1);
  };

  const toggleSelected = (id: string) => {
    setSelectedState((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return {
    query,
    setQuery,
    sort,
    setSort,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
    pageItems,
    total: config.items.length,
    filteredCount: filtered.length,
    selected,
    toggleSelected,
    setSelected: (ids: string[]) => setSelectedState(new Set(ids)),
    clearSelection: () => setSelectedState(new Set()),
  };
}
