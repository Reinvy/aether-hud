import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { getSkills, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getSkills());
  } catch {
    return fail("Failed to fetch skills", "SKILLS_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SKILLS_POST");

  try {
    const body = await req.json();
    const item = await prisma.skill.create({ data: body });
    return ok(item, { status: 201 });
  } catch {
    return fail("Failed to create skill", "SKILLS_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SKILLS_PUT");

  try {
    const body = await req.json();
    const { id, ...data } = body;
    const item = await prisma.skill.update({ where: { id }, data });
    return ok(item);
  } catch {
    return fail("Failed to update skill", "SKILLS_PUT");
  }
}
