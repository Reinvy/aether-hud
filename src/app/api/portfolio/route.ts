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

    if (section && SECTION_KEYS.includes(section as (typeof SECTION_KEYS)[number])) {
      const key = section as (typeof SECTION_KEYS)[number];
      let data = portfolioData[key];

      // Search filter applies to projects (title/tags/category match)
      if (key === "projects" && search) {
        data = (data as typeof portfolioData.projects).filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search) ||
            p.tags.some((t) => t.toLowerCase().includes(search))
        );
      }

      return NextResponse.json({ [key]: data }, { headers: CACHE_HEADERS });
    }

    // Full portfolio — optionally narrow projects via search
    if (search) {
      return NextResponse.json(
        { ...portfolioData, projects: portfolioData.projects.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search) ||
            p.tags.some((t) => t.toLowerCase().includes(search))
        ) },
        { headers: CACHE_HEADERS }
      );
    }

    return NextResponse.json(portfolioData, { headers: CACHE_HEADERS });
  } catch (e) {
    console.error("[PORTFOLIO_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}
