import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Project banners use a local HUD placeholder SVG (public/placeholder.svg).
    // dangerouslyAllowSVG is scoped to same-origin local assets via CSP —
    // remote SVG sources are not configured in remotePatterns, so untrusted
    // SVGs can never reach the optimizer.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
