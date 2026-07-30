import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(skills);
  } catch (e) {
    console.error("[SKILLS_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const skill = await prisma.skill.create({ data: body });
    return NextResponse.json(skill, { status: 201 });
  } catch (e) {
    console.error("[SKILLS_POST]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const skill = await prisma.skill.update({ where: { id }, data });
    return NextResponse.json(skill);
  } catch (e) {
    console.error("[SKILLS_PUT]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}
