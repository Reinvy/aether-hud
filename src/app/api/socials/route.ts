import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (e) {
    console.error("[SOCIALS_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.socialLink.create({ data: body });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error("[SOCIALS_POST]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to create social link" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const item = await prisma.socialLink.update({ where: { id }, data });
    return NextResponse.json(item);
  } catch (e) {
    console.error("[SOCIALS_PUT]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to update social link" }, { status: 500 });
  }
}
