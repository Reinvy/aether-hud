import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
