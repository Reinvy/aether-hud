"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

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
      aria-label="Teyvat Rail Navigation"
      className="hidden lg:flex fixed left-3 xl:left-5 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-4"
    >
      {/* Top Floating Paimon Crest Orb */}
      <a
        href="/#hero"
        aria-label="Back to top"
        className="w-11 h-11 rounded-full bg-parchment-subtle dark:bg-surface-primary border-2 border-leather-caramel/50 dark:border-gold-400/50 flex items-center justify-center shadow-xl hover:scale-110 transition-transform group relative p-1.5"
      >
        <Image
          src={GENSHIN_UI_ICONS.characterAether}
          alt="Aether Crest"
          width={28}
          height={28}
          className="object-contain transition-transform group-hover:rotate-12"
        />
        <span className="sr-only">Top</span>
      </a>

      {/* Vertical Rail Container */}
      <nav
        role="navigation"
        className="parchment-panel dark:glass-panel chamfered-sm py-4 px-2 flex flex-col items-center gap-3 border-2 border-leather-caramel/30 dark:border-gold-400/30 shadow-2xl"
      >
        {RAIL_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "group relative w-11 h-11 chamfered-xs flex items-center justify-center transition-all duration-300 p-2",
                isActive
                  ? "bg-leather-caramel dark:bg-gold-400 shadow-md scale-105"
                  : "bg-leather-caramel/5 dark:bg-surface-primary/60 hover:bg-leather-caramel/15 dark:hover:bg-gold-400/15"
              )}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className={cn(
                  "object-contain transition-transform group-hover:scale-110",
                  isActive ? "brightness-0 invert dark:brightness-0" : "opacity-85 group-hover:opacity-100"
                )}
              />

              {/* Hover Tooltip */}
              <div className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 chamfered-xs bg-leather-dark text-parchment-base dark:bg-surface-primary dark:text-gold-400 border border-leather-caramel/30 dark:border-gold-400/30 text-[10px] font-mono whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-2xl z-50">
                <span className="font-bold">{item.label.toUpperCase()}</span>
                <span className="ml-2 opacity-60 text-[9px]">// {item.tag}</span>
              </div>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
