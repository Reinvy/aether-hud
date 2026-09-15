import { CACHE_HEADERS, fail, ok } from "@/lib/api-helpers";
import { getConfig, getProjects, getSkills, getSocials } from "@/lib/portfolio-repo";
import type { ProjectDto } from "@/lib/dto";

export const dynamic = "force-dynamic";

const SECTION_KEYS = ["projects", "skills", "socials"] as const;

interface ProjectFilter {
  search?: string;
  category?: string;
  tags?: string[];
  complexity?: string;
  year?: string;
  sort?: string;
  limit?: number;
}

function filterProjects(projects: ProjectDto[], f: ProjectFilter): ProjectDto[] {
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
    data = data.filter((p) => p.tags!.some((t) => p.tags.some((tag) => tag.toLowerCase() === t)));
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
      ? tagsRaw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
      : undefined;
    const complexity = searchParams.get("complexity")?.toLowerCase().trim();
    const year = searchParams.get("year")?.trim();
    const sort = searchParams.get("sort")?.toLowerCase().trim();
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const [config, projects, skills, socials] = await Promise.all([
      getConfig(),
      getProjects(),
      getSkills(),
      getSocials(),
    ]);

    const data = {
      name: config.name,
      tagline: config.tagline,
      bio: config.bio,
      avatar: config.avatar,
      projects,
      skills,
      socials,
    };

    // Summary endpoint: aggregate counts + derived stats (used by dashboard widgets)
    if (section === "summary") {
      const avgSkillLevel =
        data.skills.length > 0
          ? Math.round(data.skills.reduce((sum, s) => sum + s.level, 0) / data.skills.length)
          : 0;
      const categories = Array.from(new Set(data.projects.map((p) => p.category)));
      const complexityClasses = Array.from(new Set(data.projects.map((p) => p.complexity))).sort();
      const projectCountByCategory = data.projects.reduce<Record<string, number>>((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});
      const avgPerformance =
        data.projects.length > 0
          ? Math.round(
              data.projects.reduce(
                (sum, p) => sum + parseInt(p.performance.replace("%", "") || "0", 10),
                0
              ) / data.projects.length
            )
          : 0;
      const skillCountByCategory = data.skills.reduce<Record<string, number>>((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + 1;
        return acc;
      }, {});

      return ok(
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

      if (key === "projects") {
        return ok(
          {
            projects: filterProjects(data.projects, {
              search,
              category,
              tags,
              complexity,
              year,
              sort,
              limit: limit && !Number.isNaN(limit) ? limit : undefined,
            }),
          },
          { headers: CACHE_HEADERS }
        );
      }

      if (key === "skills" && sort) {
        const sorted =
          sort === "level"
            ? [...data.skills].sort((a, b) => b.level - a.level)
            : [...data.skills].sort((a, b) => a.name.localeCompare(b.name));
        return ok({ skills: sorted }, { headers: CACHE_HEADERS });
      }

      return ok({ [key]: data[key] }, { headers: CACHE_HEADERS });
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

    if (hasProjectFilters) {
      return ok(
        {
          ...data,
          projects: filterProjects(data.projects, {
            search,
            category,
            tags,
            complexity,
            year,
            sort,
            limit: limit && !Number.isNaN(limit) ? limit : undefined,
          }),
        },
        { headers: CACHE_HEADERS }
      );
    }

    return ok(data, { headers: CACHE_HEADERS });
  } catch (e) {
    return fail(
      e instanceof Error ? e.message : "Failed to fetch portfolio data",
      "PORTFOLIO_GET"
    );
  }
}
