"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { TEYVAT_ELEMENTS, getElementByKey, type ElementAsset } from "@/lib/element-assets";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { cn } from "@/lib/utils";
import { EASE_CODEX } from "@/lib/motion-variants";

interface HeroDossierCardProps {
  name: string;
  tagline: string;
  bio: string;
  /** Traveler portrait from the site config; the chip is hidden when unset. */
  avatar?: string;
}

/** The two traveler presets the switcher toggles between. */
const CHARACTERS = {
  aether: {
    title: "Aether",
    figure: "/characters/aether_figure.png",
    figureAlt: "Aether Character Diorama",
    paragraphs: [
      "He is a curious and adventurous soul, with a strong sense of justice. Aether is also a talented fighter, capable of wielding multiple elements to protect those he cares about.",
      "Despite his predicament, Aether remains determined to find his sister and reunite with her. He sets out on a journey across Teyvat, meeting new friends and allies along the way. He is always willing to fight for what he believes in, to stand up for those who are weaker.",
    ],
  },
  lumine: {
    title: "Lumine",
    figure: "/characters/lumine_figure.png",
    figureAlt: "Lumine Character Diorama",
    paragraphs: [
      "She is a mysterious and intrepid wanderer, with sharp insight and unwavering resolve. Lumine wields the boundless power of elemental resonance to defend what is precious.",
      "Carrying memories of celestial realms across the cosmos, Lumine charts an uncharted path across Teyvat. She stands firm through trials and storms, seeking the hidden truths of the world.",
    ],
  },
} as const;

type CharacterKey = keyof typeof CHARACTERS;

/**
 * Traveler Star Watermark Crest (1:1 vector reconstruction from ref2.png)
 */
function TravelerStarWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Central 4-pointed Primogem Diamond */}
        <polygon
          points="100,28 116,84 172,100 116,116 100,172 84,116 28,100 84,84"
          fill="currentColor"
          fillOpacity="0.18"
        />
        {/* Inner Diamond Core */}
        <polygon
          points="100,56 109,91 144,100 109,109 100,144 91,109 56,100 91,91"
          fill="none"
          strokeWidth="2"
        />
        {/* Surrounding Flourish Wings & Arcs */}
        <path d="M48,48 C70,62 82,78 88,88" strokeWidth="2.5" />
        <path d="M152,48 C130,62 118,78 112,88" strokeWidth="2.5" />
        <path d="M48,152 C70,138 82,122 88,112" strokeWidth="2.5" />
        <path d="M152,152 C130,138 118,122 112,112" strokeWidth="2.5" />
        {/* Outer Orbital Ring Segment */}
        <circle cx="100" cy="100" r="82" strokeWidth="1.5" strokeDasharray="6 8" />
      </g>
    </svg>
  );
}

/** Single elemental vision rune inside the fragment accordion. */
function ElementRuneButton({
  element,
  active,
  onSelect,
}: {
  element: ElementAsset;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      title={`${element.name} Vision · ${element.domain}`}
      className={cn(
        "w-8 h-8 rounded-2xl flex items-center justify-center p-1 transition-all",
        active
          ? "bg-gold-50/25 ring-2 ring-gold-50 scale-110"
          : "opacity-75 hover:opacity-100 hover:scale-105 hover:bg-gold-50/10",
      )}
    >
      <Image
        src={element.whiteIcon}
        alt={element.name}
        width={22}
        height={22}
        className="codex-icon-on-plate object-contain"
        unoptimized
      />
    </button>
  );
}

export function HeroDossierCard({ name, tagline, bio, avatar }: HeroDossierCardProps) {
  const [character, setCharacter] = useState<CharacterKey>("aether");
  const [activeElementKey, setActiveElementKey] = useState("anemo");
  const [accordions, setAccordions] = useState({
    fragment: true,
    wishful: false,
    memory: true,
    myriad: true,
  });

  const toggleAccordion = (key: keyof typeof accordions) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copy = CHARACTERS[character];
  const selectedElement = getElementByKey(activeElementKey);

  return (
    <div className="relative w-full rounded-3xl border-2 border-leather-caramel/35 bg-parchment-subtle dark:bg-deep-space dark:border-gold-400/40 shadow-2xl overflow-hidden select-none transition-colors duration-500">
      {/* ─── Hanging Saddle Leather Bookmark Ribbon with Heart (ref2.png) ─── */}
      <span className="bookmark-ribbon" aria-hidden="true">
        <Heart className="h-4 w-4 fill-current" />
      </span>

      {/* ─── Main Two-Column Master Layout (Parchment Canvas + Cognac Panel) ─── */}
      <div className="flex flex-col lg:flex-row min-h-[580px] lg:min-h-[640px]">
        {/* ════════════════════════════════════════════════════════════════════════
            LEFT: PARCHMENT CANVAS
           ════════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col relative bg-parchment-subtle dark:bg-deep-space transition-colors duration-500">
          {/* Top Header Bar inside Parchment Canvas */}
          <div className="relative flex items-center justify-between px-6 sm:px-10 pt-5 pb-3">
            {/* Top-Left: Deep Espresso Medallion Seal Badge */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold-900 border-2 border-leather-caramel/60 dark:border-gold-400/60 flex items-center justify-center p-1.5 shadow-md">
                <Image
                  src={GENSHIN_UI_ICONS.archive}
                  alt="Teyvat Archive"
                  width={22}
                  height={22}
                  className="codex-icon-on-plate object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Hairline Horizontal Rule stretching across the top */}
            <div className="absolute left-18 sm:left-24 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-leather-caramel/25 dark:bg-gold-400/25" />

            {/* Top-Right: Character Switcher (LUMINE ◄► AETHER).
                `pr-20` keeps the labels clear of the hanging bookmark ribbon,
                which is pinned at `right: 28px` with a 44px width. */}
            <div className="relative z-10 flex items-center gap-4 bg-parchment-subtle pl-4 pr-20 sm:gap-6 dark:bg-deep-space">
              <button
                type="button"
                onClick={() => setCharacter("lumine")}
                className={cn(
                  "font-serif text-xs sm:text-sm tracking-[0.2em] uppercase transition-all pb-0.5",
                  character === "lumine"
                    ? "text-leather-dark dark:text-platinum-50 font-extrabold border-b-2 border-leather-caramel dark:border-gold-400"
                    : "text-leather-muted/70 dark:text-platinum-300/70 hover:text-leather-dark dark:hover:text-platinum-50 font-bold",
                )}
              >
                Lumine
              </button>

              <span className="text-leather-caramel/60 dark:text-gold-400/60 font-serif text-xs tracking-tighter select-none">
                ◄►
              </span>

              <button
                type="button"
                onClick={() => setCharacter("aether")}
                className={cn(
                  "font-serif text-xs sm:text-sm tracking-[0.2em] uppercase transition-all pb-0.5",
                  character === "aether"
                    ? "text-leather-dark dark:text-platinum-50 font-extrabold border-b-2 border-leather-caramel dark:border-gold-400"
                    : "text-leather-muted/70 dark:text-platinum-300/70 hover:text-leather-dark dark:hover:text-platinum-50 font-bold",
                )}
              >
                Aether
              </button>
            </div>
          </div>

          {/* ── Center Stage: Character + Typography ── */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 relative px-6 sm:px-10 pb-8 pt-2 items-center gap-6 lg:gap-8">
            {/* Watermark Crest (Bottom-Right of Parchment Canvas, ref2.png) */}
            <div className="pointer-events-none absolute right-4 sm:right-8 bottom-4 w-64 h-64 sm:w-80 sm:h-80 text-leather-caramel dark:text-gold-400 opacity-20 dark:opacity-15 -z-0">
              <TravelerStarWatermark className="w-full h-full" />
            </div>

            {/* Left Column (5 cols): 3D Character Diorama Figure */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">
              {/* Element Atmosphere Ambient Glow */}
              <div
                className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: selectedElement.color }}
              />

              <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] flex items-center justify-center group">
                {/* Offset sepia silhouette cast behind the figure */}
                <div aria-hidden="true" className="figure-shadow-layer flex items-center justify-center">
                  <Image
                    src={copy.figure}
                    alt=""
                    width={460}
                    height={560}
                    className="object-contain max-h-[380px] sm:max-h-[460px] lg:max-h-[520px]"
                    unoptimized
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${character}-stage`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: EASE_CODEX }}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={copy.figure}
                      alt={copy.figureAlt}
                      width={460}
                      height={560}
                      priority
                      className="object-contain max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column (7 cols): Editorial Typography & Bio (ref2.png) */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4 relative z-10">
              {/* Category / Japanese Kanji Subtitle */}
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm sm:text-base tracking-[0.2em] text-leather-muted dark:text-platinum-200 font-medium">
                  The Traveler //
                </span>
                <span className="font-serif text-base sm:text-lg text-leather-dark dark:text-platinum-50 font-bold">
                  旅人
                </span>
              </div>

              {/* Main Title: Large High-Contrast Serif */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-leather-dark dark:text-platinum-50 leading-none capitalize">
                {copy.title}
              </h1>

              {/* Editorial Paragraphs with Solid Cognac Accent Box (ref2.png) */}
              <div className="flex items-start gap-3 sm:gap-4 pt-1">
                {/* Vertical Solid Cognac Accent Box */}
                <div className="w-6 sm:w-7 h-14 sm:h-16 bg-leather-caramel dark:bg-gold-400 shrink-0 mt-1 shadow-sm" />

                {/* Paragraph Content */}
                <div className="space-y-3 font-body text-xs sm:text-[13px] lg:text-[14px] leading-relaxed text-leather-muted dark:text-platinum-200">
                  {copy.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Identity & Traveler Actions */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-leather-caramel/30 dark:border-gold-400/30 mt-2">
                <div className="flex items-center gap-2.5">
                  {avatar && (
                    <Image
                      src={avatar}
                      alt={name}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover border border-leather-caramel/40 dark:border-gold-400/40"
                      unoptimized
                    />
                  )}
                  <span
                    className="font-serif text-[11px] font-bold text-leather-dark dark:text-platinum-50 uppercase tracking-[0.18em]"
                    title={bio}
                  >
                    {name}
                  </span>
                  <span className="text-leather-caramel dark:text-gold-400 text-xs">•</span>
                  <span className="font-body text-[10px] text-leather-muted dark:text-platinum-200" title={bio}>
                    {tagline}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href="#projects"
                    className="px-4 py-2 font-serif text-[11px] font-bold tracking-widest uppercase bg-leather-caramel dark:bg-gold-400 text-parchment-base dark:text-deep-space hover:bg-leather-caramel/90 dark:hover:bg-gold-400/90 rounded-full shadow-sm transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Explore Domains</span>
                  </a>
                  <a
                    href="#contact"
                    className="px-4 py-2 font-serif text-[11px] font-bold tracking-widest uppercase border border-leather-caramel dark:border-gold-400 text-leather-dark dark:text-platinum-50 hover:bg-leather-caramel/10 dark:hover:bg-gold-400/10 rounded-full transition-all"
                  >
                    <span>Summon</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            RIGHT: WARM COGNAC SADDLE LEATHER PANEL (ref2.png)
           ════════════════════════════════════════════════════════════════════════ */}
        <div className="cognac-panel w-full lg:w-[260px] xl:w-[280px] flex flex-col justify-between p-5 sm:p-6 relative shrink-0">
          <div className="space-y-4 pt-10 sm:pt-12 lg:pt-14">
            {/* 1. Fragment Accordion (7 Elemental Vision Runes) */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("fragment")}
                aria-expanded={accordions.fragment}
                className="w-full flex items-center justify-between font-serif text-xs font-bold tracking-[0.2em] uppercase text-gold-50 hover:text-gold-100 transition-colors text-left"
              >
                <span>Fragment</span>
                <span className="font-serif text-sm font-bold">
                  {accordions.fragment ? "−" : "+"}
                </span>
              </button>

              {/* Hairline Divider */}
              <div className="h-[1px] bg-gold-50/20 mt-1.5 mb-3" />

              {accordions.fragment && (
                <div className="space-y-2 pt-0.5">
                  {/* Row 1: Pyro, Hydro, Anemo, Electro (4 runes) */}
                  <div className="grid grid-cols-4 gap-2 justify-items-center">
                    {TEYVAT_ELEMENTS.slice(0, 4).map((element) => (
                      <ElementRuneButton
                        key={element.key}
                        element={element}
                        active={element.key === selectedElement.key}
                        onSelect={() => setActiveElementKey(element.key)}
                      />
                    ))}
                  </div>

                  {/* Row 2: Dendro, Cryo, Geo (3 runes) */}
                  <div className="grid grid-cols-4 gap-2 justify-items-center">
                    {TEYVAT_ELEMENTS.slice(4, 7).map((element) => (
                      <ElementRuneButton
                        key={element.key}
                        element={element}
                        active={element.key === selectedElement.key}
                        onSelect={() => setActiveElementKey(element.key)}
                      />
                    ))}
                    {/* Empty 4th cell to balance grid */}
                    <div className="w-8 h-8" />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Wishful Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("wishful")}
                aria-expanded={accordions.wishful}
                className="w-full flex items-center justify-between font-serif text-xs font-bold tracking-[0.2em] uppercase text-gold-50 hover:text-gold-100 transition-colors text-left"
              >
                <span>Wishful</span>
                <span className="font-serif text-sm font-bold">
                  {accordions.wishful ? "−" : "+"}
                </span>
              </button>

              {/* Hairline Divider */}
              <div className="h-[1px] bg-gold-50/20 mt-1.5 mb-2" />

              {accordions.wishful && (
                <div className="cognac-card-subtle rounded-2xl p-3 space-y-1">
                  <div className="flex items-center gap-2 text-gold-100 text-[10px]">
                    <span>★★★★★</span>
                    <span className="font-serif text-[9px] font-bold text-gold-50/80 tracking-wider uppercase">
                      Event Wish
                    </span>
                  </div>
                  <p className="font-serif font-bold text-gold-50 text-xs">
                    Aether HUD Portfolio
                  </p>
                  <p className="font-body text-gold-50/75 text-[10px] leading-tight">
                    Forged for grand-scale web architecture and AI engineering systems.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Memory Accordion (Latin Lore Motto) */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("memory")}
                aria-expanded={accordions.memory}
                className="w-full flex items-center justify-between font-serif text-xs font-bold tracking-[0.2em] uppercase text-gold-50 hover:text-gold-100 transition-colors text-left"
              >
                <span>Memory</span>
                <span className="font-serif text-sm font-bold">
                  {accordions.memory ? "−" : "+"}
                </span>
              </button>

              {/* Hairline Divider */}
              <div className="h-[1px] bg-gold-50/20 mt-1.5 mb-2" />

              {accordions.memory && (
                <div className="cognac-card-subtle rounded-2xl p-3 text-xs font-serif italic text-gold-100/90 leading-relaxed">
                  memoria nostra sit aeterna, quam nullus in hoc mundo pereat
                </div>
              )}
            </div>

            {/* 4. Myriad Accordion (Tech Stack Tags) */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("myriad")}
                aria-expanded={accordions.myriad}
                className="w-full flex items-center justify-between font-serif text-xs font-bold tracking-[0.2em] uppercase text-gold-50 hover:text-gold-100 transition-colors text-left"
              >
                <span>Myriad</span>
                <span className="font-serif text-sm font-bold">
                  {accordions.myriad ? "−" : "+"}
                </span>
              </button>

              {/* Hairline Divider */}
              <div className="h-[1px] bg-gold-50/20 mt-1.5 mb-2" />

              {accordions.myriad && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Kotobukiya", "Figures", "Genshin Impact", "JPY"].map((tag) => (
                    <span
                      key={tag}
                      className="cognac-card-subtle px-2.5 py-0.5 rounded-full text-[10px] font-body text-gold-50 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panel Footer Metadata */}
          <div className="pt-4 mt-auto border-t border-gold-50/20 text-[10px] font-serif text-gold-50/80 flex items-center justify-between">
            <span>Vision: {selectedElement.name}</span>
            <span className="text-gold-100 font-bold">AR 60</span>
          </div>
        </div>
      </div>
    </div>
  );
}
