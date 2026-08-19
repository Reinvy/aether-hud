"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, Heart, ExternalLink } from "lucide-react";
import { TEYVAT_ELEMENTS } from "@/lib/element-assets";
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
    <div className="relative w-full max-w-6xl mx-auto my-6 parchment-panel dark:glass-panel chamfered border-2 border-leather-caramel/40 dark:border-gold-400/40 shadow-2xl overflow-hidden select-none transition-colors duration-500">
      {/* Background Watermark Crest & Starfield */}
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-20" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-leather-caramel/5 dark:bg-gold-400/5 blur-3xl" />

      {/* Hanging Top-Right Bookmark Ribbon with Heart Cut-out */}
      <div
        className="bookmark-ribbon"
        title="Teyvat Codex Sealed Ribbon"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-leather-caramel to-[#6A4725] dark:from-gold-500 dark:to-gold-700 shadow-md" />
        <div className="relative z-10 flex flex-col items-center pt-2 text-parchment-base dark:text-deep-space">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span className="text-[7px] font-mono font-bold tracking-tighter mt-1">SEAL</span>
        </div>
      </div>

      {/* ─── Top Nav Bar inside Dossier Card ─── */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-leather-caramel/20 dark:border-gold-400/20 bg-leather-caramel/5 dark:bg-surface-primary/60">
        {/* Left: Gilded Medallion Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-leather-caramel dark:bg-gold-400/20 border border-leather-caramel/60 dark:border-gold-400/60 flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-parchment-base dark:text-gold-400" />
          </div>
          <div>
            <span className="font-display text-xs font-bold tracking-[0.25em] text-leather-dark dark:text-platinum-100 uppercase block">
              TEYVAT CODEX // ARCHIVE
            </span>
            <span className="font-mono text-[9px] text-leather-muted dark:text-text-muted tracking-wider">
              DOC NO. 07-EXPEDITION
            </span>
          </div>
        </div>

        {/* Center: Character Switcher (LUMINE ◀▶ AETHER) */}
        <div className="flex items-center gap-2 bg-leather-caramel/10 dark:bg-surface-primary px-3 py-1.5 chamfered-xs border border-leather-caramel/30 dark:border-gold-400/30">
          <button
            type="button"
            onClick={() => setCharacter("lumine")}
            className={`px-3 py-1 font-display text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1 ${
              character === "lumine"
                ? "bg-leather-caramel dark:bg-gold-400 text-parchment-base dark:text-deep-space shadow-sm"
                : "text-leather-muted dark:text-text-muted hover:text-leather-dark dark:hover:text-platinum-100"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>LUMINE</span>
          </button>
          <span className="text-leather-muted/50 dark:text-text-muted/50 text-xs">|</span>
          <button
            type="button"
            onClick={() => setCharacter("aether")}
            className={`px-3 py-1 font-display text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1 ${
              character === "aether"
                ? "bg-leather-caramel dark:bg-gold-400 text-parchment-base dark:text-deep-space shadow-sm"
                : "text-leather-muted dark:text-text-muted hover:text-leather-dark dark:hover:text-platinum-100"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
        {/* ── Column 1 (4 cols): Character 3D Diorama Figure (Pre-rendered for rock-solid stability) ── */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[420px] lg:min-h-[480px]">
          {/* Subtle Ambient Shadow Glow */}
          <div
            className="absolute w-56 h-56 rounded-full blur-2xl opacity-30 transition-all duration-700 pointer-events-none"
            style={{ backgroundColor: selectedElement.color }}
          />

          <div className="relative w-full h-[400px] sm:h-[460px] flex items-center justify-center group">
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
                  width={360}
                  height={460}
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
                  width={380}
                  height={480}
                  className="object-contain drop-shadow-[0_12px_20px_rgba(60,42,30,0.35)]"
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
                  width={360}
                  height={460}
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
                  width={380}
                  height={480}
                  className="object-contain drop-shadow-[0_12px_20px_rgba(60,42,30,0.35)]"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Rarity Star Bar Below Figure */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-leather-dark/80 dark:bg-black/80 px-4 py-1 rounded-full border border-gold-400/40 backdrop-blur-sm z-20">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-gold-400 text-xs drop-shadow-[0_0_4px_rgba(201,154,78,0.8)]">
                  ★
                </span>
              ))}
              <span className="font-mono text-[9px] text-gold-200 font-bold ml-1.5 uppercase">
                5-STAR TRAVELER
              </span>
            </div>
          </div>
        </div>

        {/* ── Column 2 (5 cols): Editorial Bio & Title ── */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Subtitle with Japanese Kanji (1:1 from ref2.png) */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display text-sm tracking-[0.2em] text-leather-muted dark:text-gold-400/90 font-medium">
                The Traveler //
              </span>
              <span className="font-serif text-base text-leather-caramel dark:text-gold-400 font-bold">
                旅人
              </span>
            </div>

            {/* Huge Serif Title with Intersecting Leather Accent Box */}
            <div className="relative my-2 inline-block">
              {/* Intersecting Caramel Block (Exact visual from ref2) */}
              <div className="absolute -left-2 top-2 bottom-2 w-7 bg-leather-caramel/20 dark:bg-gold-400/20 -z-0 chamfered-xs" />
              <h1 className="relative z-10 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-leather-dark dark:text-platinum-50 capitalize drop-shadow-sm">
                {character === "aether" ? "Aether" : "Lumine"}
              </h1>
            </div>

            {/* Developer Identity Subheading */}
            <div className="flex items-center gap-2 mt-1 mb-4">
              <span className="font-mono text-xs font-bold tracking-wider text-leather-caramel dark:text-gold-400 uppercase">
                {name}
              </span>
              <span className="text-leather-muted/50 dark:text-text-muted/50 text-xs">•</span>
              <span className="font-mono text-xs text-leather-muted dark:text-text-muted">
                {tagline}
              </span>
            </div>

            {/* Editorial Bio Text */}
            <div className="space-y-3 font-body text-sm leading-relaxed text-leather-dark/80 dark:text-platinum-200">
              <p>
                {character === "aether"
                  ? "He is a calm and collected traveler with an innate mastery over seven elemental domains. Capable of architecting massive distributed systems, high-speed neural pipelines, and fail-closed security perimeters."
                  : "She is a resolute and visionary architect navigating complex software topologies. Bringing unmatched precision to full-stack engineering, reactive HUD interfaces, and cloud-native services."}
              </p>
              <p className="text-xs text-leather-muted dark:text-text-muted italic border-l-2 border-leather-caramel/40 pl-3">
                {bio}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-leather-caramel/15 dark:border-gold-400/15">
            <a
              href="#contact"
              className="tactical-btn btn-glow-sweep px-6 py-2.5 bg-leather-caramel dark:bg-gold-400 text-parchment-base dark:text-deep-space font-display text-xs font-bold tracking-widest uppercase shadow-md hover:opacity-95 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUMMON ARCHITECT</span>
            </a>
            <a
              href="#projects"
              className="tactical-btn px-5 py-2.5 bg-parchment-subtle dark:bg-surface-primary border border-leather-caramel/40 dark:border-gold-400/40 text-leather-dark dark:text-gold-400 font-display text-xs font-bold tracking-widest uppercase hover:bg-leather-caramel/10 transition-all inline-flex items-center gap-2"
            >
              <span>EXPLORE DOMAINS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ── Column 3 (3 cols): 4 Interactive Accordion Controls ── */}
        <div className="lg:col-span-3 flex flex-col space-y-3">
          {/* 1. Fragment Accordion (7 Elements Grid) */}
          <div className="border border-leather-caramel/25 dark:border-gold-400/25 bg-leather-caramel/5 dark:bg-surface-primary/40 chamfered-xs p-3">
            <button
              type="button"
              onClick={() => toggleAccordion("fragment")}
              className="w-full flex items-center justify-between font-display text-xs font-bold text-leather-dark dark:text-platinum-100 tracking-wider uppercase mb-2 text-left"
            >
              <span>fragment</span>
              <span className="font-mono text-leather-caramel dark:text-gold-400 text-sm">
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
                      className={`relative p-1 chamfered-xs flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-leather-caramel/20 dark:bg-gold-400/20 border-2 border-leather-caramel dark:border-gold-400 scale-110 shadow-sm"
                          : "border border-leather-caramel/20 dark:border-gold-400/20 hover:scale-105 opacity-75 hover:opacity-100"
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
          <div className="border border-leather-caramel/25 dark:border-gold-400/25 bg-leather-caramel/5 dark:bg-surface-primary/40 chamfered-xs p-3">
            <button
              type="button"
              onClick={() => toggleAccordion("wishful")}
              className="w-full flex items-center justify-between font-display text-xs font-bold text-leather-dark dark:text-platinum-100 tracking-wider uppercase text-left"
            >
              <span>wishful</span>
              <span className="font-mono text-leather-caramel dark:text-gold-400 text-sm">
                {activeAccordions.wishful ? "−" : "+"}
              </span>
            </button>
            {activeAccordions.wishful && (
              <div className="mt-2 text-xs space-y-1.5 font-body text-leather-dark/80 dark:text-platinum-200">
                <div className="flex items-center gap-1 text-gold-500 text-[10px]">
                  <span>★★★★★</span>
                  <span className="font-mono text-[9px] text-leather-muted dark:text-text-muted ml-1 font-bold">
                    EVENT WISH
                  </span>
                </div>
                <p className="font-display font-semibold text-xs text-leather-dark dark:text-gold-400">
                  Aether HUD // Next-Gen Tactical Platform
                </p>
                <p className="text-[11px] text-leather-muted dark:text-text-muted">
                  Full-stack game-tier portfolio with dual-engine runtime.
                </p>
              </div>
            )}
          </div>

          {/* 3. Memory Accordion (Latin Lore & Architectural Motto) */}
          <div className="border border-leather-caramel/25 dark:border-gold-400/25 bg-leather-caramel/5 dark:bg-surface-primary/40 chamfered-xs p-3">
            <button
              type="button"
              onClick={() => toggleAccordion("memory")}
              className="w-full flex items-center justify-between font-display text-xs font-bold text-leather-dark dark:text-platinum-100 tracking-wider uppercase mb-1 text-left"
            >
              <span>memory</span>
              <span className="font-mono text-leather-caramel dark:text-gold-400 text-sm">
                {activeAccordions.memory ? "−" : "+"}
              </span>
            </button>
            {activeAccordions.memory && (
              <div className="text-xs space-y-1 font-body text-leather-muted dark:text-text-muted italic pt-1">
                <p className="font-serif">
                  “Memoria nostra sit aeterna, quam nullus in hoc mundo pereat.”
                </p>
                <p className="text-[10px] font-mono not-italic text-leather-caramel dark:text-gold-400/80">
                  — May our architectures endure across all worlds.
                </p>
              </div>
            )}
          </div>

          {/* 4. Myriad Accordion (Tech Stack Specifications) */}
          <div className="border border-leather-caramel/25 dark:border-gold-400/25 bg-leather-caramel/5 dark:bg-surface-primary/40 chamfered-xs p-3">
            <button
              type="button"
              onClick={() => toggleAccordion("myriad")}
              className="w-full flex items-center justify-between font-display text-xs font-bold text-leather-dark dark:text-platinum-100 tracking-wider uppercase mb-2 text-left"
            >
              <span>myriad</span>
              <span className="font-mono text-leather-caramel dark:text-gold-400 text-sm">
                {activeAccordions.myriad ? "−" : "+"}
              </span>
            </button>
            {activeAccordions.myriad && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Prisma v7", "PostgreSQL", "AI Logic"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 chamfered-xs bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/25 dark:border-gold-400/25 text-[10px] font-mono text-leather-dark dark:text-platinum-200 font-medium"
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
