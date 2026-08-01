import { HudLoader } from "@/components/ui/hud-loader";

/**
 * Login route loading state — HUD-style session boot indicator.
 */
export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-space">
      <HudLoader label="INITIALIZING SECURE CHANNEL" size="lg" />
    </div>
  );
}
