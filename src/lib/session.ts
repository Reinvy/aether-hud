import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * session.ts — server-verified dashboard sessions.
 *
 * The retired flow stored a base64 `{ authenticated: true }` blob in
 * `sessionStorage`, which any visitor could forge from the console. Sessions
 * are now an HMAC-signed, `httpOnly` cookie: the payload carries the subject
 * and issue time, and the signature is derived from `DASHBOARD_SECRET`, so a
 * cookie is only accepted if this server minted it within the TTL window.
 */

export const SESSION_COOKIE = "aether_codex_session";
export const SESSION_TTL_MS = 86_400_000;

/** Fail closed: no secret means no authenticated surface at all. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.DASHBOARD_SECRET);
}

function sign(payload: string): string {
  return createHmac("sha256", process.env.DASHBOARD_SECRET ?? "")
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: "admin", ts: Date.now() })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !isAuthConfigured()) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const payload = token.slice(0, separator);
  const provided = Buffer.from(token.slice(separator + 1));
  const expected = Buffer.from(sign(payload));
  if (provided.length !== expected.length) return false;
  if (!timingSafeEqual(provided, expected)) return false;

  try {
    const claims: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof claims !== "object" || claims === null) return false;
    const { sub, ts } = claims as { sub?: unknown; ts?: unknown };
    if (sub !== "admin" || typeof ts !== "number") return false;
    const age = Date.now() - ts;
    return age >= 0 && age < SESSION_TTL_MS;
  } catch {
    return false;
  }
}
