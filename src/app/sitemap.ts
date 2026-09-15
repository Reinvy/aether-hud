import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/portfolio-repo";

// aether-hud.vercel.app is taken by another project; actual domain is aether-hud-lyart.vercel.app
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aether-hud-lyart.vercel.app";

// The homepage plus one dossier per deployed domain. /dashboard and /login are
// auth-gated and robots-disallowed (robots.ts), so listing them here would
// contradict the crawl rules.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...projects.map((project) => ({
      url: `${BASE_URL}/projects/${project.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
