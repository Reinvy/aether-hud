import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_SECRET = process.env.DASHBOARD_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Fail closed — no hardcoded fallback. If the secret is not configured,
    // the dashboard must not be accessible with a known default password.
    if (!DASHBOARD_SECRET) {
      return NextResponse.json(
        { success: false, error: "Server not configured" },
        { status: 503 }
      );
    }

    const { password } = await req.json();

    if (!password || password !== DASHBOARD_SECRET) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate simple session token
    const token = Buffer.from(
      JSON.stringify({
        authenticated: true,
        ts: Date.now(),
        role: "admin",
      })
    ).toString("base64");

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
