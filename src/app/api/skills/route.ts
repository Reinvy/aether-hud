import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSkill } from "@/lib/api-validation";
import { skillToDto } from "@/lib/dto";
import {
  CACHE_HEADERS,
  fail,
  failNoDb,
  failValidation,
  ok,
  requireSession,
  revalidateContent,
} from "@/lib/api-helpers";
import { getSkills, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getSkills("console"), { headers: CACHE_HEADERS });
  } catch {
    return fail("Failed to fetch skills", "SKILLS_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SKILLS_POST");

  const parsed = parseSkill(await req.json().catch(() => null), "create");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "SKILLS_POST");
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const last = await tx.skill.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return tx.skill.create({
        data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
      });
    });
    revalidateContent();
    return ok(skillToDto(created), { status: 201 });
  } catch {
    return fail("Failed to create skill", "SKILLS_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("SKILLS_PUT");

  const raw: unknown = await req.json().catch(() => null);
  const id = raw !== null && typeof raw === "object" && "id" in raw ? raw.id : undefined;
  if (typeof id !== "string" || id.length === 0) {
    return fail("Missing id", "SKILLS_PUT", 400);
  }

  const parsed = parseSkill(raw, "update");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "SKILLS_PUT");
  }

  try {
    const updated = await prisma.skill.update({ where: { id }, data: parsed.data });
    revalidateContent();
    return ok(skillToDto(updated));
  } catch {
    return fail("Failed to update skill", "SKILLS_PUT");
  }
}
