"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { PUBLIC_NAV } from "@/lib/navigation";
import { useActiveSection } from "@/lib/use-active-section";
import { useMotionPrefs } from "@/components/motion-provider";

/**
 * NavRail — vertical desktop navigation, rendered from `PUBLIC_NAV`.
 *
 * The active section comes from the shared `useActiveSection` observer (the
 * rail previously ran its own duplicated scroll loop, and landing on a hash
 * never set the active state).
 */
export function NavRail() {
  const activeSection = useActiveSection(PUBLIC_NAV.map((item) => item.sectionId));
  const { animationsEnabled, setAnimationsEnabled } = useMotionPrefs();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
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

  return (
    <aside
      aria-label="Codex section rail"
      /*
       * The rail is a wide-screen enhancement: sections are centred in a
       * `max-w-7xl` column, and below ~1400px the outer gutter is narrower than
       * the rail, which would let it overlap card content. From 1400px up it
       * floats in the empty margin. The header carries the navigation at every
       * width where the rail is hidden.
       */
      className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 min-[1400px]:flex xl:left-5"
    >
      <a
        href="/#hero"
        aria-label="Back to the traveler dossier"
        className="group relative flex h-11 w-11 items-center justify-center codex-icon-plate p-1.5 shadow-xl transition-transform hover:scale-110 codex-focus"
      >
        <Image
          src={GENSHIN_UI_ICONS.characterAether}
          alt=""
          width={28}
          height={28}
          className="codex-icon-on-plate h-7 w-7 object-contain transition-transform group-hover:rotate-12"
          unoptimized
        />
        <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-xl border border-leather-caramel/30 bg-leather-dark px-3 py-1.5 text-[10px] text-parchment-base opacity-0 shadow-2xl transition-all duration-200 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 dark:border-gold-400/30 dark:bg-surface-primary">
          Teyvat Codex
        </span>
      </a>

      <nav
        aria-label="Codex sections"
        className="codex-panel flex flex-col items-center gap-2 rounded-3xl border-2 border-leather-caramel/30 px-1.5 py-3 shadow-2xl dark:border-gold-400/30"
      >
        {PUBLIC_NAV.map((item) => {
          const isActive = activeSection === item.sectionId;
          return (
            <a
              key={item.sectionId}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 codex-focus",
                isActive
                  ? "scale-105 bg-leather-caramel shadow-md dark:bg-gold-400"
                  : "bg-leather-caramel/5 hover:bg-leather-caramel/15 dark:bg-surface-primary/60 dark:hover:bg-gold-400/15"
              )}
            >
              <span className="codex-icon-plate h-9 w-9">
                <Image
                  src={GENSHIN_UI_ICONS[item.icon]}
                  alt=""
                  width={22}
                  height={22}
                  className="codex-icon-on-plate h-5 w-5 object-contain transition-transform group-hover:scale-110"
                  unoptimized
                />
              </span>
              <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-xl border border-leather-caramel/30 bg-leather-dark px-3 py-1.5 text-[10px] font-semibold text-parchment-base opacity-0 shadow-2xl transition-all duration-200 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 dark:border-gold-400/30 dark:bg-surface-primary">
                {item.label}
              </span>
            </a>
          );
        })}

        <div className="my-1 h-px w-6 bg-leather-caramel/30 dark:bg-gold-400/30" />

        <button
          type="button"
          onClick={() => setAnimationsEnabled(!animationsEnabled)}
          aria-pressed={animationsEnabled}
          aria-label={animationsEnabled ? "Disable motion effects" : "Enable motion effects"}
          className="group relative flex h-10 w-10 items-center justify-center rounded-2xl bg-leather-caramel/10 p-2 text-leather-dark transition-all duration-300 hover:scale-105 dark:bg-gold-400/10 dark:text-gold-400 codex-focus"
        >
          <Sparkles className={cn("h-4 w-4", animationsEnabled ? "opacity-100" : "opacity-45")} aria-hidden="true" />
          <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-xl border border-leather-caramel/30 bg-leather-dark px-3 py-1.5 text-[10px] font-semibold text-parchment-base opacity-0 shadow-2xl transition-all duration-200 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 dark:border-gold-400/30 dark:bg-surface-primary">
            {animationsEnabled ? "Motion: on" : "Motion: off"}
          </span>
        </button>

        <Link
          href="/login"
          aria-label="Codex Console"
          className="group relative flex h-10 w-10 items-center justify-center rounded-2xl bg-leather-caramel/10 transition-all duration-300 hover:scale-105 dark:bg-gold-400/10 codex-focus"
        >
          <span className="codex-icon-plate h-9 w-9">
            <Image
              src={GENSHIN_UI_ICONS.archive}
              alt=""
              width={20}
              height={20}
              className="codex-icon-on-plate h-5 w-5 object-contain"
              unoptimized
            />
          </span>
          <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-xl border border-leather-caramel/30 bg-leather-dark px-3 py-1.5 text-[10px] font-semibold text-parchment-base opacity-0 shadow-2xl transition-all duration-200 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 dark:border-gold-400/30 dark:bg-surface-primary">
            Codex Console
          </span>
        </Link>
      </nav>

      <div className="flex items-center gap-1.5 rounded-full border border-leather-caramel/30 bg-parchment-base/95 px-3 py-1 shadow-md dark:border-gold-400/25 dark:bg-surface-primary/90">
        <span className="h-1.5 w-1.5 rounded-full bg-jade-400 animate-pulse" />
        <span className="tabular-nums text-[9px] font-bold text-leather-dark dark:text-platinum-200">
          {time || "--:--"}
        </span>
      </div>
    </aside>
  );
}
