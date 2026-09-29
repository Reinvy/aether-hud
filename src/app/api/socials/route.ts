import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { getSocials, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getSocials());
  } catch {
    return fail("Failed to fetch social links", "SOCIALS_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SOCIALS_POST");

  try {
    const body = await req.json();
    const item = await prisma.socialLink.create({ data: body });
    return ok(item, { status: 201 });
  } catch {
    return fail("Failed to create social link", "SOCIALS_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SOCIALS_PUT");

  try {
    const body = await req.json();
    const { id, ...data } = body;
    const item = await prisma.socialLink.update({ where: { id }, data });
    return ok(item);
  } catch {
    return fail("Failed to update social link", "SOCIALS_PUT");
  }
}
