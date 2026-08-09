import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-helpers";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.socialLink.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return fail("Failed to delete social link", "SOCIALS_DELETE");
  }
}
