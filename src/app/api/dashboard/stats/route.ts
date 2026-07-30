import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [projectCount, skillCount, experienceCount, testimonialCount] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.testimonial.count(),
    ]);
    return NextResponse.json({
      projectCount, skillCount, experienceCount, testimonialCount, uptime: "99.9%",
    });
  } catch (e) {
    console.error("[DASHBOARD_STATS_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
