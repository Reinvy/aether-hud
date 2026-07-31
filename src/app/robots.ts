import type { MetadataRoute } from "next";

// aether-hud.vercel.app is taken by another project; actual domain is aether-hud-lyart.vercel.app
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aether-hud-lyart.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/login"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
