import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  try {
    // Fail closed — no hardcoded fallback. If the secret is not configured,
    // the dashboard must not be accessible with a known default password.
    if (!isAuthConfigured()) {
      return NextResponse.json({ success: false, error: "Server not configured" }, { status: 503 });
    }

    const { password } = await req.json();

    if (!password || password !== process.env.DASHBOARD_SECRET) {
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
  return NextResponse.json({
    authenticated: verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value),
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
