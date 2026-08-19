"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { TEYVAT_ELEMENTS } from "@/lib/element-assets";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { cn } from "@/lib/utils";

interface HeroDossierProps {
  name?: string;
  tagline?: string;
  bio?: string;
}

export function HeroDossierCard({
  name = "Bahrul Ulumul Haq",
  tagline = "Full-Stack Architect & AI Systems Engineer",
  bio = "A digital wanderer across seven distributed realms, weaving resilient web architectures, neural intelligence systems, and high-precision tactical interfaces.",
}: HeroDossierProps) {
  const [character, setCharacter] = useState<"aether" | "lumine">("aether");
  const [activeElementKey, setActiveElementKey] = useState("pyro");
  const [activeAccordions, setActiveAccordions] = useState({
    fragment: true,
    wishful: false,
    memory: true,
    myriad: true,
  });

  const toggleAccordion = (key: keyof typeof activeAccordions) => {
    setActiveAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedElement = TEYVAT_ELEMENTS.find((el) => el.key === activeElementKey) || TEYVAT_ELEMENTS[0];

  return (
    <div className="relative w-full max-w-7xl mx-auto my-4 rounded-3xl parchment-panel dark:glass-panel border-2 border-leather-caramel/35 dark:border-gold-400/40 shadow-2xl overflow-hidden select-none transition-colors duration-500">
      {/* Background Watermark Crest & Starfield */}
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-leather-caramel/5 dark:bg-gold-400/5 blur-3xl" />

      {/* Hanging Top-Right Bookmark Ribbon with Heart Cut-out */}
      <div
        className="bookmark-ribbon"
        title="Teyvat Codex Sealed Ribbon"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#A06C42] to-[#7B4E28] dark:from-gold-500 dark:to-gold-700 shadow-md" />
        <div className="relative z-10 flex flex-col items-center pt-2 text-[#FAF7EE] dark:text-deep-space">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span className="text-[7px] font-mono font-bold tracking-tighter mt-1">SEAL</span>
        </div>
      </div>

      {/* ─── Top Nav Bar inside Dossier Card ─── */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-4 sm:py-5 border-b border-leather-caramel/25 dark:border-gold-400/20 bg-parchment-base/95 dark:bg-surface-primary/70">
        {/* Left: Gilded Medallion Emblem with Genshin Archive Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-leather-caramel/15 dark:bg-gold-400/20 border-2 border-leather-caramel/50 dark:border-gold-400/60 flex items-center justify-center p-1.5 shadow-inner">
            <Image
              src={GENSHIN_UI_ICONS.archive}
              alt="Teyvat Archive"
              width={24}
              height={24}
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <span className="font-display text-xs font-bold tracking-[0.25em] text-[#1E1208] dark:text-platinum-100 uppercase block">
              TEYVAT CODEX // ARCHIVE
            </span>
            <span className="font-mono text-[9px] text-[#5E412A] dark:text-text-muted tracking-wider font-bold">
              DOC NO. 07-EXPEDITION
            </span>
          </div>
        </div>

        {/* Center: Character Switcher (LUMINE ◄► AETHER) */}
        <div className="flex items-center gap-1 bg-parchment-elevated/90 dark:bg-surface-primary p-1 rounded-full border border-leather-caramel/35 dark:border-gold-400/30 shadow-inner">
          <button
            type="button"
            onClick={() => setCharacter("lumine")}
            className={`px-4 py-1.5 rounded-full font-display text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 ${
              character === "lumine"
                ? "bg-[#8C6239] dark:bg-gold-400 text-[#FAF7EE] dark:text-deep-space shadow-md scale-102"
                : "text-[#5E412A] dark:text-text-muted hover:text-[#1E1208] dark:hover:text-platinum-100"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>LUMINE</span>
          </button>
          <span className="text-leather-caramel/30 dark:text-text-muted/40 text-xs">|</span>
          <button
            type="button"
            onClick={() => setCharacter("aether")}
            className={`px-4 py-1.5 rounded-full font-display text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 ${
              character === "aether"
                ? "bg-[#8C6239] dark:bg-gold-400 text-[#FAF7EE] dark:text-deep-space shadow-md scale-102"
                : "text-[#5E412A] dark:text-text-muted hover:text-[#1E1208] dark:hover:text-platinum-100"
            }`}
          >
            <span>AETHER</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right spacing to balance hanging ribbon */}
        <div className="w-12 hidden sm:block" />
      </div>

      {/* ─── Main 3-Column Dossier Body ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* ── Left & Center Columns (9 cols in light parchment) ── */}
        <div className="lg:col-span-8 xl:col-span-8 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Column 1 (5 cols): Character 3D Diorama Figure */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[440px] sm:min-h-[500px]">
            {/* Subtle Ambient Shadow Glow */}
            <div
              className="absolute w-64 h-64 rounded-full blur-2xl opacity-25 transition-all duration-700 pointer-events-none"
              style={{ backgroundColor: selectedElement.color }}
            />

            <div className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center group">
              {/* AETHER FIGURE LAYER */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  character === "aether"
                    ? "opacity-100 scale-100 z-10 pointer-events-auto"
                    : "opacity-0 scale-95 z-0 pointer-events-none"
                )}
              >
                {/* Back Layer Silhouette */}
                <div className="absolute inset-0 flex items-center justify-center opacity-25 filter grayscale contrast-150 transform -translate-x-3 -translate-y-2 pointer-events-none">
                  <Image
                    src="/characters/aether_figure.png"
                    alt="Aether Shadow"
                    width={400}
                    height={500}
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
                {/* Main Figure */}
                <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src="/characters/aether_figure.png"
                    alt="Aether Figure"
                    width={420}
                    height={520}
                    className="object-contain drop-shadow-[0_16px_24px_rgba(60,42,30,0.35)]"
                    priority
                    unoptimized
                  />
                </div>
              </div>

              {/* LUMINE FIGURE LAYER */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  character === "lumine"
                    ? "opacity-100 scale-100 z-10 pointer-events-auto"
                    : "opacity-0 scale-95 z-0 pointer-events-none"
                )}
              >
                {/* Back Layer Silhouette */}
                <div className="absolute inset-0 flex items-center justify-center opacity-25 filter grayscale contrast-150 transform -translate-x-3 -translate-y-2 pointer-events-none">
                  <Image
                    src="/characters/lumine_figure.png"
                    alt="Lumine Shadow"
                    width={400}
                    height={500}
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
                {/* Main Figure */}
                <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src="/characters/lumine_figure.png"
                    alt="Lumine Figure"
                    width={420}
                    height={520}
                    className="object-contain drop-shadow-[0_16px_24px_rgba(60,42,30,0.35)]"
                    priority
                    unoptimized
                  />
                </div>
              </div>

              {/* Rarity Star Bar Below Figure */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#FAF7EE]/95 dark:bg-black/85 px-4 py-1.5 rounded-full border-2 border-[#8C6239]/40 dark:border-gold-400/40 backdrop-blur-md z-20 shadow-lg">
                <span className="text-[#DFAE2A] dark:text-gold-400 text-sm tracking-tight drop-shadow-[0_0_4px_rgba(201,154,78,0.8)]">
                  ★★★★★
                </span>
                <span className="font-display text-[10px] text-[#1E1208] dark:text-gold-200 font-bold ml-1 tracking-wider uppercase">
                  5-STAR TRAVELER
                </span>
              </div>
            </div>
          </div>

          {/* Column 2 (7 cols): Editorial Bio & Title */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Subtitle with Japanese Kanji (1:1 from ref2.png) */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-sm tracking-[0.2em] text-[#8C6239] dark:text-gold-400 font-bold">
                  The Traveler //
                </span>
                <span className="font-serif text-base text-[#1E1208] dark:text-gold-300 font-bold">
                  旅人
                </span>
              </div>

              {/* Huge Serif Title with Intersecting Leather Accent Box (1:1 from ref2.png) */}
              <div className="relative my-2 inline-block">
                <div className="absolute -left-2 top-2 bottom-2 w-7 bg-[#8C6239]/25 dark:bg-gold-400/20 -z-0 rounded-md" />
                <h1 className="relative z-10 font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1E1208] dark:text-platinum-50 capitalize drop-shadow-sm">
                  {character === "aether" ? "Aether" : "Lumine"}
                </h1>
              </div>

              {/* Developer Identity Subheading */}
              <div className="flex items-center gap-2 mt-1 mb-4 flex-wrap">
                <span className="font-mono text-xs font-bold tracking-wider text-[#8C6239] dark:text-gold-400 uppercase">
                  {name}
                </span>
                <span className="text-leather-caramel/50 dark:text-text-muted/50 text-xs">•</span>
                <span className="font-mono text-xs text-[#5E412A] dark:text-text-muted font-bold">
                  {tagline}
                </span>
              </div>

              {/* Editorial Bio Text */}
              <div className="space-y-3 font-body text-sm leading-relaxed text-[#1E1208] dark:text-platinum-200">
                <p className="font-medium">
                  {character === "aether"
                    ? "He is a calm and collected traveler with an innate mastery over seven elemental domains. Capable of architecting massive distributed systems, high-speed neural pipelines, and fail-closed security perimeters."
                    : "She is a resolute and visionary architect navigating complex software topologies. Bringing unmatched precision to full-stack engineering, reactive HUD interfaces, and cloud-native services."}
                </p>
                <p className="text-xs text-[#5E412A] dark:text-text-muted italic border-l-2 border-[#8C6239]/60 pl-3">
                  {bio}
                </p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-leather-caramel/25 dark:border-gold-400/15">
              <a
                href="#contact"
                className="genshin-btn-primary px-6 py-3 font-display text-xs font-bold tracking-widest uppercase shadow-md hover:opacity-95 transition-all inline-flex items-center gap-2"
              >
                <div className="w-4 h-4 relative">
                  <Image
                    src={GENSHIN_UI_ICONS.wish}
                    alt="Wish"
                    width={16}
                    height={16}
                    className="object-contain brightness-0"
                  />
                </div>
                <span>SUMMON ARCHITECT</span>
              </a>
              <a
                href="#projects"
                className="genshin-btn-secondary px-5 py-3 font-display text-xs font-bold tracking-widest uppercase hover:bg-leather-caramel/10 transition-all inline-flex items-center gap-2"
              >
                <div className="w-4 h-4 relative">
                  <Image
                    src={GENSHIN_UI_ICONS.domain}
                    alt="Domains"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <span>EXPLORE DOMAINS</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Column 3 (4 cols): Rich Warm Cognac Leather Panel (1:1 with ref2.png) ── */}
        <div className="lg:col-span-4 xl:col-span-4 cognac-panel p-6 sm:p-8 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-leather-caramel/30 dark:border-gold-400/20">
          {/* 1. Fragment Accordion (7 Elements Grid) */}
          <div className="border-b border-white/20 pb-3">
            <button
              type="button"
              onClick={() => toggleAccordion("fragment")}
              className="w-full flex items-center justify-between font-display text-xs font-bold text-[#FAF7EE] tracking-wider uppercase mb-2 text-left"
            >
              <span>fragment</span>
              <span className="font-mono text-[#FDF2CA] text-sm font-bold">
                {activeAccordions.fragment ? "−" : "+"}
              </span>
            </button>
            {activeAccordions.fragment && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {TEYVAT_ELEMENTS.map((elem) => {
                  const isActive = elem.key === activeElementKey;
                  return (
                    <button
                      key={elem.key}
                      type="button"
                      onClick={() => setActiveElementKey(elem.key)}
                      title={`Vision: ${elem.name} — ${elem.domain}`}
                      className={`relative p-1.5 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-black/30 border-2 border-white scale-110 shadow-md"
                          : "border border-white/20 bg-black/15 hover:bg-black/25 hover:scale-105 opacity-85 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={isActive ? elem.glowIcon : elem.gildedIcon}
                        alt={elem.name}
                        width={28}
                        height={28}
                        className="object-contain"
                        unoptimized
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Wishful Accordion (Expandable Featured Project Banner) */}
          <div className="border-b border-white/20 pb-3">
            <button
              type="button"
              onClick={() => toggleAccordion("wishful")}
              className="w-full flex items-center justify-between font-display text-xs font-bold text-[#FAF7EE] tracking-wider uppercase text-left"
            >
              <span>wishful</span>
              <span className="font-mono text-[#FDF2CA] text-sm font-bold">
                {activeAccordions.wishful ? "−" : "+"}
              </span>
            </button>
            {activeAccordions.wishful && (
              <div className="mt-2 text-xs space-y-1 font-body text-[#FAF7EE]/90">
                <div className="flex items-center gap-1 text-[#FDF2CA] text-[10px]">
                  <span>★★★★★</span>
                  <span className="font-mono text-[9px] text-[#FAF7EE]/70 ml-1 font-bold">
                    EVENT WISH
                  </span>
                </div>
                <p className="font-display font-bold text-xs text-[#FAF7EE]">
                  Aether HUD // Next-Gen Portfolio
                </p>
                <p className="text-[11px] text-[#FAF7EE]/80">
                  Full-stack game-tier portfolio platform.
                </p>
              </div>
            )}
          </div>

          {/* 3. Memory Accordion (Latin Lore & Architectural Motto) */}
          <div className="border-b border-white/20 pb-3">
            <button
              type="button"
              onClick={() => toggleAccordion("memory")}
              className="w-full flex items-center justify-between font-display text-xs font-bold text-[#FAF7EE] tracking-wider uppercase mb-1 text-left"
            >
              <span>memory</span>
              <span className="font-mono text-[#FDF2CA] text-sm font-bold">
                {activeAccordions.memory ? "−" : "+"}
              </span>
            </button>
            {activeAccordions.memory && (
              <div className="text-xs space-y-1 font-body text-[#FAF7EE]/90 italic pt-1">
                <p className="font-serif text-[#FAF7EE] leading-relaxed">
                  “Memoria nostra sit aeterna, quam nullus in hoc mundo pereat.”
                </p>
                <p className="text-[10px] font-mono not-italic text-[#FDF2CA] font-bold">
                  — May our architectures endure across all worlds.
                </p>
              </div>
            )}
          </div>

          {/* 4. Myriad Accordion (Tech Stack Specifications) */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion("myriad")}
              className="w-full flex items-center justify-between font-display text-xs font-bold text-[#FAF7EE] tracking-wider uppercase mb-2 text-left"
            >
              <span>myriad</span>
              <span className="font-mono text-[#FDF2CA] text-sm font-bold">
                {activeAccordions.myriad ? "−" : "+"}
              </span>
            </button>
            {activeAccordions.myriad && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Prisma v7", "PostgreSQL", "AI Logic"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-[#FAF7EE]/20 border border-[#FAF7EE]/30 text-[10px] font-mono text-[#FAF7EE] font-bold shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
