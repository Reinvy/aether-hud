/**
 * api-helpers — shared response/error builders for API routes.
 *
 * Every route in src/app/api/* previously hand-rolled the same
 * try/catch → NextResponse.json({ error }) → console.error("[TAG]", …)
 * boilerplate. These helpers preserve the exact wire contract:
 *   - success: 200/201 with the payload (optionally custom headers)
 *   - failure: { error: string } with 500 (or custom status)
 * and keep the tagged console.error pattern used across all routes.
 */

import { NextResponse } from "next/server";

/** 200/201 JSON success response, optionally with extra headers. */
export function ok<T>(
  data: T,
  init?: { status?: number; headers?: Record<string, string> }
) {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: init?.headers,
  });
}

/**
 * JSON error response + tagged server log. Mirrors the old per-route
 * `console.error("[TAG]", …)` + `NextResponse.json({ error }, { status })`.
 */
export function fail(
  message: string,
  tag: string,
  status = 500
) {
  console.error(`[${tag}]`, message);
  return NextResponse.json({ error: message }, { status });
}

/** Cache-Control header preset for CDN-friendly GET list endpoints. */
export const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
} as const;

/** Cache-Control header for live operational data (never cached). */
export const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
} as const;
