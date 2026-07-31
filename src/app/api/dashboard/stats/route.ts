import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { portfolioData } from "@/data/portfolio";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" };

export async function GET() {
  try {
    let stats;
    try {
      const [projectCount, skillCount, experienceCount, testimonialCount] = await Promise.all([
        prisma.project.count(),
        prisma.skill.count(),
        prisma.experience.count(),
        prisma.testimonial.count(),
      ]);
      stats = {
        projectCount,
        skillCount,
        experienceCount,
        testimonialCount,
        uptime: "99.9%",
        source: "database",
      };
    } catch (dbError) {
      // Graceful fallback: derive stats from the content data file so the
      // dashboard stays online even if the database is unreachable.
      console.warn(
        "[DASHBOARD_STATS_GET] DB unavailable, falling back to data file:",
        dbError instanceof Error ? dbError.message : dbError
      );
      const avgLevel = Math.round(
        portfolioData.skills.reduce((sum, s) => sum + s.level, 0) / portfolioData.skills.length
      );
      stats = {
        projectCount: portfolioData.projects.length,
        skillCount: portfolioData.skills.length,
        experienceCount: 0,
        testimonialCount: 0,
        uptime: "99.9%",
        avgSkillLevel: avgLevel,
        source: "data-file-fallback",
      };
    }

    return NextResponse.json(stats, { headers: CACHE_HEADERS });
  } catch (e) {
    console.error("[DASHBOARD_STATS_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
