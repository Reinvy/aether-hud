import { prisma } from "@/lib/prisma";
import { portfolioData } from "@/data/portfolio";
import { SECTION_FALLBACKS } from "@/data/sections";
import { APP_DESCRIPTION, APP_NAME, PORTFOLIO_CONFIG } from "@/lib/constants";
import {
  experienceToDto,
  fallbackProjectToDto,
  projectToDto,
  sectionToDto,
  skillToDto,
  socialToDto,
  testimonialToDto,
  type ConfigDto,
  type ExperienceDto,
  type ProjectDto,
  type SectionDto,
  type SkillDto,
  type SocialDto,
  type StatsDto,
  type TestimonialDto,
} from "@/lib/dto";

/**
 * portfolio-repo — the only module that reads portfolio content from Prisma.
 *
 * Dual-engine resilience (AGENTS.md §4.4): when `DATABASE_URL` is absent the
 * codex runs on the authored dataset in `src/data/portfolio.ts` and every
 * accessor returns it without ever opening a connection. When the URL exists
 * but PostgreSQL is unreachable, the query throws, is logged with a tagged
 * warning and the same fallback is served — public pages and the console stay
 * online either way, and `StatsDto.source` reports which engine answered.
 *
 * Two read modes:
 *  - `"public"` (default) — the landing page, the JSON API and the sitemap.
 *    An EMPTY table means "nothing has been published yet", so the authored
 *    archive is served.
 *  - `"console"` — the dashboard. An empty table means the operator emptied it,
 *    and the console must show exactly that. Serving the authored archive there
 *    resurrected every deleted row in the UI, and the next delete then 404ed
 *    because the row the operator clicked no longer existed.
 */

export type ReadMode = "public" | "console";

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function warn(name: string, error: unknown): void {
  console.warn(`[CODEX_REPO:${name}]`, error instanceof Error ? error.message : error);
}

function fallbackProjects(): ProjectDto[] {
  return portfolioData.projects.map(fallbackProjectToDto);
}

function fallbackSkills(): SkillDto[] {
  return portfolioData.skills.map((s, order) => ({ ...s, order }));
}

function fallbackSocials(): SocialDto[] {
  return portfolioData.socials.map((s, order) => ({ ...s, order }));
}

function fallbackConfig(): ConfigDto {
  return {
    id: "main",
    name: PORTFOLIO_CONFIG.name,
    tagline: PORTFOLIO_CONFIG.tagline,
    bio: portfolioData.bio,
    email: PORTFOLIO_CONFIG.email,
    location: PORTFOLIO_CONFIG.location,
    avatar: portfolioData.avatar,
    status: PORTFOLIO_CONFIG.status,
    edition: PORTFOLIO_CONFIG.edition,
    siteName: APP_NAME,
    siteDescription: APP_DESCRIPTION,
    animationsEnabled: true,
  };
}

/**
 * A list read either returns the database rows, the authored archive (public
 * mode only) or the empty list the console asked to see. `rows.length === 0`
 * is the only branch the two modes disagree on.
 */
function resolveList<T>(rows: T[], fallback: T[], mode: ReadMode): T[] {
  if (rows.length > 0) return rows;
  return mode === "console" ? [] : fallback;
}

export async function getSections(mode: ReadMode = "public"): Promise<SectionDto[]> {
  const fallback = SECTION_FALLBACKS;
  if (!hasDatabase()) return fallback;
  try {
    const rows = await prisma.section.findMany({ orderBy: { order: "asc" } });
    return resolveList(rows.map(sectionToDto), fallback, mode);
  } catch (e) {
    warn("SECTIONS", e);
    return mode === "console" ? [] : fallback;
  }
}

export async function getConfig(): Promise<ConfigDto> {
  if (!hasDatabase()) return fallbackConfig();
  try {
    const row = await prisma.portfolioConfig.findUnique({ where: { id: "main" } });
    if (!row) return fallbackConfig();
    return {
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      bio: row.bio,
      email: row.email,
      location: row.location,
      avatar: row.avatar,
      status: row.status,
      edition: row.edition,
      siteName: row.siteName,
      siteDescription: row.siteDescription,
      animationsEnabled: row.animationsEnabled,
    };
  } catch (e) {
    warn("CONFIG", e);
    return fallbackConfig();
  }
}

export async function getProjects(mode: ReadMode = "public"): Promise<ProjectDto[]> {
  const fallback = fallbackProjects();
  if (!hasDatabase()) return fallback;
  try {
    const rows = await prisma.project.findMany({ orderBy: { order: "asc" } });
    return resolveList(rows.map(projectToDto), fallback, mode);
  } catch (e) {
    warn("PROJECTS", e);
    return mode === "console" ? [] : fallback;
  }
}

export async function getProject(id: string): Promise<ProjectDto | null> {
  if (!hasDatabase()) {
    return fallbackProjects().find((p) => p.id === id) ?? null;
  }
  try {
    const row = await prisma.project.findUnique({ where: { id } });
    if (row) return projectToDto(row);
    // The row is absent — the id may still belong to the static archive.
    return fallbackProjects().find((p) => p.id === id) ?? null;
  } catch (e) {
    warn("PROJECT", e);
    return fallbackProjects().find((p) => p.id === id) ?? null;
  }
}

export async function getSkills(mode: ReadMode = "public"): Promise<SkillDto[]> {
  const fallback = fallbackSkills();
  if (!hasDatabase()) return fallback;
  try {
    const rows = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    return resolveList(rows.map(skillToDto), fallback, mode);
  } catch (e) {
    warn("SKILLS", e);
    return mode === "console" ? [] : fallback;
  }
}

export async function getSocials(mode: ReadMode = "public"): Promise<SocialDto[]> {
  const fallback = fallbackSocials();
  if (!hasDatabase()) return fallback;
  try {
    const rows = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    return resolveList(rows.map(socialToDto), fallback, mode);
  } catch (e) {
    warn("SOCIALS", e);
    return mode === "console" ? [] : fallback;
  }
}

export async function getExperiences(mode: ReadMode = "public"): Promise<ExperienceDto[]> {
  const fallback = portfolioData.experiences;
  if (!hasDatabase()) return fallback;
  try {
    const rows = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    return resolveList(rows.map(experienceToDto), fallback, mode);
  } catch (e) {
    warn("EXPERIENCES", e);
    return mode === "console" ? [] : fallback;
  }
}

export async function getTestimonials(mode: ReadMode = "public"): Promise<TestimonialDto[]> {
  const fallback = portfolioData.testimonials;
  if (!hasDatabase()) return fallback;
  try {
    const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
    return resolveList(rows.map(testimonialToDto), fallback, mode);
  } catch (e) {
    warn("TESTIMONIALS", e);
    return mode === "console" ? [] : fallback;
  }
}

/**
 * Console statistics. The counts are read from the SAME mode the console is
 * showing, so a "0 domains" list and a "12 domains" stat card can never appear
 * on the same screen.
 */
export async function getStats(): Promise<StatsDto> {
  const [projects, skills, experiences, testimonials] = await Promise.all([
    getProjects("console"),
    getSkills("console"),
    getExperiences("console"),
    getTestimonials("console"),
  ]);
  const levels = skills.map((s) => s.level);
  let source: StatsDto["source"] = "data-file-fallback";
  if (hasDatabase()) {
    try {
      await prisma.project.count();
      source = "database";
    } catch (e) {
      warn("STATS", e);
    }
  }
  return {
    projectCount: projects.length,
    skillCount: skills.length,
    experienceCount: experiences.length,
    testimonialCount: testimonials.length,
    avgSkillLevel:
      levels.length > 0
        ? Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length)
        : 0,
    source,
  };
}
