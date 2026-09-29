import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactRequestBody = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in your name, email, subject and message." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "That email address does not look right." },
        { status: 400 }
      );
    }

    if (message.length < 5) {
      return NextResponse.json(
        { error: "Please write a slightly longer message." },
        { status: 400 }
      );
    }

    const transmissionId = `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // The summon desk validates and acknowledges; submissions are not persisted
    // (see AGENTS.md §4.3 — this endpoint is intentionally public and stateless).
    return NextResponse.json(
      {
        success: true,
        transmissionId,
        message: "Your message has been received. Expect a reply by email.",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CONTACT_POST]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "The message could not be sent. Please try again." },
      { status: 500 }
    );
  }
}
