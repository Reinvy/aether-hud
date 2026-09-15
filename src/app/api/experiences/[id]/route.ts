import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { hasDatabase } from "@/lib/portfolio-repo";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("EXPERIENCES_DELETE");

  const { id } = await params;
  try {
    await prisma.experience.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return fail("Experience not found", "EXPERIENCES_DELETE", 404);
  }
}
