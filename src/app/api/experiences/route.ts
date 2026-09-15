import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { getExperiences, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getExperiences());
  } catch {
    return fail("Failed to fetch experiences", "EXPERIENCES_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("EXPERIENCES_POST");

  try {
    const body = await req.json();
    const item = await prisma.experience.create({ data: body });
    return ok(item, { status: 201 });
  } catch {
    return fail("Failed to create experience", "EXPERIENCES_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("EXPERIENCES_PUT");

  try {
    const body = await req.json();
    const { id, ...data } = body;
    const item = await prisma.experience.update({ where: { id }, data });
    return ok(item);
  } catch {
    return fail("Failed to update experience", "EXPERIENCES_PUT");
  }
}
