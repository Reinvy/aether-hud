import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (e) {
    console.error("[EXPERIENCES_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.experience.create({ data: body });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error("[EXPERIENCES_POST]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const item = await prisma.experience.update({ where: { id }, data });
    return NextResponse.json(item);
  } catch (e) {
    console.error("[EXPERIENCES_PUT]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}
