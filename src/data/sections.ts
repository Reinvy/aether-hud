import type { SectionDto } from "@/lib/dto";

/**
 * Static fallback for the `Section` table.
 *
 * Used whenever the codex runs without a database (see
 * `src/lib/portfolio-repo.ts`) so the homepage still renders every section, in
 * order, with Teyvat Codex vocabulary instead of the retired tactical labels.
 */
export const SECTION_FALLBACKS: SectionDto[] = [
  {
    id: "sec-hero",
    key: "hero",
    title: "Traveler",
    subtitle: "Traveler dossier & vision",
    enabled: true,
    order: 0,
  },
  {
    id: "sec-projects",
    key: "projects",
    title: "Domains",
    subtitle: "Artifact archive of forged platforms",
    enabled: true,
    order: 1,
  },
  {
    id: "sec-skills",
    key: "skills",
    title: "Talents",
    subtitle: "Elemental proficiencies & constellations",
    enabled: true,
    order: 2,
  },
  {
    id: "sec-experience",
    key: "experience",
    title: "Quests",
    subtitle: "Expedition chronicle of commissions",
    enabled: true,
    order: 3,
  },
  {
    id: "sec-testimonials",
    key: "testimonials",
    title: "Allies",
    subtitle: "Companion endorsements",
    enabled: true,
    order: 4,
  },
  {
    id: "sec-contact",
    key: "contact",
    title: "Summon",
    subtitle: "Dispatch portal for commissions",
    enabled: true,
    order: 5,
  },
];
