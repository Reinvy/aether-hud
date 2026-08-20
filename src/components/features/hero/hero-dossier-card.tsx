"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { TEYVAT_ELEMENTS } from "@/lib/element-assets";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { cn } from "@/lib/utils";

interface HeroDossierProps {
  name?: string;
  tagline?: string;
  bio?: string;
}

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

export function HeroDossierCard({
  name = "Bahrul Ulumul Haq",
  tagline = "Full-Stack Architect & AI Systems Engineer",
  bio = "Architecting high-performance digital experiences at the intersection of AI, game design, and full-stack engineering. Specializing in Next.js, AI integration, and immersive UI systems.",
}: HeroDossierProps) {
  const [character, setCharacter] = useState<"aether" | "lumine">("aether");
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

  const selectedElement =
    TEYVAT_ELEMENTS.find((el) => el.key === activeElementKey) || TEYVAT_ELEMENTS[2];

  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl border-2 border-[#5C3E2A] dark:border-gold-400/40 shadow-[0_24px_60px_rgba(44,30,20,0.22)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.65)] overflow-hidden select-none bg-[#ECE4D8] dark:bg-[#1E140C] transition-colors duration-500">
      
      {/* ─── Hanging Ivory Bookmark Ribbon with Heart Cut-out (1:1 from ref2.png) ─── */}
      <div
        className="absolute top-0 right-6 sm:right-10 w-9 sm:w-11 h-14 sm:h-16 z-30 flex flex-col items-center pt-2 text-[#4A311F] dark:text-[#2C1E14] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] pointer-events-none"
        style={{
          backgroundColor: "#ECE4D8",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
        }}
      >
        <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#4A311F] text-[#4A311F]" />
      </div>

      {/* ─── Main Two-Column Master Layout (Parchment Left ~79%, Brown Sidebar Right ~21%) ─── */}
      <div className="flex flex-col lg:flex-row min-h-[580px] lg:min-h-[640px]">
        
        {/* ════════════════════════════════════════════════════════════════════════
            LEFT: PARCHMENT CANVAS (~79% Width)
           ════════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col relative bg-[#ECE4D8] dark:bg-[#1E140C] transition-colors duration-500">
          
          {/* Top Header Bar inside Parchment Canvas */}
          <div className="relative flex items-center justify-between px-6 sm:px-10 pt-5 pb-3">
            
            {/* Top-Left: Dark Brown Medallion Seal Badge */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#4A311F] dark:bg-gold-500/90 border-2 border-[#8D5E3C] dark:border-gold-300 flex items-center justify-center p-1.5 shadow-md">
                <Image
                  src={GENSHIN_UI_ICONS.archive}
                  alt="Teyvat Archive"
                  width={22}
                  height={22}
                  className="object-contain brightness-0 invert"
                  unoptimized
                />
              </div>
            </div>

            {/* Hairline Horizontal Rule stretching across the top */}
            <div className="absolute left-18 sm:left-24 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#D6C8B5] dark:bg-gold-400/20" />

            {/* Top-Right: Character Switcher (LUMINE ◄► AETHER) */}
            <div className="relative z-10 flex items-center gap-4 sm:gap-6 bg-[#ECE4D8] dark:bg-[#1E140C] pl-4 pr-2">
              <button
                type="button"
                onClick={() => setCharacter("lumine")}
                className={cn(
                  "font-serif text-xs sm:text-sm tracking-[0.2em] uppercase transition-all pb-0.5",
                  character === "lumine"
                    ? "text-[#4A311F] dark:text-gold-300 font-extrabold border-b-2 border-[#8D5E3C] dark:border-gold-400"
                    : "text-[#9E8A78] dark:text-gold-400/50 hover:text-[#4A311F] dark:hover:text-gold-200 font-bold"
                )}
              >
                LUMINE
              </button>

              <span className="text-[#8B7362] dark:text-gold-500/60 font-serif text-xs tracking-tighter select-none">
                ◄►
              </span>

              <button
                type="button"
                onClick={() => setCharacter("aether")}
                className={cn(
                  "font-serif text-xs sm:text-sm tracking-[0.2em] uppercase transition-all pb-0.5",
                  character === "aether"
                    ? "text-[#4A311F] dark:text-gold-300 font-extrabold border-b-2 border-[#8D5E3C] dark:border-gold-400"
                    : "text-[#9E8A78] dark:text-gold-400/50 hover:text-[#4A311F] dark:hover:text-gold-200 font-bold"
                )}
              >
                AETHER
              </button>
            </div>
          </div>

          {/* ── Center Stage: Character + Typography ── */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 relative px-6 sm:px-10 pb-8 pt-2 items-center gap-6 lg:gap-8">
            
            {/* Watermark Crest (Bottom-Right of Parchment Canvas, 1:1 with ref2.png) */}
            <div className="pointer-events-none absolute right-4 sm:right-8 bottom-4 w-64 h-64 sm:w-80 sm:h-80 text-[#CDBBA7] dark:text-gold-500/10 opacity-30 dark:opacity-15 -z-0">
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
                <AnimatePresence mode="wait">
                  {character === "aether" ? (
                    <motion.div
                      key="aether-stage"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src="/characters/aether_figure.png"
                        alt="Aether Character Diorama"
                        width={460}
                        height={560}
                        priority
                        className="object-contain max-h-[480px] lg:max-h-[520px] drop-shadow-[0_16px_32px_rgba(44,30,20,0.35)] transition-transform duration-700 ease-out group-hover:scale-105"
                        unoptimized
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="lumine-stage"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src="/characters/lumine_figure.png"
                        alt="Lumine Character Diorama"
                        width={460}
                        height={560}
                        priority
                        className="object-contain max-h-[480px] lg:max-h-[520px] drop-shadow-[0_16px_32px_rgba(44,30,20,0.35)] transition-transform duration-700 ease-out group-hover:scale-105"
                        unoptimized
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column (7 cols): Editorial Typography & Bio (1:1 from ref2.png) */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4 relative z-10">
              
              {/* Category / Japanese Kanji Subtitle */}
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm sm:text-base tracking-[0.2em] text-[#634C3C] dark:text-gold-400 font-medium">
                  The Traveler //
                </span>
                <span className="font-serif text-base sm:text-lg text-[#4A311F] dark:text-gold-300 font-bold">
                  旅人
                </span>
              </div>

              {/* Main Title: Large High-Contrast Serif */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[#4A311F] dark:text-[#F8F4EE] leading-none capitalize">
                {character === "aether" ? "Aether" : "Lumine"}
              </h1>

              {/* Editorial Paragraphs with Solid Brown Accent Box (1:1 from ref2.png) */}
              <div className="flex items-start gap-3 sm:gap-4 pt-1">
                {/* Vertical Solid Brown Accent Box */}
                <div className="w-6 sm:w-7 h-14 sm:h-16 bg-[#8D5E3C] dark:bg-gold-600 shrink-0 mt-1 shadow-sm" />
                
                {/* Paragraph Content */}
                <div className="space-y-3 font-sans text-xs sm:text-[13px] lg:text-[14px] leading-relaxed text-[#634E40] dark:text-[#DECBB8]">
                  <p>
                    {character === "aether"
                      ? "He is a curious and adventurous soul, with a strong sense of justice. Aether is also a talented fighter, capable of wielding multiple elements to protect those he cares about."
                      : "She is a mysterious and intrepid wanderer, with sharp tactical wisdom and unwavering resolve. Lumine wields the boundless power of elemental resonance to defend what is precious."}
                  </p>
                  <p>
                    {character === "aether"
                      ? "Despite his predicament, Aether remains determined to find his sister and reunite with her. He sets out on a journey across Teyvat, meeting new friends and allies along the way. He is always willing to fight for what he believes in, to stand up for those who are weaker."
                      : "Carrying memories of celestial realms across the cosmos, Lumine charts an uncharted path across Teyvat. She stands firm through trials and storms, seeking the hidden truths of the world."}
                  </p>
                </div>
              </div>

              {/* Identity & Tactical Actions */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#D6C8B5]/60 dark:border-gold-400/20 mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#4A311F] dark:text-gold-400 uppercase tracking-wider">
                    {name}
                  </span>
                  <span className="text-[#8D5E3C] dark:text-gold-500/60 text-xs">•</span>
                  <span className="font-mono text-[10px] text-[#634E40] dark:text-text-muted" title={bio}>
                    {tagline}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href="#projects"
                    className="px-4 py-2 font-serif text-[11px] font-bold tracking-widest uppercase bg-[#8D5E3C] hover:bg-[#734A2D] text-[#FAF6F0] rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5"
                  >
                    <span>EXPLORE DOMAINS</span>
                  </a>
                  <a
                    href="#contact"
                    className="px-4 py-2 font-serif text-[11px] font-bold tracking-widest uppercase border border-[#8D5E3C] text-[#4A311F] dark:text-gold-300 hover:bg-[#8D5E3C]/10 rounded-lg transition-all"
                  >
                    <span>SUMMON</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            RIGHT: WARM MOCHA/SADDLE LEATHER SIDEBAR (~21% Width, 1:1 from ref2.png)
           ════════════════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[260px] xl:w-[280px] bg-[#8D5E3C] dark:bg-[#281810] text-[#F8F4EE] flex flex-col justify-between p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-[#5C3E2A]/30 dark:border-gold-400/25 relative shrink-0 transition-colors duration-500">
          
          <div className="space-y-4 pt-10 sm:pt-12 lg:pt-14">
            
            {/* 1. Fragment Accordion (7 Flat White Element Icons Grid) */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("fragment")}
                className="w-full flex items-center justify-between font-serif text-xs font-bold tracking-[0.2em] uppercase text-[#F8F4EE] hover:text-[#FDF2CA] transition-colors text-left"
              >
                <span>fragment</span>
                <span className="font-mono text-sm font-bold">
                  {accordions.fragment ? "−" : "+"}
                </span>
              </button>
              
              {/* Hairline Divider */}
              <div className="h-[1px] bg-white/25 dark:bg-gold-400/25 mt-1.5 mb-3" />

              {accordions.fragment && (
                <div className="space-y-2 pt-0.5">
                  {/* Row 1: Pyro, Hydro, Anemo, Electro (4 icons) */}
                  <div className="grid grid-cols-4 gap-2 justify-items-center">
                    {TEYVAT_ELEMENTS.slice(0, 4).map((elem) => {
                      const isActive = elem.key === activeElementKey;
                      return (
                        <button
                          key={elem.key}
                          type="button"
                          onClick={() => setActiveElementKey(elem.key)}
                          title={`${elem.name} Vision: ${elem.domain}`}
                          className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center p-1 transition-all",
                            isActive
                              ? "bg-white/25 ring-1.5 ring-white scale-110 shadow-sm"
                              : "opacity-75 hover:opacity-100 hover:scale-105 hover:bg-white/10"
                          )}
                        >
                          <Image
                            src={elem.whiteIcon}
                            alt={elem.name}
                            width={22}
                            height={22}
                            className="object-contain"
                            unoptimized
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Row 2: Dendro, Cryo, Geo (3 icons) */}
                  <div className="grid grid-cols-4 gap-2 justify-items-center">
                    {TEYVAT_ELEMENTS.slice(4, 7).map((elem) => {
                      const isActive = elem.key === activeElementKey;
                      return (
                        <button
                          key={elem.key}
                          type="button"
                          onClick={() => setActiveElementKey(elem.key)}
                          title={`${elem.name} Vision: ${elem.domain}`}
                          className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center p-1 transition-all",
                            isActive
                              ? "bg-white/25 ring-1.5 ring-white scale-110 shadow-sm"
                              : "opacity-75 hover:opacity-100 hover:scale-105 hover:bg-white/10"
                          )}
                        >
                          <Image
                            src={elem.whiteIcon}
                            alt={elem.name}
                            width={22}
                            height={22}
                            className="object-contain"
                            unoptimized
                          />
                        </button>
                      );
                    })}
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
                className="w-full flex items-center justify-between font-serif text-xs font-bold tracking-[0.2em] uppercase text-[#F8F4EE] hover:text-[#FDF2CA] transition-colors text-left"
              >
                <span>wishful</span>
                <span className="font-mono text-sm font-bold">
                  {accordions.wishful ? "−" : "+"}
                </span>
              </button>
              
              {/* Hairline Divider */}
              <div className="h-[1px] bg-white/25 dark:bg-gold-400/25 mt-1.5 mb-2" />

              {accordions.wishful && (
                <div className="text-[11px] font-sans text-white/90 space-y-1 pt-1">
                  <div className="flex items-center gap-1 text-[#FDF2CA] text-[10px]">
                    <span>★★★★★</span>
                    <span className="font-mono text-[9px] font-bold text-white/80">EVENT WISH</span>
                  </div>
                  <p className="font-serif font-bold text-white text-xs">Aether HUD Portfolio</p>
                  <p className="text-white/75 text-[10px] leading-tight">
                    Tactical AAA Web Architecture & AI Engineering.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Memory Accordion (Latin Lore Motto) */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("memory")}
                className="w-full flex items-center justify-between font-serif text-xs font-bold tracking-[0.2em] uppercase text-[#F8F4EE] hover:text-[#FDF2CA] transition-colors text-left"
              >
                <span>memory</span>
                <span className="font-mono text-sm font-bold">
                  {accordions.memory ? "−" : "+"}
                </span>
              </button>
              
              {/* Hairline Divider */}
              <div className="h-[1px] bg-white/25 dark:bg-gold-400/25 mt-1.5 mb-2" />

              {accordions.memory && (
                <div className="text-xs font-serif italic text-[#DECBB8] dark:text-gold-200/90 leading-relaxed pt-0.5">
                  memoria nostra sit aeterna, quam nullus in hoc mundo pereat
                </div>
              )}
            </div>

            {/* 4. Myriad Accordion (Tags) */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("myriad")}
                className="w-full flex items-center justify-between font-serif text-xs font-bold tracking-[0.2em] uppercase text-[#F8F4EE] hover:text-[#FDF2CA] transition-colors text-left"
              >
                <span>myriad</span>
                <span className="font-mono text-sm font-bold">
                  {accordions.myriad ? "−" : "+"}
                </span>
              </button>
              
              {/* Hairline Divider */}
              <div className="h-[1px] bg-white/25 dark:bg-gold-400/25 mt-1.5 mb-2" />

              {accordions.myriad && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Kotobukiya", "Figures", "Genshin Impact", "JPY"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-white/15 dark:bg-black/30 border border-white/25 dark:border-gold-400/30 text-[10px] font-sans text-white font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Footer Metadata */}
          <div className="pt-4 mt-auto border-t border-white/20 dark:border-gold-400/20 text-[10px] font-mono text-white/60 flex items-center justify-between">
            <span>VISION: {selectedElement.name.toUpperCase()}</span>
            <span className="text-[#FDF2CA] font-bold">AR 60</span>
          </div>

        </div>

      </div>

    </div>
  );
}


