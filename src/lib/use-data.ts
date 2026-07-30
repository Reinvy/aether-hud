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
 * Generic data fetching hook with AbortController support,
 * structured error handling, and refetch capability.
 */
export function useData<T>(url: string): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref counter to prevent stale state updates
  const fetchIdRef = useRef(0);
  // AbortController ref for cleanup
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchId = ++fetchIdRef.current;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(url, {
        signal: controller.signal,
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
      // Ignore aborted requests — they're intentional cleanup
      if (e instanceof DOMException && e.name === "AbortError") return;
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
      // Cleanup: abort in-flight request on unmount
      abortRef.current?.abort();
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
