import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { portfolioData } from "@/data/portfolio";
import type { Project, Skill } from "@/lib/constants";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" };

const SECTION_KEYS = ["projects", "skills", "socials"] as const;

type ProjectFilter = {
  search?: string;
  category?: string;
  tags?: string[];
  complexity?: string;
  year?: string;
  sort?: string;
  limit?: number;
};

function parseTags(tagsStr: string | string[]): string[] {
  if (Array.isArray(tagsStr)) return tagsStr;
  try {
    const parsed = JSON.parse(tagsStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : [];
  }
}

async function getDynamicPortfolio() {
  try {
    const [config, dbProjects, dbSkills, dbSocials] = await Promise.all([
      prisma.portfolioConfig.findUnique({ where: { id: "main" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    ]);

    const projects: Project[] = (dbProjects && dbProjects.length > 0)
      ? dbProjects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          image: p.image,
          tags: parseTags(p.tags),
          category: p.category,
          complexity: p.complexity,
          performance: p.performance,
          year: p.year,
          links: {
            live: p.liveUrl || undefined,
            github: p.githubUrl || undefined,
          },
        }))
      : portfolioData.projects;

    const skills: Skill[] = (dbSkills && dbSkills.length > 0)
      ? dbSkills.map((s) => ({
          id: s.id,
          name: s.name,
          level: s.level,
          category: s.category,
          icon: s.icon,
        }))
      : portfolioData.skills;

    const socials = (dbSocials && dbSocials.length > 0)
      ? dbSocials.map((s) => ({
          platform: s.platform,
          url: s.url,
          icon: s.icon,
        }))
      : portfolioData.socials;

    return {
      name: config?.name || portfolioData.name,
      tagline: config?.tagline || portfolioData.tagline,
      bio: config?.bio || portfolioData.bio,
      avatar: config?.avatar || portfolioData.avatar,
      projects,
      skills,
      socials,
    };
  } catch (err) {
    console.warn("[PORTFOLIO_DB_FALLBACK]", err instanceof Error ? err.message : err);
    return portfolioData;
  }
}

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
    data = data.filter((p) => p.category.toLowerCase() === f.category);
  }

  if (f.tags && f.tags.length > 0) {
    data = data.filter((p) =>
      f.tags!.some((t) => p.tags.some((tag) => tag.toLowerCase() === t))
    );
  }

  if (f.complexity) {
    data = data.filter((p) => p.complexity.toLowerCase() === f.complexity);
  }

  if (f.year) {
    data = data.filter((p) => p.year === f.year);
  }

  if (f.sort) {
    switch (f.sort) {
      case "title":
        data = [...data].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "performance":
        data = [...data].sort(
          (a, b) =>
            parseInt(b.performance.replace("%", "") || "0", 10) -
            parseInt(a.performance.replace("%", "") || "0", 10)
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
    const year = searchParams.get("year")?.trim();
    const sort = searchParams.get("sort")?.toLowerCase().trim();
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const data = await getDynamicPortfolio();

    // Summary endpoint: aggregate counts + derived stats (used by dashboards/widgets)
    if (section === "summary") {
      const avgSkillLevel = data.skills.length > 0
        ? Math.round(data.skills.reduce((sum, s) => sum + s.level, 0) / data.skills.length)
        : 0;
      const categories = Array.from(new Set(data.projects.map((p) => p.category)));
      const complexityClasses = Array.from(
        new Set(data.projects.map((p) => p.complexity))
      ).sort();
      const projectCountByCategory = data.projects.reduce<Record<string, number>>(
        (acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        },
        {}
      );
      const avgPerformance = data.projects.length > 0
        ? Math.round(
            data.projects.reduce(
              (sum, p) => sum + parseInt(p.performance.replace("%", "") || "0", 10),
              0
            ) / data.projects.length
          )
        : 0;
      const skillCountByCategory = data.skills.reduce<Record<string, number>>(
        (acc, s) => {
          acc[s.category] = (acc[s.category] || 0) + 1;
          return acc;
        },
        {}
      );
      return NextResponse.json(
        {
          projectCount: data.projects.length,
          skillCount: data.skills.length,
          socialCount: data.socials.length,
          avgSkillLevel,
          avgPerformance,
          categories,
          complexityClasses,
          projectCountByCategory,
          skillCountByCategory,
        },
        { headers: CACHE_HEADERS }
      );
    }

    if (section && SECTION_KEYS.includes(section as (typeof SECTION_KEYS)[number])) {
      const key = section as (typeof SECTION_KEYS)[number];
      let sectionData = data[key];

      if (key === "projects") {
        sectionData = filterProjects(sectionData as Project[], {
          search,
          category,
          tags,
          complexity,
          year,
          sort,
          limit: limit && !Number.isNaN(limit) ? limit : undefined,
        });
      } else if (key === "skills" && sort) {
        const skills = sectionData as typeof data.skills;
        sectionData =
          sort === "level"
            ? [...skills].sort((a, b) => b.level - a.level)
            : [...skills].sort((a, b) => a.name.localeCompare(b.name));
      }

      return NextResponse.json({ [key]: sectionData }, { headers: CACHE_HEADERS });
    }

    // Full portfolio — optionally narrow projects via search/category/tags/complexity/year/sort/limit
    const hasProjectFilters =
      Boolean(search) ||
      Boolean(category) ||
      Boolean(tags && tags.length > 0) ||
      Boolean(complexity) ||
      Boolean(year) ||
      Boolean(sort) ||
      Boolean(limitParam);

    let projects = data.projects;
    if (hasProjectFilters) {
      projects = filterProjects(projects, {
        search,
        category,
        tags,
        complexity,
        year,
        sort,
        limit: limit && !Number.isNaN(limit) ? limit : undefined,
      });
      return NextResponse.json({ ...data, projects }, { headers: CACHE_HEADERS });
    }

    return NextResponse.json(data, { headers: CACHE_HEADERS });
  } catch (e) {
    console.error("[PORTFOLIO_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}
