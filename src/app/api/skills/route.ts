import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    return ok(items);
  } catch {
    return fail("Failed to fetch skills", "SKILLS_GET");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.skill.create({ data: body });
    return ok(item, { status: 201 });
  } catch {
    return fail("Failed to create skill", "SKILLS_POST");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const item = await prisma.skill.update({ where: { id }, data });
    return ok(item);
  } catch {
    return fail("Failed to update skill", "SKILLS_PUT");
  }
}
