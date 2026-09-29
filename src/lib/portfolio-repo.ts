import { prisma } from "@/lib/prisma";
import { portfolioData } from "@/data/portfolio";
import { SECTION_FALLBACKS } from "@/data/sections";
import { APP_DESCRIPTION, APP_NAME, PORTFOLIO_CONFIG } from "@/lib/constants";
import {
  fallbackProjectToDto,
  projectToDto,
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
 * warning and the same fallback is served — public pages and the dashboard stay
 * online either way, and `StatsDto.source` reports which engine answered.
 *
 * API route handlers and server components both read through here so the
 * fallback policy lives in exactly one place.
 */

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

export async function getSections(): Promise<SectionDto[]> {
  if (!hasDatabase()) return SECTION_FALLBACKS;
  try {
    const rows = await prisma.section.findMany({ orderBy: { order: "asc" } });
    if (rows.length === 0) return SECTION_FALLBACKS;
    return rows;
  } catch (e) {
    warn("SECTIONS", e);
    return SECTION_FALLBACKS;
  }
}

export async function getConfig(): Promise<ConfigDto> {
  if (!hasDatabase()) return fallbackConfig();
  try {
    const row = await prisma.portfolioConfig.findUnique({ where: { id: "main" } });
    return row ?? fallbackConfig();
  } catch (e) {
    warn("CONFIG", e);
    return fallbackConfig();
  }
}

export async function getProjects(): Promise<ProjectDto[]> {
  if (!hasDatabase()) return fallbackProjects();
  try {
    const rows = await prisma.project.findMany({ orderBy: { order: "asc" } });
    return rows.length > 0 ? rows.map(projectToDto) : fallbackProjects();
  } catch (e) {
    warn("PROJECTS", e);
    return fallbackProjects();
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

export async function getSkills(): Promise<SkillDto[]> {
  if (!hasDatabase()) return fallbackSkills();
  try {
    const rows = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    return rows.length > 0 ? rows : fallbackSkills();
  } catch (e) {
    warn("SKILLS", e);
    return fallbackSkills();
  }
}

export async function getSocials(): Promise<SocialDto[]> {
  if (!hasDatabase()) return fallbackSocials();
  try {
    const rows = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    return rows.length > 0 ? rows : fallbackSocials();
  } catch (e) {
    warn("SOCIALS", e);
    return fallbackSocials();
  }
}

export async function getExperiences(): Promise<ExperienceDto[]> {
  if (!hasDatabase()) return portfolioData.experiences;
  try {
    const rows = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    return rows.length > 0 ? rows : portfolioData.experiences;
  } catch (e) {
    warn("EXPERIENCES", e);
    return portfolioData.experiences;
  }
}

export async function getTestimonials(): Promise<TestimonialDto[]> {
  if (!hasDatabase()) return portfolioData.testimonials;
  try {
    const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
    return rows.length > 0 ? rows : portfolioData.testimonials;
  } catch (e) {
    warn("TESTIMONIALS", e);
    return portfolioData.testimonials;
  }
}

export async function getStats(): Promise<StatsDto> {
  const [projects, skills, experiences, testimonials] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperiences(),
    getTestimonials(),
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
    uptime: "99.9%",
    source,
  };
}
