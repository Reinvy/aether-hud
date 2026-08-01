import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[PROJECTS_DELETE]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
