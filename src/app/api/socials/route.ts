import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSocialLink } from "@/lib/api-validation";
import { socialToDto } from "@/lib/dto";
import {
  CACHE_HEADERS,
  fail,
  failNoDb,
  failValidation,
  ok,
  requireSession,
  revalidateContent,
} from "@/lib/api-helpers";
import { getSocials, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getSocials("console"), { headers: CACHE_HEADERS });
  } catch {
    return fail("Failed to fetch social links", "SOCIALS_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SOCIALS_POST");

  const parsed = parseSocialLink(await req.json().catch(() => null), "create");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "SOCIALS_POST");
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const last = await tx.socialLink.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return tx.socialLink.create({
        data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
      });
    });
    revalidateContent();
    return ok(socialToDto(created), { status: 201 });
  } catch {
    return fail("Failed to create social link", "SOCIALS_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SOCIALS_PUT");

  const raw: unknown = await req.json().catch(() => null);
  const id = raw !== null && typeof raw === "object" && "id" in raw ? raw.id : undefined;
  if (typeof id !== "string" || id.length === 0) {
    return fail("Missing id", "SOCIALS_PUT", 400);
  }

  const parsed = parseSocialLink(raw, "update");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "SOCIALS_PUT");
  }

  try {
    const updated = await prisma.socialLink.update({ where: { id }, data: parsed.data });
    revalidateContent();
    return ok(socialToDto(updated));
  } catch {
    return fail("Failed to update social link", "SOCIALS_PUT");
  }
}
