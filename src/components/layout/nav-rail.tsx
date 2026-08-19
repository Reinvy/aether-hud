"use client";

import { useState, useEffect } from "react";
import { Gamepad2, Sparkles, Award, Users, Mail, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface RailItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  tag: string;
}

const RAIL_ITEMS: RailItem[] = [
  { id: "hero", label: "Traveler", href: "/#hero", icon: Compass, tag: "NODE//01" },
  { id: "projects", label: "Missions", href: "/#projects", icon: Gamepad2, tag: "NODE//02" },
  { id: "skills", label: "Visions", href: "/#skills", icon: Sparkles, tag: "NODE//03" },
  { id: "experience", label: "Quests", href: "/#experience", icon: Award, tag: "NODE//04" },
  { id: "testimonials", label: "Allies", href: "/#testimonials", icon: Users, tag: "NODE//05" },
  { id: "contact", label: "Summon", href: "/#contact", icon: Mail, tag: "NODE//06" },
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
      aria-label="Tactical Rail Navigation"
      className="hidden lg:flex fixed left-3 xl:left-5 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-4"
    >
      {/* Top Floating Circular Celestial Orb / Logo */}
      <a
        href="/#hero"
        aria-label="Back to top"
        className="w-10 h-10 rounded-full bg-parchment-subtle dark:bg-surface-primary border-2 border-leather-caramel/40 dark:border-gold-400/40 flex items-center justify-center shadow-lg hover:scale-110 transition-transform group relative"
      >
        <div className="w-5 h-5 rounded-full border border-leather-caramel dark:border-gold-400 flex items-center justify-center animate-spin" style={{ animationDuration: "12s" }}>
          <div className="w-2 h-2 rounded-full bg-leather-caramel dark:bg-gold-400" />
        </div>
        <span className="sr-only">Top</span>
      </a>

      {/* Vertical Rail Container */}
      <nav
        role="navigation"
        className="parchment-panel dark:glass-panel chamfered-sm py-4 px-2 flex flex-col items-center gap-3 border border-leather-caramel/25 dark:border-gold-400/25 shadow-xl"
      >
        {RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "group relative w-10 h-10 chamfered-xs flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-leather-caramel text-parchment-base dark:bg-gold-400 dark:text-deep-space shadow-md"
                  : "text-leather-muted dark:text-platinum-300 hover:text-leather-dark dark:hover:text-gold-400 hover:bg-leather-caramel/10 dark:hover:bg-gold-400/10"
              )}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

              {/* Hover Tooltip */}
              <div className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 chamfered-xs bg-leather-dark text-parchment-base dark:bg-surface-primary dark:text-gold-400 border border-leather-caramel/30 dark:border-gold-400/30 text-[10px] font-mono whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-xl z-50">
                <span className="font-bold">{item.label.toUpperCase()}</span>
                <span className="ml-1.5 opacity-60 text-[9px]">// {item.tag}</span>
              </div>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
