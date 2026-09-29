import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { hasDatabase } from "@/lib/portfolio-repo";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("TESTIMONIALS_DELETE");

  const { id } = await params;
  try {
    await prisma.testimonial.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return fail("Testimonial not found", "TESTIMONIALS_DELETE", 404);
  }
}
