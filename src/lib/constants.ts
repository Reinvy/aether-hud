export const APP_NAME = "AETHER-HUD";
export const APP_DESCRIPTION = "High-End Tactical Portfolio — Obsidian & Imperial Gold Edition";
// NOTE: aether-hud.vercel.app is TAKEN by another project. The real production
// domain is aether-hud-lyart.vercel.app (see .cron/VERCEL_DOMAIN.env).
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aether-hud-lyart.vercel.app";

export const PORTFOLIO_CONFIG = {
  name: process.env.NEXT_PUBLIC_PORTFOLIO_NAME || "Bahrul Ulumul Haq",
  tagline: process.env.NEXT_PUBLIC_PORTFOLIO_TAGLINE || "Full-Stack Developer & AI Engineer",
  email: "hello@aether-hud.dev",
  location: "Jakarta, Indonesia",
  status: "ONLINE",
  sysVersion: "v2.4.1",
};

export const NAV_ITEMS = [
  { label: "HOME", href: "/", sysId: "NODE//01" },
  { label: "PROFILE", href: "/#hero", sysId: "NODE//01" },
  { label: "PROJECTS", href: "/#projects", sysId: "NODE//02" },
  { label: "SKILLS", href: "/#skills", sysId: "NODE//03" },
  { label: "CONTACT", href: "/#contact", sysId: "NODE//04" },
] as const;

export const DASHBOARD_NAV = [
  { label: "OVERVIEW", href: "/dashboard", icon: "Activity", sysId: "DASH//00" },
  { label: "PROFILE", href: "/dashboard/profile", icon: "User", sysId: "DASH//01" },
  { label: "PROJECTS", href: "/dashboard/projects", icon: "Boxes", sysId: "DASH//02" },
  { label: "SKILLS", href: "/dashboard/skills", icon: "Cpu", sysId: "DASH//03" },
  { label: "EXPERIENCE", href: "/dashboard/experiences", icon: "Briefcase", sysId: "DASH//04" },
  { label: "TESTIMONIALS", href: "/dashboard/testimonials", icon: "MessageCircle", sysId: "DASH//05" },
  { label: "CONTACT", href: "/dashboard/contact", icon: "Globe", sysId: "DASH//06" },
  { label: "SECTIONS", href: "/dashboard/sections", icon: "Layout", sysId: "DASH//SECT" },
  { label: "TELEMETRY", href: "/dashboard/telemetry", icon: "Gauge", sysId: "DASH//08" },
  { label: "SETTINGS", href: "/dashboard/settings", icon: "Settings", sysId: "DASH//07" },
] as const;

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  complexity: string;
  performance: string;
  year: string;
  links: {
    live?: string;
    github?: string;
  };
};

export type Skill = {
  id: string;
  name: string;
  level: number; // 0-100
  category: string;
  icon: string;
};

export type PortfolioData = {
  name: string;
  tagline: string;
  bio: string;
  avatar: string;
  projects: Project[];
  skills: Skill[];
  socials: { platform: string; url: string; icon: string }[];
};


