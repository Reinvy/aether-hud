import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/portfolio-repo";
import { APP_URL } from "@/lib/constants";

// The homepage plus one dossier per deployed domain. /dashboard and /login are
// auth-gated and robots-disallowed (robots.ts), so listing them here would
// contradict the crawl rules.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    {
      url: APP_URL,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...projects.map((project) => ({
      url: `${APP_URL}/projects/${project.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
