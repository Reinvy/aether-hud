"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { useTheme } from "@/components/theme-provider";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

const MOBILE_NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Traveler", href: "/#hero", icon: GENSHIN_UI_ICONS.character },
  { id: "projects", label: "Domains", href: "/#projects", icon: GENSHIN_UI_ICONS.domain },
  { id: "skills", label: "Talents", href: "/#skills", icon: GENSHIN_UI_ICONS.talents },
  { id: "experience", label: "Quests", href: "/#experience", icon: GENSHIN_UI_ICONS.handbook },
  { id: "testimonials", label: "Allies", href: "/#testimonials", icon: GENSHIN_UI_ICONS.friends },
  { id: "contact", label: "Summon", href: "/#contact", icon: GENSHIN_UI_ICONS.mail },
];

export function MobileNavDock() {
  const [activeSection, setActiveSection] = useState("hero");
  const { themePreset, setThemePreset } = useTheme();
  const isNight = themePreset === "night-ops" || themePreset === "celestial-night";

  const toggleTheme = () => {
    if (isNight) {
      setThemePreset("teyvat-codex");
    } else {
      setThemePreset("night-ops");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = MOBILE_NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 300;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(MOBILE_NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 lg:hidden w-[calc(100%-1.5rem)] max-w-md"
    >
      <div className="parchment-panel-strong dark:glass-panel-strong chamfered-sm px-2.5 py-1.5 border-2 border-leather-caramel/35 dark:border-gold-400/35 shadow-2xl flex items-center justify-between gap-1 backdrop-blur-xl">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "relative flex flex-col items-center justify-center p-1.5 chamfered-xs transition-all duration-200 min-w-[38px] min-h-[38px]",
                isActive
                  ? "bg-leather-caramel dark:bg-gold-400 shadow-sm scale-105"
                  : "hover:bg-leather-caramel/10 dark:hover:bg-gold-400/10"
              )}
            >
              <div className="w-5 h-5 relative">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={cn(
                    "object-contain transition-transform",
                    isActive ? "brightness-0 invert dark:brightness-0" : "opacity-90"
                  )}
                  unoptimized
                />
              </div>
              <span className="sr-only">{item.label}</span>
            </a>
          );
        })}

        {/* Vertical divider */}
        <div className="h-5 w-px bg-leather-caramel/30 dark:bg-gold-400/30 shrink-0 mx-0.5" />

        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isNight ? "Switch to Ivory Codex theme" : "Switch to Celestial Night theme"}
          className="flex items-center justify-center p-1.5 chamfered-xs min-w-[36px] min-h-[36px] bg-leather-caramel/10 dark:bg-gold-400/10 text-leather-dark dark:text-gold-400 hover:scale-105 transition-transform"
        >
          {isNight ? (
            <Sun className="h-4 w-4 text-gold-400" />
          ) : (
            <Moon className="h-4 w-4 text-leather-caramel" />
          )}
        </button>

        {/* Staff Portal Link */}
        <Link
          href="/login"
          aria-label="Staff Portal"
          className="flex items-center justify-center p-1.5 chamfered-xs min-w-[36px] min-h-[36px] bg-leather-caramel/10 dark:bg-gold-400/10 text-leather-dark dark:text-gold-400 hover:scale-105 transition-transform"
        >
          <Shield className="h-4 w-4 text-leather-caramel dark:text-gold-400" />
        </Link>
      </div>
    </nav>
  );
}
