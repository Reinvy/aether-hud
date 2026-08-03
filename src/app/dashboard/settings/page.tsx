/**
 * SettingsPage — server page wrapper.
 *
 * Per-page metadata lives here (see dashboardMetadata): every dashboard
 * route is auth-gated, so robots noindex is applied defensively and each
 * page gets a HUD-styled <title>. The interactive view is a client
 * component imported from settings-view.tsx.
 */
import type { Metadata } from "next";
import { dashboardMetadata } from "@/lib/dashboard-metadata";
import DashboardSettings from "./settings-view";

export const metadata: Metadata = dashboardMetadata("SYSTEM SETTINGS");

export default function SettingsPage() {
  return <DashboardSettings />;
}
