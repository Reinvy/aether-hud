import { HudLoader } from "@/components/ui/hud-loader";

/**
 * Root route loading state — HUD-style boot screen shown while the
 * landing page chunk streams in (works with the dynamic section
 * imports in page.tsx for a seamless boot sequence).
 */
export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-space">
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-10" />
      <HudLoader label="BOOTING AETHER-HUD" size="lg" />
    </div>
  );
}
