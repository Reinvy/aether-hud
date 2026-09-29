"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import { TEYVAT_ELEMENTS, getElementByKey, type ElementAsset } from "@/lib/element-assets";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { cn } from "@/lib/utils";
import { EASE_CODEX } from "@/lib/motion-variants";
import { MISSION_LINE } from "@/lib/constants";
import { resolveRarity } from "@/lib/project-meta";
import { useMotionPrefs } from "@/components/motion-provider";
import type { ExperienceDto, ProjectDto, SkillDto } from "@/lib/dto";

interface HeroDossierCardProps {
  name: string;
  tagline: string;
  bio: string;
  /** Traveler portrait from the site config; the chip is hidden when unset. */
  avatar?: string;
  /** The published archive — the side panel summarises the real records. */
  projects: ProjectDto[];
  skills: SkillDto[];
  experiences: ExperienceDto[];
}

/** The two traveler presets the switcher toggles between (figure art only). */
const CHARACTERS = {
  aether: {
    title: "Aether",
    caption: "Dawnbrand traveler",
    figure: "/characters/aether_figure.png",
    figureAlt: "Aether character diorama",
  },
  lumine: {
    title: "Lumine",
    caption: "Starlit wayfarer",
    figure: "/characters/lumine_figure.png",
    figureAlt: "Lumine character diorama",
  },
} as const;

type CharacterKey = keyof typeof CHARACTERS;

/** Years of practice, derived from the earliest quest on record. */
function yearsOfExperience(experiences: ExperienceDto[]): number {
  const years = experiences
    .map((entry) => Number.parseInt(entry.startDate.slice(0, 4), 10))
    .filter((year) => Number.isFinite(year));
  if (years.length === 0) return 0;
  return Math.max(0, new Date().getFullYear() - Math.min(...years));
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
      title={`${element.name} vision — ${element.domain}`}
      className={cn(
        "w-8 h-8 codex-btn flex items-center justify-center p-1 transition-all codex-focus",
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

/** One collapsible block of the leather side panel. */
function AccordionSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between font-serif text-xs font-bold tracking-[0.2em] uppercase text-gold-50 hover:text-gold-100 transition-colors text-left codex-focus"
      >
        <span>{title}</span>
        <span className="font-serif text-sm font-bold">{open ? "−" : "+"}</span>
      </button>

      {/* Hairline Divider */}
      <div className="h-[1px] bg-gold-50/20 mt-1.5 mb-2" />

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_CODEX }}
            className="overflow-hidden"
          >
            <div className="pt-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HeroDossierCard({
  name,
  tagline,
  bio,
  avatar,
  projects,
  skills,
  experiences,
}: HeroDossierCardProps) {
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

  // The featured domain is the highest-rarity project on record; ties fall back
  // to the archive's own display order.
  const featured = [...projects].sort(
    (a, b) => resolveRarity(b.complexity) - resolveRarity(a.complexity) || a.order - b.order
  )[0];
  const titleSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 8);
  const experienceYears = yearsOfExperience(experiences);

  // Parallax: the figure drifts against the card as it crosses the viewport.
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const { animationsEnabled } = useMotionPrefs();
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const figureY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const parallaxEnabled = animationsEnabled && !prefersReduced;

  return (
    <div
      ref={cardRef}
      className="relative w-full codex-panel-radius border-2 border-leather-caramel/35 bg-parchment-subtle shadow-2xl overflow-hidden select-none"
    >
      {/* ─── Hanging Saddle Leather Bookmark Ribbon with Heart (ref2.png) ─── */}
      <span className="bookmark-ribbon" aria-hidden="true">
        <Heart className="h-4 w-4 fill-current" />
      </span>

      {/* ─── Main Two-Column Master Layout (Parchment Canvas + Cognac Panel) ─── */}
      <div className="flex flex-col lg:flex-row min-h-[580px] lg:min-h-[640px]">
        {/* ════════════════════════════════════════════════════════════════════════
            LEFT: PARCHMENT CANVAS
           ════════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col relative bg-parchment-subtle">
          {/* Top Header Bar inside Parchment Canvas */}
          <div className="relative flex items-center justify-between px-6 sm:px-10 pt-5 pb-3">
            {/* Top-Left: Deep Espresso Medallion Seal Badge */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold-900 border-2 border-leather-caramel/60 flex items-center justify-center p-1.5 shadow-md">
                <Image
                  src={GENSHIN_UI_ICONS.archive}
                  alt="Teyvat archive"
                  width={22}
                  height={22}
                  className="codex-icon-on-plate object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Hairline Horizontal Rule stretching across the top */}
            <div className="absolute left-18 sm:left-24 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-leather-caramel/25" />

            {/* Top-Right: Character Switcher (LUMINE ◄► AETHER).
                `pr-20` keeps the labels clear of the hanging bookmark ribbon,
                which is pinned at `right: 28px` with a 44px width. */}
            <div className="relative z-10 flex items-center gap-4 bg-parchment-subtle pl-4 pr-20 sm:gap-6">
              <button
                type="button"
                onClick={() => setCharacter("lumine")}
                aria-pressed={character === "lumine"}
                className={cn(
                  "font-serif text-xs sm:text-sm tracking-[0.2em] uppercase transition-all pb-0.5 codex-focus",
                  character === "lumine"
                    ? "text-leather-dark font-extrabold border-b-2 border-leather-caramel"
                    : "text-leather-muted hover:text-leather-dark font-bold",
                )}
              >
                Lumine
              </button>

              <span className="text-leather-caramel/60 font-serif text-xs tracking-tighter select-none">
                ◄►
              </span>

              <button
                type="button"
                onClick={() => setCharacter("aether")}
                aria-pressed={character === "aether"}
                className={cn(
                  "font-serif text-xs sm:text-sm tracking-[0.2em] uppercase transition-all pb-0.5 codex-focus",
                  character === "aether"
                    ? "text-leather-dark font-extrabold border-b-2 border-leather-caramel"
                    : "text-leather-muted hover:text-leather-dark font-bold",
                )}
              >
                Aether
              </button>
            </div>
          </div>

          {/* ── Center Stage: Character + Typography ── */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 relative px-6 sm:px-10 pb-8 pt-2 items-center gap-6 lg:gap-8">
            {/* Watermark Crest (Bottom-Right of Parchment Canvas, ref2.png) */}
            <div className="pointer-events-none absolute right-4 sm:right-8 bottom-4 w-64 h-64 sm:w-80 sm:h-80 text-leather-caramel opacity-20 -z-0">
              <TravelerStarWatermark className="w-full h-full" />
            </div>

            {/* Left Column (5 cols): 3D Character Diorama Figure */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">
              {/* Element Atmosphere Ambient Glow */}
              <div
                className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: selectedElement.color }}
              />

              <motion.div
                style={parallaxEnabled ? { y: figureY } : undefined}
                className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] flex items-center justify-center group"
              >
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
              </motion.div>
            </div>

            {/* Right Column (7 cols): Editorial Typography & Bio (ref2.png) */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4 relative z-10">
              {/* Decorative traveler row — the two presets the art alternates between. */}
              <p className="font-display text-[11px] sm:text-xs tracking-[0.35em] uppercase text-leather-caramel font-bold">
                Aether · Lumine
              </p>

              {/* Main Title: the dossier owner, not the character on the cover. */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-leather-dark leading-none">
                {name}
              </h1>

              {/* Editorial Bio with Solid Cognac Accent Box (ref2.png) */}
              <div className="flex items-start gap-3 sm:gap-4 pt-1">
                {/* Vertical Solid Cognac Accent Box */}
                <div className="w-6 sm:w-7 h-14 sm:h-16 bg-leather-caramel shrink-0 mt-1 shadow-sm" />

                <div className="space-y-3">
                  <p className="font-body text-sm lg:text-[15px] leading-7 text-leather-muted text-pretty">
                    {bio}
                  </p>
                  <p className="font-serif text-sm italic text-leather-caramel">
                    {copy.caption}
                  </p>
                </div>
              </div>

              {/* Identity & Traveler Actions */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-leather-caramel/30 mt-2">
                <div className="flex items-center gap-2.5">
                  {avatar && (
                    <Image
                      src={avatar}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover border border-leather-caramel/40"
                      unoptimized
                    />
                  )}
                  <span className="codex-label">{tagline}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href="#projects"
                    className="codex-btn-primary codex-sheen codex-focus px-4 py-2 font-serif text-[11px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5"
                  >
                    <span>Explore Domains</span>
                  </a>
                  <a
                    href="#contact"
                    className="codex-btn-secondary codex-sheen codex-focus px-4 py-2 font-serif text-[11px] font-bold tracking-widest uppercase"
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
            {/* 1. Fragment — the seven elemental visions */}
            <AccordionSection
              title="Fragment"
              open={accordions.fragment}
              onToggle={() => toggleAccordion("fragment")}
            >
              <div className="space-y-2">
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
            </AccordionSection>

            {/* 2. Featured — the highest-grade domain on record */}
            <AccordionSection
              title="Featured"
              open={accordions.wishful}
              onToggle={() => toggleAccordion("wishful")}
            >
              {featured ? (
                <div className="cognac-card-subtle codex-radius-card p-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-gold-100 text-[10px]">
                    <span aria-hidden="true">{"★".repeat(resolveRarity(featured.complexity))}</span>
                    <span className="font-serif text-[9px] font-bold text-gold-50 tracking-wider uppercase">
                      {featured.category}
                    </span>
                  </div>
                  <p className="font-serif font-bold text-gold-50 text-xs">{featured.title}</p>
                  {featured.tags.length > 0 && (
                    <p className="font-body text-gold-50 text-[10px] leading-tight">
                      {featured.tags.slice(0, 3).join(" · ")}
                    </p>
                  )}
                  <a
                    href={`/projects/${featured.id}`}
                    className="codex-btn-secondary codex-sheen codex-focus mt-1 inline-flex px-3 py-1.5 font-serif text-[10px] font-bold tracking-widest uppercase"
                  >
                    Enter domain
                  </a>
                </div>
              ) : (
                <p className="font-body text-[10px] text-gold-50 leading-snug">
                  No domain has been published yet.
                </p>
              )}
            </AccordionSection>

            {/* 3. Memory — the working mission line */}
            <AccordionSection
              title="Memory"
              open={accordions.memory}
              onToggle={() => toggleAccordion("memory")}
            >
              <div className="cognac-card-subtle codex-radius-card p-3 space-y-2">
                <p className="text-xs font-serif italic text-gold-100 leading-relaxed">
                  {MISSION_LINE}
                </p>
                <p className="font-body text-[10px] text-gold-50/90 leading-snug">
                  Written in English — this dossier is a working document, not a translated one.
                </p>
              </div>
            </AccordionSection>

            {/* 4. Myriad — the strongest talents on record */}
            <AccordionSection
              title="Myriad"
              open={accordions.myriad}
              onToggle={() => toggleAccordion("myriad")}
            >
              {titleSkills.length > 0 ? (
                <ul className="space-y-1.5">
                  {titleSkills.map((skill) => (
                    <li key={skill.id} className="flex items-center justify-between gap-2">
                      <span className="font-body text-[10px] font-medium text-gold-50 truncate">
                        {skill.name}
                      </span>
                      <span className="font-serif text-[10px] font-bold text-gold-100 tabular-nums">
                        {skill.level}%
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-body text-[10px] text-gold-50 leading-snug">
                  No talents have been inscribed yet.
                </p>
              )}
            </AccordionSection>
          </div>

          {/* Panel Footer — honest counts read from the published archive. */}
          <div className="pt-4 mt-auto border-t border-gold-50/20 text-[10px] font-serif text-gold-50 flex items-center justify-between">
            <span>Vision: {selectedElement.name}</span>
            <span className="flex items-center gap-2 font-bold text-gold-100 tabular-nums">
              <span className="text-gold-50">{projects.length} domains</span>
              <span aria-hidden="true">·</span>
              <span className="text-gold-50">{skills.length} talents</span>
              {experienceYears > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-gold-50">exp {experienceYears} yrs</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
