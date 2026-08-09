import { prisma } from "@/lib/prisma";
import { ok, fail, CACHE_HEADERS } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// The homepage fetches /api/sections on every visit; the section config
// only changes through the dashboard, so a short CDN TTL (same values as
// /api/dashboard/stats) cuts DB load without visible staleness.
// CACHE_HEADERS comes from @/lib/api-helpers (public s-maxage=300).

export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { order: "asc" },
    });
    return ok(sections, { headers: CACHE_HEADERS });
  } catch {
    return fail("Failed to fetch sections", "SECTIONS_GET");
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, subtitle, enabled, order } = body;

    if (!id) {
      return fail("Missing required field: id", "SECTIONS_PUT", 400);
    }

    const updated = await prisma.section.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(enabled !== undefined && { enabled }),
        ...(order !== undefined && { order }),
      },
    });

    return ok(updated);
  } catch {
    return fail("Failed to update section", "SECTIONS_PUT");
  }
}
