import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(projects);
  } catch (e) {
    console.error("[PROJECTS_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const project = await prisma.project.create({
      data: { ...body, tags: typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || []) },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (e) {
    console.error("[PROJECTS_POST]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const project = await prisma.project.update({
      where: { id },
      data: { ...data, tags: typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags || []) },
    });
    return NextResponse.json(project);
  } catch (e) {
    console.error("[PROJECTS_PUT]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
