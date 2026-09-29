import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseExperience } from "@/lib/api-validation";
import { experienceToDto } from "@/lib/dto";
import {
  CACHE_HEADERS,
  fail,
  failNoDb,
  failValidation,
  ok,
  requireSession,
  revalidateContent,
} from "@/lib/api-helpers";
import { getExperiences, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getExperiences("console"), { headers: CACHE_HEADERS });
  } catch {
    return fail("Failed to fetch experiences", "EXPERIENCES_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("EXPERIENCES_POST");

  const parsed = parseExperience(await req.json().catch(() => null), "create");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "EXPERIENCES_POST");
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const last = await tx.experience.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return tx.experience.create({
        data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
      });
    });
    revalidateContent();
    return ok(experienceToDto(created), { status: 201 });
  } catch {
    return fail("Failed to create experience", "EXPERIENCES_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("EXPERIENCES_PUT");

  const raw: unknown = await req.json().catch(() => null);
  const id = raw !== null && typeof raw === "object" && "id" in raw ? raw.id : undefined;
  if (typeof id !== "string" || id.length === 0) {
    return fail("Missing id", "EXPERIENCES_PUT", 400);
  }

  const parsed = parseExperience(raw, "update");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "EXPERIENCES_PUT");
  }

  try {
    const updated = await prisma.experience.update({ where: { id }, data: parsed.data });
    revalidateContent();
    return ok(experienceToDto(updated));
  } catch {
    return fail("Failed to update experience", "EXPERIENCES_PUT");
  }
}
