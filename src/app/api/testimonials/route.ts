import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { getTestimonials, hasDatabase } from "@/lib/portfolio-repo";

export async function GET() {
  try {
    return ok(await getTestimonials());
  } catch {
    return fail("Failed to fetch testimonials", "TESTIMONIALS_GET");
  }
}

export async function POST(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("TESTIMONIALS_POST");

  try {
    const body = await req.json();
    const item = await prisma.testimonial.create({ data: body });
    return ok(item, { status: 201 });
  } catch {
    return fail("Failed to create testimonial", "TESTIMONIALS_POST");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("TESTIMONIALS_PUT");

  try {
    const body = await req.json();
    const { id, ...data } = body;
    const item = await prisma.testimonial.update({ where: { id }, data });
    return ok(item);
  } catch {
    return fail("Failed to update testimonial", "TESTIMONIALS_PUT");
  }
}
