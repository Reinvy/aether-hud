import type { Metadata } from "next";
import { DashboardShell } from "./dashboard-shell";

/**
 * Dashboard segment layout — server component.
 *
 * Exports segment metadata so every /dashboard route inherits robots
 * noindex (auth-gated private area) and a sensible default title. The
 * client chrome (session guard, sidebar, error boundary) lives in
 * DashboardShell to keep this file server-only.
 */
export const metadata: Metadata = {
  title: {
    default: "SYSTEM OVERVIEW",
    template: "%s // AETHER DASH",
  },
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
