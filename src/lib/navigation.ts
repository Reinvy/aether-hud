
/**
 * navigation.ts — the single source of navigation truth.
 *
 * Every navigational surface (site header, desktop rail, mobile dock, footer,
 * dashboard sidebar) renders from these registries. Four competing definitions
 * previously drifted apart — including one on `HudHeader` that was never
 * imported, leaving the public site without a header entirely. No other module
 * may declare a nav array; `e2e/navigation.test.mjs` enforces that.
 *
 * Each entry is a literal `{ …, href: "…" } as const` object so the e2e parser
 * can read the registry statically.
 */

import type { GenshinIconKey } from "./ui-icons";

export const PUBLIC_NAV = [
  { label: "Traveler", href: "/#hero", sectionId: "hero", icon: "characterAether" },
  { label: "Domains", href: "/#projects", sectionId: "projects", icon: "domain" },
  { label: "Talents", href: "/#skills", sectionId: "skills", icon: "talents" },
  { label: "Quests", href: "/#experience", sectionId: "experience", icon: "handbook" },
  { label: "Allies", href: "/#testimonials", sectionId: "testimonials", icon: "friends" },
  { label: "Summon", href: "/#contact", sectionId: "contact", icon: "mail" },
] as const;

interface DashboardNavItem {
  label: string;
  href: string;
  /** Key of the artwork pool in src/lib/ui-icons.ts (locked by e2e TEST 10). */
  icon: GenshinIconKey;
  group: "codex" | "sanctum";
}

export const DASHBOARD_NAV = [
  { label: "Overview", href: "/dashboard", icon: "list", group: "codex" },
  { label: "Domains", href: "/dashboard/projects", icon: "domain", group: "codex" },
  { label: "Talents", href: "/dashboard/skills", icon: "talents", group: "codex" },
  { label: "Quests", href: "/dashboard/experiences", icon: "quests", group: "codex" },
  { label: "Allies", href: "/dashboard/testimonials", icon: "friends", group: "codex" },
  { label: "Summon Desk", href: "/dashboard/contact", icon: "mail", group: "codex" },
  { label: "Traveler Profile", href: "/dashboard/profile", icon: "character", group: "sanctum" },
  { label: "Codex Pages", href: "/dashboard/sections", icon: "deckList", group: "sanctum" },
  { label: "Observatory", href: "/dashboard/telemetry", icon: "elementalSight", group: "sanctum" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings", group: "sanctum" },
] as const;

/** Console sections, in render order, with their display labels. */
export const DASHBOARD_NAV_GROUPS: readonly {
  label: string;
  items: readonly DashboardNavItem[];
}[] = [
  { label: "Codex", items: DASHBOARD_NAV.filter((item) => item.group === "codex") },
  { label: "Sanctum", items: DASHBOARD_NAV.filter((item) => item.group === "sanctum") },
];

/** True when `href` addresses the active route (exact, or a parent prefix). */
export function isDashboardNavActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
}
