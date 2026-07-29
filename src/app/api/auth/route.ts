import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_SECRET = process.env.DASHBOARD_SECRET || "aether-admin-2026";

export async function POST(req: NextRequest) {
  try {
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
