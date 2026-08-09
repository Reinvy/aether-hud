import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    return ok(items);
  } catch {
    return fail("Failed to fetch social links", "SOCIALS_GET");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.socialLink.create({ data: body });
    return ok(item, { status: 201 });
  } catch {
    return fail("Failed to create social link", "SOCIALS_POST");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const item = await prisma.socialLink.update({ where: { id }, data });
    return ok(item);
  } catch {
    return fail("Failed to update social link", "SOCIALS_PUT");
  }
}
