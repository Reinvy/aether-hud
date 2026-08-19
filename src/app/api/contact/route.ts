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
        { error: "All transmission fields (NAME, EMAIL, SUBJECT, MESSAGE) are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid transmission address format." },
        { status: 400 }
      );
    }

    if (message.length < 5) {
      return NextResponse.json(
        { error: "Message payload too short for encryption protocol." },
        { status: 400 }
      );
    }

    const transmissionId = `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Return structured transmission verification
    return NextResponse.json(
      {
        success: true,
        transmissionId,
        message: "Encrypted transmission delivered to node buffer.",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CONTACT_POST]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Transmission node failed to process payload." },
      { status: 500 }
    );
  }
}
