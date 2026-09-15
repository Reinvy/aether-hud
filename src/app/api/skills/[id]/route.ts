import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { hasDatabase } from "@/lib/portfolio-repo";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SKILLS_DELETE");

  const { id } = await params;
  try {
    await prisma.skill.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return fail("Skill not found", "SKILLS_DELETE", 404);
  }
}
