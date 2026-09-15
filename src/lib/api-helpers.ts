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

import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isAuthConfigured, verifySessionToken } from "@/lib/session";

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

/**
 * Shorter preset for endpoints whose payload is expected to move while an
 * operator watches it (the dashboard activity stream).
 */
export const LIVE_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
} as const;

/**
 * Serialize a tags field for Prisma string columns. Accepts a JSON string
 * (already-serialized payload), an array, or undefined → always returns a
 * string so the DB column never receives a non-string value.
 */
export function serializeTags(tags: unknown): string {
  return typeof tags === "string" ? tags : JSON.stringify(tags ?? []);
}

/**
 * Guard for mutating endpoints while the codex runs without a database.
 *
 * Writes are impossible in static-data mode, so the handler must refuse with
 * an explicit 503 instead of attempting a Prisma call that would surface as a
 * generic 500. Every write handler calls this before touching the client.
 */
export function failNoDb(tag: string) {
  console.warn(`[${tag}] rejected — DATABASE_URL is not configured`);
  return NextResponse.json(
    { error: "Database unavailable — this action is disabled while the codex runs on static data" },
    { status: 503 }
  );
}

/**
 * Fail-closed session guard for mutating endpoints.
 *
 * Returns a response to short-circuit with, or `null` when the request carries
 * a valid session cookie. `DASHBOARD_SECRET` unset → 503 (the dashboard is
 * never reachable with a default password); missing/invalid/expired cookie →
 * 401. `/api/contact` and `/api/telemetry` stay public by design.
 */
export function requireSession(req: NextRequest): NextResponse | null {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  }
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
