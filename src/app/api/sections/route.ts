import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSections, hasDatabase } from "@/lib/portfolio-repo";
import {
  CACHE_HEADERS,
  fail,
  failNoDb,
  failValidation,
  ok,
  requireSession,
  revalidateContent,
} from "@/lib/api-helpers";
import { parseSectionCreate, parseSectionPatch } from "@/lib/api-validation";
import { sectionToDto } from "@/lib/dto";

export const dynamic = "force-dynamic";

/**
 * The homepage reads the section registry on every visit; it only changes
 * through the dashboard, so a short CDN TTL (CACHE_HEADERS) cuts load without
 * visible staleness. Reading always succeeds — the repo serves the static
 * fallback when the codex runs without a database.
 */
export async function GET() {
  try {
    return ok(await getSections("console"), { headers: CACHE_HEADERS });
  } catch (e) {
    console.error("[SECTIONS_GET]", e instanceof Error ? e.message : e);
    return fail("Failed to fetch sections", "SECTIONS_GET");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SECTIONS_PUT");

  try {
    const body: unknown = await req.json();
    const id = (body as { id?: unknown } | null)?.id;
    if (typeof id !== "string" || id.length === 0) {
      return failValidation('"id" is required', undefined, "SECTIONS_PUT");
    }

    const parsed = parseSectionPatch(body);
    if ("error" in parsed) {
      return failValidation(parsed.error, parsed.fields, "SECTIONS_PUT");
    }

    const updated = await prisma.section.update({ where: { id }, data: parsed.data });
    revalidateContent();
    return ok(sectionToDto(updated));
  } catch (e) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2025") {
      return fail("Section not found", "SECTIONS_PUT", 404);
    }
    console.error("[SECTIONS_PUT]", e instanceof Error ? e.message : e);
    return fail("Failed to update section", "SECTIONS_PUT");
  }
}

/**
 * Only the six canonical page keys exist: each one maps to a rendered section
 * in `src/app/home-content.tsx`, so an arbitrary key would produce a registry
 * entry nothing can render. Publishing a seventh page needs a renderer first.
 * A deleted canonical page can still be re-created here.
 */
export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SECTIONS_POST");

  try {
    const parsed = parseSectionCreate(await req.json());
    if ("error" in parsed) {
      return failValidation(parsed.error, parsed.fields, "SECTIONS_POST");
    }

    const existing = await prisma.section.findUnique({ where: { key: parsed.data.key } });
    if (existing) {
      return fail("Section key already exists", "SECTIONS_POST", 409);
    }

    const created = await prisma.$transaction(async (tx) => {
      const last = await tx.section.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
      return tx.section.create({
        data: {
          key: parsed.data.key,
          title: parsed.data.title,
          subtitle: parsed.data.subtitle || null,
          enabled: parsed.data.enabled !== false,
          order: (last?.order ?? -1) + 1,
        },
      });
    });

    revalidateContent();
    return ok(sectionToDto(created), { status: 201 });
  } catch (e) {
    console.error("[SECTIONS_POST]", e instanceof Error ? e.message : e);
    return fail("Failed to create section", "SECTIONS_POST");
  }
}
