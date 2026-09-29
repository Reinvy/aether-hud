import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionToken,
  isAuthConfigured,
  verifySessionToken,
} from "@/lib/session";

// node:crypto (HMAC) and response cookie mutation require the Node runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: SESSION_TTL_MS / 1000,
} as const;

/**
 * Constant-time password comparison. Both sides are hashed to a fixed 32 bytes
 * first, so the comparison leaks neither the length nor a byte-by-byte prefix
 * of the secret, and `timingSafeEqual` can never throw on a length mismatch.
 */
function passwordMatches(provided: string, expected: string): boolean {
  const providedDigest = createHash("sha256").update(provided).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(providedDigest, expectedDigest);
}

export async function POST(req: NextRequest) {
  try {
    // Fail closed — no hardcoded fallback. If the secret is not configured,
    // the dashboard must not be accessible with a known default password.
    if (!isAuthConfigured()) {
      return NextResponse.json({ success: false, error: "Server not configured" }, { status: 503 });
    }

    const { password } = await req.json();

    if (typeof password !== "string" || !passwordMatches(password, process.env.DASHBOARD_SECRET ?? "")) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, createSessionToken(), COOKIE_OPTIONS);
    return response;
  } catch (e) {
    console.error("[AUTH_POST]", e instanceof Error ? e.message : e);
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}

/** Session probe used by the dashboard shell on mount. */
export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      authenticated: verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value),
    });
  } catch (e) {
    console.error("[AUTH_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { authenticated: false, error: "Session check failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
    return response;
  } catch (e) {
    console.error("[AUTH_DELETE]", e instanceof Error ? e.message : e);
    return NextResponse.json({ success: false, error: "Sign-out failed" }, { status: 500 });
  }
}
