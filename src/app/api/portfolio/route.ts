import { NextResponse } from "next/server";
import { portfolioData } from "../../../data/portfolio";
import type { Project } from "../../../lib/constants";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" };

const SECTION_KEYS = ["projects", "skills", "socials"] as const;

type ProjectFilter = {
  search?: string;
  category?: string;
  tags?: string[];
  complexity?: string;
  sort?: string;
  limit?: number;
};

function filterProjects(projects: Project[], f: ProjectFilter): Project[] {
  let data = projects;

  if (f.search) {
    data = data.filter(
      (p) =>
        p.title.toLowerCase().includes(f.search!) ||
        p.category.toLowerCase().includes(f.search!) ||
        p.tags.some((t) => t.toLowerCase().includes(f.search!))
    );
  }

  if (f.category) {
    data = data.filter((p) => p.category.toLowerCase().includes(f.category!));
  }

  if (f.tags && f.tags.length > 0) {
    data = data.filter((p) =>
      f.tags!.some((t) => p.tags.some((tag) => tag.toLowerCase() === t))
    );
  }

  if (f.complexity) {
    data = data.filter((p) => p.complexity.toLowerCase() === f.complexity!);
  }

  if (f.sort) {
    switch (f.sort) {
      case "title":
        data = [...data].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "performance":
        data = [...data].sort(
          (a, b) =>
            parseInt(b.performance.replace("%", ""), 10) -
            parseInt(a.performance.replace("%", ""), 10)
        );
        break;
      case "year":
      default:
        data = [...data].sort((a, b) => b.year.localeCompare(a.year));
        break;
    }
  }

  if (f.limit && f.limit > 0) {
    data = data.slice(0, f.limit);
  }

  return data;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const category = searchParams.get("category")?.toLowerCase().trim();
    const tagsRaw = searchParams.get("tags");
    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      : undefined;
    const complexity = searchParams.get("complexity")?.toLowerCase().trim();
    const sort = searchParams.get("sort")?.toLowerCase().trim();
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // Summary endpoint: aggregate counts + derived stats (used by dashboards/widgets)
    if (section === "summary") {
      const avgSkillLevel = Math.round(
        portfolioData.skills.reduce((sum, s) => sum + s.level, 0) / portfolioData.skills.length
      );
      const categories = Array.from(new Set(portfolioData.projects.map((p) => p.category)));
      const complexityClasses = Array.from(
        new Set(portfolioData.projects.map((p) => p.complexity))
      ).sort();
      return NextResponse.json(
        {
          projectCount: portfolioData.projects.length,
          skillCount: portfolioData.skills.length,
          socialCount: portfolioData.socials.length,
          avgSkillLevel,
          categories,
          complexityClasses,
        },
        { headers: CACHE_HEADERS }
      );
    }

    if (section && SECTION_KEYS.includes(section as (typeof SECTION_KEYS)[number])) {
      const key = section as (typeof SECTION_KEYS)[number];
      let data = portfolioData[key];

      if (key === "projects") {
        data = filterProjects(data as Project[], {
          search,
          category,
          tags,
          complexity,
          sort,
          limit: limit && !Number.isNaN(limit) ? limit : undefined,
        });
      }

      return NextResponse.json({ [key]: data }, { headers: CACHE_HEADERS });
    }

    // Full portfolio — optionally narrow projects via search/category/tags/complexity/sort/limit
    const hasProjectFilters =
      Boolean(search) ||
      Boolean(category) ||
      Boolean(tags && tags.length > 0) ||
      Boolean(complexity) ||
      Boolean(sort) ||
      Boolean(limitParam);

    let projects = portfolioData.projects;
    if (hasProjectFilters) {
      projects = filterProjects(projects, {
        search,
        category,
        tags,
        complexity,
        sort,
        limit: limit && !Number.isNaN(limit) ? limit : undefined,
      });
      return NextResponse.json({ ...portfolioData, projects }, { headers: CACHE_HEADERS });
    }

    return NextResponse.json(portfolioData, { headers: CACHE_HEADERS });
  } catch (e) {
    console.error("[PORTFOLIO_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}
