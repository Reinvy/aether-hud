/**
 * dto.ts — the single wire contract between the codex data layer and every
 * consumer (API routes, server components, dashboard views).
 *
 * Two families live here:
 *
 * 1. `*Dto` — the flat shapes that cross the network boundary. They mirror the
 *    PostgreSQL rows one-to-one (Project.tags arrives as a JSON string on the
 *    wire, so `parseTags` normalises it), which keeps the dashboard forms and
 *    the public sections reading the same field names.
 *
 * 2. `Portfolio*` — the shapes of the static dataset in `src/data/portfolio.ts`.
 *    That file predates the database (nested `links`, no `order` columns) and is
 *    deliberately left in its authored form; the mappers below are the only
 *    place where the nesting is flattened.
 */

/* ─── Wire DTOs ─────────────────────────────────────────────────────────── */

export interface ProjectDto {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string | null;
  githubUrl: string | null;
  order: number;
}

export interface SocialDto {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

export interface ExperienceDto {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  type: string;
  order: number;
}

export interface TestimonialDto {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  order: number;
}

export interface SkillDto {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  order: number;
}

export interface SectionDto {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  enabled: boolean;
  order: number;
}

export interface ConfigDto {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  status: string;
  edition: string;
  siteName: string;
  siteDescription: string;
  animationsEnabled: boolean;
}

/** One entry of the console activity stream (`GET /api/dashboard/activity`). */
export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  time: string;
  type: "deploy" | "update" | "calibrate" | "sync";
  timestamp: string;
}

export interface StatsDto {
  projectCount: number;
  skillCount: number;
  experienceCount: number;
  testimonialCount: number;
  avgSkillLevel: number;
  source: "database" | "data-file-fallback";
}

/**
 * One aggregated Web Vitals metric as returned by `/api/telemetry/summary`.
 * `last` is the newest sample's origin (page + time), never the raw stream.
 */
export interface TelemetryMetricSummary {
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  p95: number | null;
  last: {
    value: number;
    rating: string;
    path: string;
    recordedAt: string;
  } | null;
}

/** Aggregated Web Vitals payload from `/api/telemetry/summary`. */
export interface TelemetrySummary {
  ok: boolean;
  source: "database" | "memory";
  startedAt: string;
  totalRecorded: number;
  metrics: Record<string, TelemetryMetricSummary>;
}

/* ─── Static dataset shapes (src/data/portfolio.ts) ─────────────────────── */

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  complexity: string;
  performance: string;
  year: string;
  links: { live?: string; github?: string };
}

export interface PortfolioSkill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
}

export interface PortfolioSocial {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

/* ─── Mappers ───────────────────────────────────────────────────────────── */

/** PostgreSQL row (tags stored as a JSON string) → flat wire project. */
export function projectToDto(row: {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string;
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string | null;
  githubUrl: string | null;
  order: number;
}): ProjectDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    tags: parseTags(row.tags),
    category: row.category,
    complexity: row.complexity,
    performance: row.performance,
    year: row.year,
    liveUrl: row.liveUrl,
    githubUrl: row.githubUrl,
    order: row.order,
  };
}

/** Static dataset entry (nested `links`) → flat wire project. */
export function fallbackProjectToDto(p: PortfolioProject, order: number): ProjectDto {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image,
    tags: p.tags,
    category: p.category,
    complexity: p.complexity,
    performance: p.performance,
    year: p.year,
    liveUrl: p.links.live ?? null,
    githubUrl: p.links.github ?? null,
    order,
  };
}

/** Prisma `Skill` row → flat wire skill (drops the row's timestamps). */
export function skillToDto(row: {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  order: number;
}): SkillDto {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    category: row.category,
    icon: row.icon,
    order: row.order,
  };
}

/** Prisma `Experience` row → flat wire experience. */
export function experienceToDto(row: {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  type: string;
  order: number;
}): ExperienceDto {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    description: row.description,
    startDate: row.startDate,
    endDate: row.endDate,
    type: row.type,
    order: row.order,
  };
}

/** Prisma `Testimonial` row → flat wire testimonial. */
export function testimonialToDto(row: {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  order: number;
}): TestimonialDto {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    content: row.content,
    avatar: row.avatar,
    order: row.order,
  };
}

/** Prisma `SocialLink` row → flat wire social link. */
export function socialToDto(row: {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
}): SocialDto {
  return {
    id: row.id,
    platform: row.platform,
    url: row.url,
    icon: row.icon,
    order: row.order,
  };
}

/** Prisma `Section` row → flat wire section. */
export function sectionToDto(row: {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  enabled: boolean;
  order: number;
}): SectionDto {
  return {
    id: row.id,
    key: row.key,
    title: row.title,
    subtitle: row.subtitle,
    enabled: row.enabled,
    order: row.order,
  };
}

/**
 * Normalise a Prisma `tags` column into a string array. The column stores a
 * JSON array as text, but seeded/legacy rows may hold a comma-separated list,
 * and the dashboard can hand the API either form.
 */
function parseTags(tags: string | string[] | null | undefined): string[] {
  if (Array.isArray(tags)) return tags.filter((t): t is string => typeof t === "string");
  if (!tags) return [];
  try {
    const parsed: unknown = JSON.parse(tags);
    if (Array.isArray(parsed)) {
      return parsed.filter((t): t is string => typeof t === "string");
    }
    return [];
  } catch {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
}
