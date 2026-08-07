"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "Bad request",
  401: "Unauthorized — authentication required",
  403: "Forbidden — insufficient permissions",
  404: "Resource not found",
  422: "Validation error",
  429: "Rate limit exceeded — please wait",
  500: "Internal server error",
  502: "Gateway error — upstream service unavailable",
  503: "Service unavailable — server is overloaded",
};

/**
 * In-flight request dedup: multiple components mounting simultaneously and
 * fetching the SAME url (e.g. the homepage mounts hud-header + home-content,
 * both fetching /api/sections) share ONE network request instead of N.
 *
 * The first caller starts the fetch; concurrent callers attach to the same
 * promise. When it settles (success or failure) the entry is evicted so the
 * next mount/refetch starts a fresh request — no stale caching, just
 * request coalescing. This cuts duplicate homepage fetches (e.g. 3×
 * /api/sections + 3× /api/config → 1× each).
 */
const inflight = new Map<string, Promise<Response>>();

function dedupFetch(url: string, init?: RequestInit): Promise<Response> {
  const existing = inflight.get(url);
  if (existing) return existing;

  const promise = fetch(url, init).finally(() => {
    // Evict only our own entry — a later refetch may have replaced it.
    if (inflight.get(url) === promise) inflight.delete(url);
  });
  inflight.set(url, promise);
  return promise;
}

/**
 * Generic data fetching hook with in-flight request deduplication,
 * structured error handling, and refetch capability.
 */
export function useData<T>(url: string): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref counter to prevent stale state updates
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;

    try {
      setLoading(true);
      setError(null);

      // Shared request — aborts are intentionally NOT supported here:
      // cancelling one subscriber's wait must not kill the request other
      // components are still awaiting. Stale responses are dropped by the
      // fetchId guard below instead.
      const res = await dedupFetch(url, {
        headers: { Accept: "application/json" },
      });

      // Ignore stale responses
      if (fetchId !== fetchIdRef.current) return;

      if (!res.ok) {
        const statusMessage =
          HTTP_ERROR_MESSAGES[res.status] ||
          `HTTP ${res.status} — ${res.statusText || "Unknown error"}`;
        throw new Error(statusMessage);
      }

      const result: T = await res.json();

      // Guard against stale responses
      if (fetchId !== fetchIdRef.current) return;

      setData(result);
      setError(null);
    } catch (e: unknown) {
      // Ignore stale responses
      if (fetchId !== fetchIdRef.current) return;

      const message =
        e instanceof Error ? e.message : "An unexpected error occurred";
      setError(message);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    fetchData();

    return () => {
      // Bump the ref so a late response can't setState on an unmounted
      // component. The shared network request itself keeps running for
      // any remaining subscribers.
      fetchIdRef.current += 1;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
