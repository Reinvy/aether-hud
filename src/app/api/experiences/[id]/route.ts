import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[EXPERIENCES_DELETE]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
