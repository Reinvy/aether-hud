import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession, revalidateContent } from "@/lib/api-helpers";
import { hasDatabase } from "@/lib/portfolio-repo";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("TESTIMONIALS_DELETE");

  const { id } = await params;
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidateContent();
    return ok({ success: true });
  } catch (error) {
    // P2025 is Prisma's "record to delete does not exist" — a 404, not a 500.
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return fail("Not found", "CODEX_API:DELETE_TESTIMONIAL", 404);
    }
    console.error("[CODEX_API:DELETE_TESTIMONIAL]", error);
    return fail("Failed to delete testimonial", "CODEX_API:DELETE_TESTIMONIAL");
  }
}
