import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession, revalidateContent } from "@/lib/api-helpers";
import { hasDatabase } from "@/lib/portfolio-repo";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SECTIONS_DELETE");

  const { id } = await params;
  try {
    await prisma.section.delete({ where: { id } });
    revalidateContent();
    return ok({ success: true });
  } catch (e) {
    // P2025 is Prisma's "record to delete does not exist" — a 404, not a 500.
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2025") {
      return fail("Not found", "SECTIONS_DELETE", 404);
    }
    console.error("[CODEX_API:DELETE_SECTIONS]", e instanceof Error ? e.message : e);
    return fail("Failed to delete section", "CODEX_API:DELETE_SECTIONS");
  }
}
