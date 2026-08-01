import { DashboardPageSkeleton } from "@/components/ui/skeleton";

/**
 * Dashboard route loading state — full HUD skeleton shown during
 * route transitions between dashboard sub-pages, so the tactical
 * layout never flashes blank while the client chunk hydrates.
 */
export default function DashboardLoading() {
  return <DashboardPageSkeleton />;
}
