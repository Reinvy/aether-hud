"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { apiGet } from "@/lib/api-client";

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Awaits the real network round trip, so callers can show "refreshing". */
  refetch: () => Promise<void>;
}

/**
 * In-flight request dedup: several components mounting at once and fetching the
 * SAME url (the homepage mounts the header + every section, several of which
 * read `/api/sections` and `/api/config`) share ONE network request instead of N.
 *
 * The map stores the parsed promise, not the `Response` — a `Response` body can
 * only be read once, so a second subscriber used to receive `{}` with no error.
 * The entry is evicted as soon as the promise settles, so a later mount or
 * `refetch()` starts a fresh request (no stale caching, just coalescing).
 */
const inflight = new Map<string, Promise<unknown>>();

function sharedGet<T>(url: string): Promise<T> {
  const existing = inflight.get(url);
  if (existing) return existing as Promise<T>;

  const promise = apiGet<T>(url).finally(() => {
    // Evict only our own entry — a later refetch may have replaced it.
    if (inflight.get(url) === promise) inflight.delete(url);
  });
  inflight.set(url, promise);
  return promise;
}

/**
 * Generic data fetching hook with in-flight deduplication, structured error
 * handling and refetch capability. Reads go through `apiGet`, so a lost session
 * sends the operator to /login exactly like a failed write does.
 */
export function useData<T>(url: string): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref counter to prevent stale state updates
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(async (): Promise<void> => {
    const fetchId = ++fetchIdRef.current;

    setLoading(true);
    setError(null);

    try {
      // Shared request — aborts are intentionally NOT supported here:
      // cancelling one subscriber's wait must not kill the request other
      // components are still awaiting. Stale responses are dropped by the
      // fetchId guard below instead.
      const result = await sharedGet<T>(url);
      if (fetchId !== fetchIdRef.current) return;
      setData(result);
    } catch (e: unknown) {
      if (fetchId !== fetchIdRef.current) return;
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      if (fetchId === fetchIdRef.current) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    void fetchData();

    return () => {
      // Bump the ref so a late response can't setState on an unmounted
      // component. The shared network request itself keeps running for
      // any remaining subscribers.
      fetchIdRef.current += 1;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
