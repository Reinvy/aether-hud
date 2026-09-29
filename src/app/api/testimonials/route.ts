import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTestimonial } from "@/lib/api-validation";
import { testimonialToDto } from "@/lib/dto";
import {
  CACHE_HEADERS,
  fail,
  failNoDb,
  failValidation,
  ok,
  requireSession,
  revalidateContent,
} from "@/lib/api-helpers";
import { getTestimonials, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getTestimonials("console"), { headers: CACHE_HEADERS });
  } catch {
    return fail("Failed to fetch testimonials", "TESTIMONIALS_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("TESTIMONIALS_POST");

  const parsed = parseTestimonial(await req.json().catch(() => null), "create");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "TESTIMONIALS_POST");
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const last = await tx.testimonial.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return tx.testimonial.create({
        data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
      });
    });
    revalidateContent();
    return ok(testimonialToDto(created), { status: 201 });
  } catch {
    return fail("Failed to create testimonial", "TESTIMONIALS_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("TESTIMONIALS_PUT");

  const raw: unknown = await req.json().catch(() => null);
  const id = raw !== null && typeof raw === "object" && "id" in raw ? raw.id : undefined;
  if (typeof id !== "string" || id.length === 0) {
    return fail("Missing id", "TESTIMONIALS_PUT", 400);
  }

  const parsed = parseTestimonial(raw, "update");
  if ("error" in parsed) {
    return failValidation(parsed.error, parsed.fields, "TESTIMONIALS_PUT");
  }

  try {
    const updated = await prisma.testimonial.update({ where: { id }, data: parsed.data });
    revalidateContent();
    return ok(testimonialToDto(updated));
  } catch {
    return fail("Failed to update testimonial", "TESTIMONIALS_PUT");
  }
}
