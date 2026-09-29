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
// domain is aether-hud-lyart.vercel.app (see .cron/VERCEL_DOMAIN.env).
export const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aether-hud-lyart.vercel.app";

export const PORTFOLIO_CONFIG = {
  name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Bahrul Ulumul Haq",
  tagline:
    process.env.NEXT_PUBLIC_PORTFOLIO_TAGLINE || "Full-Stack Developer & AI Engineer",
  email: "hello@aether-hud.dev",
  location: "Jakarta, Indonesia",
  status: "ONLINE",
  sysVersion: "v2.4.1",
};

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
