import type {
  ExperienceDto,
  PortfolioProject,
  PortfolioSkill,
  PortfolioSocial,
  ProjectDto,
  SkillDto,
  TestimonialDto,
} from "./dto";

/** Product identity — consumed by metadata, manifests, headers and JSON-LD. */
export const APP_NAME = "Teyvat Codex";
export const APP_DESCRIPTION =
  "Interactive Traveler Dossier — portfolio, domains, talents and commissions";

// NOTE: aether-hud.vercel.app is TAKEN by another project. The real production
// domain is aether-hud-lyart.vercel.app.
export const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aether-hud-lyart.vercel.app";

export const PORTFOLIO_CONFIG = {
  name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Bahrul Ulumul Haq",
  tagline:
    process.env.NEXT_PUBLIC_PORTFOLIO_TAGLINE || "Full-Stack Developer & AI Engineer",
  email: "hello@aether-hud.dev",
  location: "Jakarta, Indonesia",
  status: "ONLINE",
  edition: "Teyvat Codex Edition",
};

/**
 * The one-line professional mission rendered in the hero dossier. Kept here so
 * the copy lives next to the identity it describes instead of inside a section.
 */
export const MISSION_LINE =
  "I design, build and operate production web platforms — full-stack TypeScript, applied AI, and the infrastructure that keeps them dependable.";

/**
 * Section keys the landing page can render. Each key maps to a rendered
 * section in `src/app/home-content.tsx`, so the console may only enable,
 * reorder, retitle or delete these — never invent a new one.
 */
export const SECTION_KEYS = [
  "hero",
  "projects",
  "skills",
  "experience",
  "testimonials",
  "contact",
] as const;

/** Disciplines a domain can be classified under (mirrors the authored archive). */
export const PROJECT_CATEGORIES = [
  "AI Platform",
  "AI Tooling",
  "Data Platform",
  "Developer Tools",
  "No-Code Platform",
  "Infrastructure",
  "Security",
  "Education",
  "Portfolio",
] as const;

/** Talent disciplines. */
export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Language",
  "AI",
  "DevOps",
  "Design",
] as const;

/** Employment record kinds. */
export const EXPERIENCE_TYPES = ["work", "education", "freelance"] as const;

/**
 * Flat wire project shape, re-exported for every module that speaks the
 * `/api/projects` contract.
 */
export type Project = ProjectDto;
export type Skill = SkillDto;

/**
 * Shape of the static dataset in `src/data/portfolio.ts`.
 *
 * Deliberately NOT the wire shape: the dataset keeps its nested `links`, its
 * order-less skills and its extra social entries. `src/lib/portfolio-repo.ts`
 * is the single place that promotes it to the `*Dto` contracts.
 */
export type PortfolioData = {
  name: string;
  tagline: string;
  bio: string;
  avatar: string;
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  socials: PortfolioSocial[];
  experiences: ExperienceDto[];
  testimonials: TestimonialDto[];
};
