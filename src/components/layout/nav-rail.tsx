"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { useTheme } from "@/components/theme-provider";

interface RailItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  tag: string;
}

const RAIL_ITEMS: RailItem[] = [
  { id: "hero", label: "Traveler", href: "/#hero", icon: GENSHIN_UI_ICONS.character, tag: "TEYVAT//01" },
  { id: "projects", label: "Domains", href: "/#projects", icon: GENSHIN_UI_ICONS.domain, tag: "ARTIFACTS//02" },
  { id: "skills", label: "Talents", href: "/#skills", icon: GENSHIN_UI_ICONS.talents, tag: "TALENTS//03" },
  { id: "experience", label: "Quests", href: "/#experience", icon: GENSHIN_UI_ICONS.handbook, tag: "COMMISSIONS//04" },
  { id: "testimonials", label: "Allies", href: "/#testimonials", icon: GENSHIN_UI_ICONS.friends, tag: "ALLIES//05" },
  { id: "contact", label: "Summon", href: "/#contact", icon: GENSHIN_UI_ICONS.mail, tag: "SHRINE//06" },
];

export function NavRail() {
  const [activeSection, setActiveSection] = useState("hero");
  const [time, setTime] = useState("");
  const { themePreset, toggleTheme } = useTheme();

  const isNight = themePreset === "celestial-night";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = RAIL_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 300;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(RAIL_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      aria-label="Teyvat Tactical Rail Navigation"
      className="hidden lg:flex fixed left-3 xl:left-5 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3"
    >
      {/* Top Floating Paimon/Aether Crest Orb */}
      <a
        href="/#hero"
        aria-label="Back to top"
        className="w-11 h-11 rounded-full bg-[#FAF7EE] dark:bg-surface-primary border-2 border-[#8C6239]/50 dark:border-gold-400/50 flex items-center justify-center shadow-xl hover:scale-110 transition-transform group relative p-1.5 focus-ring-gold"
      >
        <Image
          src={GENSHIN_UI_ICONS.characterAether}
          alt="Aether Crest"
          width={28}
          height={28}
          className="object-contain transition-transform group-hover:rotate-12"
          unoptimized
        />
        <span className="sr-only">Top</span>
        {/* Tooltip */}
        <div className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#1E1208] text-[#FAF7EE] dark:bg-surface-primary dark:text-gold-400 border border-leather-caramel/30 dark:border-gold-400/30 text-[10px] font-mono whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-2xl z-50">
          <span className="font-bold">TEYVAT CODEX</span>
        </div>
      </a>

      {/* Main Vertical Rail Container */}
      <nav
        role="navigation"
        aria-label="Section Navigation"
        className="bg-[#FAF7EE]/95 dark:bg-surface-primary/80 parchment-panel dark:glass-panel rounded-3xl py-3 px-1.5 flex flex-col items-center gap-2 border-2 border-leather-caramel/30 dark:border-gold-400/30 shadow-2xl"
      >
        {RAIL_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "group relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 p-2 focus-ring-gold",
                isActive
                  ? "bg-[#8C6239] dark:bg-gold-400 shadow-md scale-105"
                  : "bg-leather-caramel/5 dark:bg-surface-primary/60 hover:bg-leather-caramel/15 dark:hover:bg-gold-400/15"
              )}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={22}
                height={22}
                className={cn(
                  "object-contain transition-transform group-hover:scale-110",
                  isActive ? "brightness-0 invert dark:brightness-0" : "opacity-85 group-hover:opacity-100"
                )}
                unoptimized
              />

              {/* Hover Tooltip */}
              <div className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#1E1208] text-[#FAF7EE] dark:bg-surface-primary dark:text-gold-400 border border-leather-caramel/30 dark:border-gold-400/30 text-[10px] font-mono whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-2xl z-50">
                <span className="font-bold">{item.label.toUpperCase()}</span>
                <span className="ml-2 opacity-60 text-[9px]">// {item.tag}</span>
              </div>
            </a>
          );
        })}

        {/* Divider */}
        <div className="w-6 h-px bg-leather-caramel/30 dark:bg-gold-400/30 my-1" />

        {/* Theme Switcher Button (☀️ / 🌙) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isNight ? "Switch to Ivory Codex theme" : "Switch to Celestial Night theme"}
          className="group relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 bg-leather-caramel/10 dark:bg-gold-400/10 text-leather-dark dark:text-gold-400 hover:scale-105 focus-ring-gold p-2"
        >
          {isNight ? (
            <Sun className="h-4 w-4 text-gold-400 transition-transform rotate-0 group-hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-[#8C6239] transition-transform rotate-0 group-hover:-rotate-12" />
          )}

          {/* Theme Tooltip */}
          <div className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#1E1208] text-[#FAF7EE] dark:bg-surface-primary dark:text-gold-400 border border-leather-caramel/30 dark:border-gold-400/30 text-[10px] font-mono whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-2xl z-50">
            <span className="font-bold">{isNight ? "THEME: IVORY CODEX" : "THEME: CELESTIAL NIGHT"}</span>
          </div>
        </button>

        {/* Staff Portal Link */}
        <Link
          href="/login"
          aria-label="Staff Portal Login"
          className="group relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 bg-leather-caramel/10 dark:bg-gold-400/10 text-leather-dark dark:text-gold-400 hover:scale-105 focus-ring-gold p-2"
        >
          <div className="w-4 h-4 relative">
            <Image
              src={GENSHIN_UI_ICONS.archive}
              alt="Staff Portal"
              width={16}
              height={16}
              className="object-contain"
            />
          </div>
          {/* Staff Tooltip */}
          <div className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#1E1208] text-[#FAF7EE] dark:bg-surface-primary dark:text-gold-400 border border-leather-caramel/30 dark:border-gold-400/30 text-[10px] font-mono whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-2xl z-50">
            <span className="font-bold">STAFF PORTAL</span>
          </div>
        </Link>
      </nav>

      {/* Bottom Mini Clock / Realm Clock */}
      <div className="rounded-full bg-[#FAF7EE]/95 dark:bg-surface-primary/90 border border-leather-caramel/30 dark:border-gold-400/25 px-3 py-1 flex items-center gap-1.5 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-[9px] text-[#1E1208] dark:text-platinum-200 font-bold tabular-nums">
          {time || "--:--"}
        </span>
      </div>
    </aside>
  );
}
