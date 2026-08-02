import type { MetadataRoute } from "next";

// aether-hud.vercel.app is taken by another project; actual domain is aether-hud-lyart.vercel.app
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aether-hud-lyart.vercel.app";

// Single-page portfolio: only the homepage is publicly indexable.
// /dashboard and /login are auth-gated and robots-disallowed (robots.ts),
// so listing them here would contradict the crawl rules.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
