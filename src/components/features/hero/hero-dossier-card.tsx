"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, Plus, Minus, Sparkles, ExternalLink, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ELEMENT_ICONS } from "../intro-gate";

interface ConfigData {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  status: string;
  sysVersion: string;
}

interface HeroDossierCardProps {
  config: ConfigData;
  activeElement?: string;
  onElementSelect?: (elementKey: string) => void;
}

export function HeroDossierCard({ config, activeElement = "pyro", onElementSelect }: HeroDossierCardProps) {
  const [character, setCharacter] = useState<"aether" | "lumine">("aether");
  const [selectedElement, setSelectedElement] = useState(activeElement);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    fragment: true,
    wishful: false,
    memory: true,
    myriad: true,
  });
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleElementClick = (key: string) => {
    setSelectedElement(key);
    onElementSelect?.(key);
  };

  const isAether = character === "aether";

  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Main Dossier Card Container */}
      <div className="relative overflow-hidden parchment-panel dark:glass-panel chamfered-lg border-2 border-leather-caramel/30 dark:border-gold-400/30 p-6 sm:p-8 lg:p-12 shadow-2xl">
        {/* Top-Right Bookmark Ribbon */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark profile"}
          className={cn(
            "bookmark-ribbon focus:outline-none focus:ring-2 focus:ring-gold-400",
            isBookmarked && "scale-105 shadow-xl"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-all duration-300",
              isBookmarked ? "fill-white text-white scale-125" : "text-white/90"
            )}
          />
        </button>

        {/* Top Header Bar inside Dossier */}
        <div className="flex items-center justify-between border-b border-leather-caramel/20 dark:border-gold-400/20 pb-4 mb-8">
          {/* Left: Emblem Crest */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-leather-caramel/15 dark:bg-gold-400/15 border border-leather-caramel/40 dark:border-gold-400/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-leather-caramel dark:text-gold-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xs font-bold tracking-widest text-leather-dark dark:text-platinum-50 uppercase">
                AETHER DOSSIER
              </span>
              <span className="text-[9px] font-mono tracking-widest text-leather-muted dark:text-text-muted">
                ARCHIVE // TE-2026
              </span>
            </div>
          </div>

          {/* Center/Right: Character Switcher (LUMINE ◀▶ AETHER) */}
          <div className="flex items-center gap-2 sm:gap-4 pr-12 sm:pr-14">
            <button
              onClick={() => setCharacter("lumine")}
              className={cn(
                "font-display text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 pb-0.5",
                !isAether
                  ? "text-leather-dark dark:text-gold-400 font-bold border-b-2 border-leather-caramel dark:border-gold-400 scale-105"
                  : "text-leather-muted/60 dark:text-text-muted/60 hover:text-leather-dark dark:hover:text-gold-400"
              )}
            >
              LUMINE
            </button>

            <div className="flex items-center gap-0.5 text-leather-caramel dark:text-gold-400/80">
              <button
                onClick={() => setCharacter(isAether ? "lumine" : "aether")}
                aria-label="Switch character"
                className="hover:scale-125 transition-transform p-0.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCharacter(isAether ? "lumine" : "aether")}
                aria-label="Switch character"
                className="hover:scale-125 transition-transform p-0.5"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setCharacter("aether")}
              className={cn(
                "font-display text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 pb-0.5",
                isAether
                  ? "text-leather-dark dark:text-gold-400 font-bold border-b-2 border-leather-caramel dark:border-gold-400 scale-105"
                  : "text-leather-muted/60 dark:text-text-muted/60 hover:text-leather-dark dark:hover:text-gold-400"
              )}
            >
              AETHER
            </button>
          </div>
        </div>

        {/* Main Grid: Left Figure + Center Bio + Right Accordion Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Column 1: Layered Character Figure & Silhouette (5 cols on lg) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Background Watermark Crest */}
            <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-64 opacity-10 dark:opacity-5">
              <svg viewBox="0 0 200 200" fill="currentColor" className="text-leather-caramel dark:text-gold-400 w-full h-full">
                <path d="M100 0 L120 70 L190 75 L135 120 L155 190 L100 145 L45 190 L65 120 L10 75 L80 70 Z" />
              </svg>
            </div>

            {/* Character Figure Container */}
            <div className="relative w-full max-w-[320px] aspect-[3/4] flex items-center justify-center">
              {/* Back Wireframe / Shadow Silhouette layer */}
              <motion.div
                key={`shadow-${character}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.25, x: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-0 flex items-center justify-center"
              >
                <div
                  className={cn(
                    "w-full h-full rounded-2xl bg-gradient-to-tr filter blur-[2px] opacity-40 transform -translate-x-3 -translate-y-2",
                    isAether
                      ? "from-amber-600/40 via-amber-400/20 to-transparent"
                      : "from-blue-600/40 via-cyan-400/20 to-transparent"
                  )}
                />
              </motion.div>

              {/* Character Avatar / Graphic */}
              <motion.div
                key={`figure-${character}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full h-full flex flex-col items-center justify-center"
              >
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-leather-caramel/40 dark:border-gold-400/40 p-2 shadow-2xl bg-gradient-to-b from-leather-caramel/10 to-transparent dark:from-gold-400/10">
                  <div className="w-full h-full rounded-full overflow-hidden bg-leather-caramel/5 dark:bg-surface-primary flex items-center justify-center relative">
                    <img
                      src={config.avatar || "/avatar.jpg"}
                      alt={config.name}
                      className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-leather-dark/60 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Persona Mode Badge */}
                <div className="mt-4 px-4 py-1.5 chamfered-xs bg-parchment-subtle dark:bg-surface-primary border border-leather-caramel/30 dark:border-gold-400/30 text-center shadow-md">
                  <span className="font-mono text-[10px] tracking-widest text-leather-caramel dark:text-gold-400 font-bold uppercase">
                    {isAether ? "ARCHITECT // ENGINEER" : "CREATIVE // RESEARCHER"}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Column 2 & 3: Character Bio & Interactive Sidebar (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Title Block */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm tracking-wider text-leather-muted dark:text-text-muted">
                  The Traveler // 旅人
                </span>
                <span className="text-xs font-mono text-leather-caramel dark:text-gold-400 font-bold">
                  [LEVEL 99]
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-leather-dark dark:text-platinum-50 mt-1 uppercase">
                {isAether ? "Aether" : "Lumine"}
                <span className="block text-xl sm:text-2xl font-serif tracking-normal text-leather-muted dark:text-text-muted mt-1 lowercase font-normal">
                  ({config.name})
                </span>
              </h1>

              {/* Tagline / Subtitle */}
              <p className="font-mono text-xs sm:text-sm text-leather-caramel dark:text-gold-400 mt-2 tracking-wide font-semibold">
                {config.tagline || "Full-Stack Architect & AI Systems Engineer"}
              </p>

              {/* Bio Narrative */}
              <div className="mt-4 space-y-3 font-body text-sm leading-relaxed text-leather-muted dark:text-text-muted">
                <p>
                  {isAether
                    ? config.bio ||
                      "A curious and adventurous builder with a profound dedication to engineering high-performance digital experiences. Proficient in wielding multiple modern technologies to design resilient systems and interactive AI platforms."
                    : "A visionary digital explorer journeying across the software universe. Specializing in intuitive frontend craft, responsive full-stack architectures, and immersive cybernetic interfaces."}
                </p>
                <p className="text-xs italic opacity-85">
                  "Seeking to connect complex intelligence with elegant design, standing up for exceptional user experiences across all platforms."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="tactical-btn btn-glow-sweep px-6 py-2.5 bg-leather-caramel dark:bg-gold-400 text-parchment-base dark:text-deep-space font-mono text-xs tracking-wider font-bold shadow-md hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EXPLORE MISSIONS</span>
                </a>
                <a
                  href="#contact"
                  className="tactical-btn px-6 py-2.5 border border-leather-caramel/40 dark:border-gold-400/40 bg-parchment-subtle dark:bg-surface-primary text-leather-dark dark:text-gold-400 font-mono text-xs tracking-wider font-bold hover:bg-leather-caramel/10 transition-all inline-flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>SUMMON DEVELOPER</span>
                </a>
              </div>
            </div>

            {/* Interactive Accordions / Widgets (fragment, wishful, memory, myriad) */}
            <div className="space-y-4 pt-4 border-t border-leather-caramel/20 dark:border-gold-400/20">
              {/* 1. Fragment Widget (7 Elemental Glyphs) */}
              <div className="border-b border-leather-caramel/15 dark:border-gold-400/15 pb-3">
                <button
                  onClick={() => toggleSection("fragment")}
                  className="w-full flex items-center justify-between font-mono text-xs tracking-widest text-leather-dark dark:text-platinum-100 uppercase hover:text-leather-caramel transition-colors"
                >
                  <span className="font-bold">fragment</span>
                  <span>{openSections.fragment ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}</span>
                </button>

                <AnimatePresence>
                  {openSections.fragment && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-3"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                        {ELEMENT_ICONS.map((el) => {
                          const isSel = selectedElement === el.key;
                          return (
                            <button
                              key={el.key}
                              onClick={() => handleElementClick(el.key)}
                              aria-label={`Select ${el.name} vision`}
                              className={cn(
                                "w-8 h-8 chamfered-xs flex items-center justify-center transition-all duration-300 border",
                                isSel
                                  ? "scale-110 shadow-md"
                                  : "opacity-65 hover:opacity-100"
                              )}
                              style={{
                                borderColor: isSel ? el.color : "rgba(140, 98, 57, 0.25)",
                                backgroundColor: isSel ? `${el.color}25` : "rgba(140, 98, 57, 0.06)",
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                                style={{ color: el.color }}
                              >
                                <path d={el.path} />
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Wishful Widget (Expandable Deployment Banner) */}
              <div className="border-b border-leather-caramel/15 dark:border-gold-400/15 pb-3">
                <button
                  onClick={() => toggleSection("wishful")}
                  className="w-full flex items-center justify-between font-mono text-xs tracking-widest text-leather-dark dark:text-platinum-100 uppercase hover:text-leather-caramel transition-colors"
                >
                  <span className="font-bold">wishful // featured mission</span>
                  <span>{openSections.wishful ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}</span>
                </button>

                <AnimatePresence>
                  {openSections.wishful && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-3"
                    >
                      <div className="p-3 chamfered-xs bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/30 dark:border-gold-400/30 flex items-center justify-between">
                        <div>
                          <p className="font-display text-xs font-bold text-leather-dark dark:text-platinum-50 uppercase">
                            AniVerse AI Studio (5★ Banner)
                          </p>
                          <p className="text-[11px] font-body text-leather-muted dark:text-text-muted mt-0.5">
                            Real-time neural generation & anime marketplace.
                          </p>
                        </div>
                        <a
                          href="https://aniverse-one-khaki.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 chamfered-xs bg-leather-caramel dark:bg-gold-400 text-parchment-base dark:text-deep-space text-[10px] font-mono font-bold inline-flex items-center gap-1 hover:scale-105 transition-transform"
                        >
                          <span>VISIT</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Memory Widget (Lore quotation) */}
              <div className="border-b border-leather-caramel/15 dark:border-gold-400/15 pb-3">
                <button
                  onClick={() => toggleSection("memory")}
                  className="w-full flex items-center justify-between font-mono text-xs tracking-widest text-leather-dark dark:text-platinum-100 uppercase hover:text-leather-caramel transition-colors"
                >
                  <span className="font-bold">memory</span>
                  <span>{openSections.memory ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}</span>
                </button>

                <AnimatePresence>
                  {openSections.memory && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-2"
                    >
                      <p className="font-serif italic text-xs text-leather-muted dark:text-text-muted leading-relaxed">
                        "Memoria nostra sit aeterna, quam nullus in hoc mundo pereat."
                      </p>
                      <p className="text-[10px] font-mono text-leather-caramel dark:text-gold-400/80 mt-1">
                        // May our memories be eternal, and nothing in this world be lost.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. Myriad Widget (Specification Tags) */}
              <div>
                <button
                  onClick={() => toggleSection("myriad")}
                  className="w-full flex items-center justify-between font-mono text-xs tracking-widest text-leather-dark dark:text-platinum-100 uppercase hover:text-leather-caramel transition-colors"
                >
                  <span className="font-bold">myriad</span>
                  <span>{openSections.myriad ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}</span>
                </button>

                <AnimatePresence>
                  {openSections.myriad && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-2.5"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {["Next.js 16", "TypeScript", "AI Agents", "Tailwind v4", "PostgreSQL", "Prisma v7", "Teyvat HUD", "Framer Motion"].map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 chamfered-xs bg-parchment-subtle dark:bg-surface-primary border border-leather-caramel/25 dark:border-gold-400/25 text-leather-dark dark:text-platinum-200 text-[10px] font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
