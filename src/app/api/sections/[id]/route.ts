import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { hasDatabase } from "@/lib/portfolio-repo";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SECTIONS_DELETE");

  const { id } = await params;
  try {
    await prisma.section.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return fail("Section not found", "SECTIONS_DELETE", 404);
  }
}
