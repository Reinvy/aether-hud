import { TEYVAT_ELEMENTS, type ElementAsset } from "@/lib/element-assets";
import { PROJECT_CATEGORIES } from "@/lib/constants";

/** Artifact grades an authored record may carry. */
export type ArtifactGrade = "S" | "A" | "B" | "C";

/**
 * project-meta — the single place that turns an authored project record into
 * codex presentation metadata.
 *
 * The dataset stores a discipline name and a `CLASS-…` complexity token; the
 * archive renders a star rating, a grade letter and an elemental vision. Both
 * mappings live here so the list card, the dossier and the console form can
 * never disagree about what a project is.
 */

/** `CLASS-S` → `S`. Unknown shapes fall back to the neutral `B` grade. */
export function formatGrade(complexity: string): ArtifactGrade {
  const letter = complexity.trim().toUpperCase().replace(/^CLASS[-\s]*/, "").slice(0, 1);
  return letter === "S" || letter === "A" || letter === "B" || letter === "C" ? letter : "B";
}

/** Star rating: S/A = 5★, B = 4★, C = 3★. */
export function resolveRarity(complexity: string): 3 | 4 | 5 {
  const grade = formatGrade(complexity);
  if (grade === "S" || grade === "A") return 5;
  return grade === "B" ? 4 : 3;
}

/**
 * The vision each discipline grants. Keyed by the canonical
 * `PROJECT_CATEGORIES` strings so a category rename fails loudly in review
 * (and anything unlisted lands on Geo) rather than silently mis-assigning.
 */
const CATEGORY_ELEMENT_KEY: Partial<Record<(typeof PROJECT_CATEGORIES)[number], string>> = {
  "AI Platform": "pyro",
  "AI Tooling": "pyro",
  "Data Platform": "hydro",
  "Developer Tools": "anemo",
  "No-Code Platform": "anemo",
  Infrastructure: "geo",
  Security: "cryo",
  Education: "dendro",
  Portfolio: "electro",
};

export function elementForCategory(category: string): ElementAsset {
  const key = CATEGORY_ELEMENT_KEY[category.trim() as (typeof PROJECT_CATEGORIES)[number]];
  return TEYVAT_ELEMENTS.find((element) => element.key === key) ?? TEYVAT_ELEMENTS[6];
}
