import type { Metadata } from "next";

/**
 * Shared dashboard segment metadata factory.
 *
 * All dashboard routes are auth-gated private pages, so they must NEVER be
 * indexed — this hard-codes robots noindex/follow for every page that uses
 * it (defense-in-depth on top of robots.ts). Each page passes its own HUD
 * title, which renders under the root layout's "%s | AETHER-HUD" template.
 *
 * Usage (server page wrapper):
 *   export const metadata: Metadata = dashboardMetadata("PROJECT ARCHIVE");
 */
export function dashboardMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
      },
    },
  };
}
