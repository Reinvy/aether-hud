import type { MetadataRoute } from "next";

// aether-hud.vercel.app is taken by another project; actual domain is aether-hud-lyart.vercel.app
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aether-hud-lyart.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
