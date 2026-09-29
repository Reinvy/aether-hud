import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { getProject, hasDatabase } from "@/lib/portfolio-repo";

/** Single-domain dossier — consumed by the public /projects/[id] page. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const project = await getProject(id);
    if (!project) {
      return fail("Project not found", "PROJECTS_GET_ONE", 404);
    }
    return ok(project);
  } catch {
    return fail("Failed to fetch project", "PROJECTS_GET_ONE");
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("PROJECTS_DELETE");

  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return fail("Project not found", "PROJECTS_DELETE", 404);
  }
}
