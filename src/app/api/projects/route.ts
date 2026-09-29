import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseProject } from "@/lib/api-validation";
import { projectToDto } from "@/lib/dto";
import {
  CACHE_HEADERS,
  fail,
  failNoDb,
  failValidation,
  ok,
  requireSession,
  revalidateContent,
  serializeTags,
} from "@/lib/api-helpers";
import { getProjects, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getProjects("console"), { headers: CACHE_HEADERS });
  } catch {
    return fail("Failed to fetch projects", "PROJECTS_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("PROJECTS_POST");

  const parsed = parseProject(await req.json().catch(() => null), "create");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "PROJECTS_POST");
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const last = await tx.project.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return tx.project.create({
        data: {
          ...parsed.data,
          tags: serializeTags(parsed.data.tags),
          order: (last?.order ?? -1) + 1,
        },
      });
    });
    revalidateContent();
    return ok(projectToDto(created), { status: 201 });
  } catch {
    return fail("Failed to create project", "PROJECTS_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("PROJECTS_PUT");

  const raw: unknown = await req.json().catch(() => null);
  const id = raw !== null && typeof raw === "object" && "id" in raw ? raw.id : undefined;
  if (typeof id !== "string" || id.length === 0) {
    return fail("Missing id", "PROJECTS_PUT", 400);
  }

  const parsed = parseProject(raw, "update");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "PROJECTS_PUT");
  }

  // Partial updates are the norm (the reorder flow only sends `{ id, order }`),
  // so `tags` is serialized only when the caller actually supplied it —
  // otherwise a missing field would blank the stored JSON array.
  const { tags, ...patch } = parsed.data;
  try {
    const updated = await prisma.project.update({
      where: { id },
      data: tags === undefined ? patch : { ...patch, tags: serializeTags(tags) },
    });
    revalidateContent();
    return ok(projectToDto(updated));
  } catch {
    return fail("Failed to update project", "PROJECTS_PUT");
  }
}
