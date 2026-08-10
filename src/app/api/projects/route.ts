import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, serializeTags } from "@/lib/api-helpers";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    return ok(projects);
  } catch {
    return fail("Failed to fetch projects", "PROJECTS_GET");
  }
}

export async function POST(req: NextRequest) {
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
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const project = await prisma.project.update({
      where: { id },
      data: { ...data, tags: serializeTags(data.tags) },
    });
    return ok(project);
  } catch {
    return fail("Failed to update project", "PROJECTS_PUT");
  }
}
