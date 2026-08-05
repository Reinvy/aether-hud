import { NextResponse } from "next/server";
import { portfolioData } from "../../../data/portfolio";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" };

const SECTION_KEYS = ["projects", "skills", "socials"] as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const category = searchParams.get("category")?.toLowerCase().trim();
    const limitParam = searchParams.get("limit");

    // Summary endpoint: aggregate counts + derived stats (used by dashboards/widgets)
    if (section === "summary") {
      const avgSkillLevel = Math.round(
        portfolioData.skills.reduce((sum, s) => sum + s.level, 0) / portfolioData.skills.length
      );
      const categories = Array.from(new Set(portfolioData.projects.map((p) => p.category)));
      return NextResponse.json(
        {
          projectCount: portfolioData.projects.length,
          skillCount: portfolioData.skills.length,
          socialCount: portfolioData.socials.length,
          avgSkillLevel,
          categories,
        },
        { headers: CACHE_HEADERS }
      );
    }

    if (section && SECTION_KEYS.includes(section as (typeof SECTION_KEYS)[number])) {
      const key = section as (typeof SECTION_KEYS)[number];
      let data = portfolioData[key];

      // Search filter applies to projects (title/tags/category match)
      if (key === "projects") {
        if (search) {
          data = (data as typeof portfolioData.projects).filter(
            (p) =>
              p.title.toLowerCase().includes(search) ||
              p.category.toLowerCase().includes(search) ||
              p.tags.some((t) => t.toLowerCase().includes(search))
          );
        }
        if (category) {
          data = (data as typeof portfolioData.projects).filter((p) =>
            p.category.toLowerCase().includes(category)
          );
        }
        if (limitParam) {
          const limit = parseInt(limitParam, 10);
          if (!Number.isNaN(limit) && limit > 0) {
            data = (data as typeof portfolioData.projects).slice(0, limit);
          }
        }
      }

      return NextResponse.json({ [key]: data }, { headers: CACHE_HEADERS });
    }

    // Full portfolio — optionally narrow projects via search/category/limit
    let projects = portfolioData.projects;
    if (search) {
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search))
      );
    }
    if (category) {
      projects = projects.filter((p) => p.category.toLowerCase().includes(category));
    }
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!Number.isNaN(limit) && limit > 0) {
        projects = projects.slice(0, limit);
      }
    }

    if (search || category || limitParam) {
      return NextResponse.json(
        { ...portfolioData, projects },
        { headers: CACHE_HEADERS }
      );
    }

    return NextResponse.json(portfolioData, { headers: CACHE_HEADERS });
  } catch (e) {
    console.error("[PORTFOLIO_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}
