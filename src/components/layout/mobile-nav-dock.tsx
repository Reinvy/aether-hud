"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV } from "@/lib/navigation";
import { AssetIcon } from "@/components/ui/asset-icon";
import { useActiveSection } from "@/lib/use-active-section";
import { useMotionPrefs } from "@/components/motion-provider";

/**
 * MobileNavDock — floating bottom navigation for phones and tablets.
 *
 * Rendered from `PUBLIC_NAV` and the shared `useActiveSection` observer, so the
 * dock, the desktop rail and the header can never disagree about where the
 * visitor is.
 */
export function MobileNavDock() {
  const activeSection = useActiveSection(PUBLIC_NAV.map((item) => item.sectionId));
  const { animationsEnabled, setAnimationsEnabled } = useMotionPrefs();

  return (
    <nav
      aria-label="Codex sections"
      className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 lg:hidden"
    >
      <div className="flex items-center justify-between gap-1 rounded-full border-2 border-leather-caramel/35 bg-parchment-subtle/95 px-3 py-1.5 shadow-2xl backdrop-blur-xl">
        {PUBLIC_NAV.map((item) => {
          const isActive = activeSection === item.sectionId;
          return (
            <a
              key={item.sectionId}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "relative flex min-h-[38px] min-w-[38px] flex-col items-center justify-center rounded-full transition-all duration-200 codex-focus",
                isActive
                  ? "scale-105 bg-leather-caramel shadow-sm"
                  : "hover:bg-leather-caramel/10"
              )}
            >
              <AssetIcon icon={item.icon} size="sm" />
            </a>
          );
        })}

        <div className="mx-0.5 h-5 w-px shrink-0 bg-leather-caramel/30" />

        <button
          type="button"
          onClick={() => setAnimationsEnabled(!animationsEnabled)}
          aria-pressed={animationsEnabled}
          aria-label={animationsEnabled ? "Disable motion effects" : "Enable motion effects"}
          className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full bg-leather-caramel/10 p-1.5 text-leather-dark transition-transform hover:scale-105 codex-focus"
        >
          <AssetIcon
            icon="wish"
            size="sm"
            className={cn(animationsEnabled ? "opacity-100" : "opacity-45")}
          />
        </button>

        <Link
          href="/login"
          aria-label="Codex Console"
          className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full bg-leather-caramel/10 transition-transform hover:scale-105 codex-focus"
        >
          <AssetIcon icon="archive" size="sm" />
        </Link>
      </div>
    </nav>
  );
}
