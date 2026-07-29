import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.portfolioConfig.findUnique({ where: { id: "main" } });
    return NextResponse.json(config);
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const config = await prisma.portfolioConfig.update({ where: { id: "main" }, data: body });
    return NextResponse.json(config);
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
