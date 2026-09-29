"use client";

import Link from "next/link";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { PUBLIC_NAV } from "@/lib/navigation";
import { useActiveSection } from "@/lib/use-active-section";
import { useTheme } from "@/components/theme-provider";

/**
 * MobileNavDock — floating bottom navigation for phones and tablets.
 *
 * Rendered from `PUBLIC_NAV` and the shared `useActiveSection` observer, so the
 * dock, the desktop rail and the header can never disagree about where the
 * visitor is.
 */
export function MobileNavDock() {
  const activeSection = useActiveSection(PUBLIC_NAV.map((item) => item.sectionId));
  const { themePreset, toggleTheme } = useTheme();
  const isNight = themePreset === "celestial-night";

  return (
    <nav
      aria-label="Codex sections"
      className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 lg:hidden"
    >
      <div className="flex items-center justify-between gap-1 rounded-full border-2 border-leather-caramel/35 bg-parchment-subtle/95 px-3 py-1.5 shadow-2xl backdrop-blur-xl dark:border-gold-400/35 dark:bg-surface-primary/90">
        {PUBLIC_NAV.map((item) => {
          const isActive = activeSection === item.sectionId;
          return (
            <a
              key={item.sectionId}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "relative flex min-h-[38px] min-w-[38px] flex-col items-center justify-center rounded-full p-1.5 transition-all duration-200",
                isActive
                  ? "scale-105 bg-leather-caramel shadow-sm dark:bg-gold-400"
                  : "hover:bg-leather-caramel/10 dark:hover:bg-gold-400/10"
              )}
            >
              <Image
                src={GENSHIN_UI_ICONS[item.icon]}
                alt=""
                width={20}
                height={20}
                className={cn(
                  "h-5 w-5 object-contain transition-transform",
                  isActive ? "brightness-0 invert" : "opacity-90"
                )}
                unoptimized
              />
            </a>
          );
        })}

        <div className="mx-0.5 h-5 w-px shrink-0 bg-leather-caramel/30 dark:bg-gold-400/30" />

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isNight ? "Switch to the parchment theme" : "Switch to the celestial night theme"}
          className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full bg-leather-caramel/10 p-1.5 text-leather-dark transition-transform hover:scale-105 dark:bg-gold-400/10 dark:text-gold-400"
        >
          {isNight ? (
            <Sun className="h-4 w-4 text-gold-400" />
          ) : (
            <Moon className="h-4 w-4 text-leather-caramel" />
          )}
        </button>

        <Link
          href="/login"
          aria-label="Codex Console"
          className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full bg-leather-caramel/10 p-1.5 transition-transform hover:scale-105 dark:bg-gold-400/10"
        >
          <Image
            src={GENSHIN_UI_ICONS.archive}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
            unoptimized
          />
        </Link>
      </div>
    </nav>
  );
}
