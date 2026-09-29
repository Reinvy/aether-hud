import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSections, hasDatabase } from "@/lib/portfolio-repo";
import { CACHE_HEADERS, fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * The homepage reads the section registry on every visit; it only changes
 * through the dashboard, so a short CDN TTL (CACHE_HEADERS) cuts load without
 * visible staleness. Reading always succeeds — the repo serves the static
 * fallback when the codex runs without a database.
 */
export async function GET() {
  try {
    return ok(await getSections(), { headers: CACHE_HEADERS });
  } catch {
    return fail("Failed to fetch sections", "SECTIONS_GET");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SECTIONS_PUT");

  try {
    const body = await req.json();
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

const SECTION_KEY = /^[a-z][a-z0-9-]{1,31}$/;

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SECTIONS_POST");

  try {
    const { key, title, subtitle, enabled } = await req.json();

    if (typeof key !== "string" || !SECTION_KEY.test(key)) {
      return fail(
        "Invalid section key — use 2-32 lowercase letters, digits or dashes",
        "SECTIONS_POST",
        400
      );
    }
    if (typeof title !== "string" || title.trim().length === 0) {
      return fail("Missing required field: title", "SECTIONS_POST", 400);
    }

    const existing = await prisma.section.findUnique({ where: { key } });
    if (existing) {
      return fail("Section key already exists", "SECTIONS_POST", 409);
    }

    const last = await prisma.section.findFirst({ orderBy: { order: "desc" } });
    const created = await prisma.section.create({
      data: {
        key,
        title: title.trim(),
        subtitle: typeof subtitle === "string" && subtitle.trim() ? subtitle.trim() : null,
        enabled: enabled !== false,
        order: (last?.order ?? -1) + 1,
      },
    });

    return ok(created, { status: 201 });
  } catch {
    return fail("Failed to create section", "SECTIONS_POST");
  }
}
