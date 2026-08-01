import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (e) {
    console.error("[TESTIMONIALS_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.testimonial.create({ data: body });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error("[TESTIMONIALS_POST]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const item = await prisma.testimonial.update({ where: { id }, data });
    return NextResponse.json(item);
  } catch (e) {
    console.error("[TESTIMONIALS_PUT]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}
