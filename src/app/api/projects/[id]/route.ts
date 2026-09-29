import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CACHE_HEADERS,
  fail,
  failNoDb,
  ok,
  requireSession,
  revalidateContent,
} from "@/lib/api-helpers";
import { getProject, hasDatabase } from "@/lib/portfolio-repo";

/** Single-domain dossier — consumed by the public /projects/[id] page. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const project = await getProject(id);
    if (!project) {
      return fail("Project not found", "PROJECTS_GET_ONE", 404);
    }
    return ok(project, { headers: CACHE_HEADERS });
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
    revalidateContent();
    return ok({ success: true });
  } catch (error) {
    // P2025 is Prisma's "record to delete does not exist" — a 404, not a 500.
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return fail("Not found", "CODEX_API:DELETE_PROJECT", 404);
    }
    console.error("[CODEX_API:DELETE_PROJECT]", error);
    return fail("Failed to delete project", "CODEX_API:DELETE_PROJECT");
  }
}
