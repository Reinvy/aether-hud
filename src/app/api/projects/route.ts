import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession, serializeTags } from "@/lib/api-helpers";
import { getProjects, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getProjects());
  } catch {
    return fail("Failed to fetch projects", "PROJECTS_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("PROJECTS_POST");

  try {
    const body = await req.json();
    const project = await prisma.project.create({
      data: { ...body, tags: serializeTags(body.tags) },
    });
    return ok(project, { status: 201 });
  } catch {
    return fail("Failed to create project", "PROJECTS_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("PROJECTS_PUT");

  try {
    const body = await req.json();
    const { id, tags, ...data } = body;
    // Partial updates are the norm (the reorder flow only sends { id, order }),
    // so `tags` is serialized only when the caller actually supplied it —
    // otherwise a missing field would blank the stored JSON array.
    const project = await prisma.project.update({
      where: { id },
      data: tags === undefined ? data : { ...data, tags: serializeTags(tags) },
    });
    return ok(project);
  } catch {
    return fail("Failed to update project", "PROJECTS_PUT");
  }
}
