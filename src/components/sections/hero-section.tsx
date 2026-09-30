"use client";

import { motion } from "framer-motion";
import { HeroDossierCard } from "@/components/features/hero/hero-dossier-card";
import { AssetIcon } from "@/components/ui/asset-icon";
import { EASE_CODEX } from "@/lib/motion-variants";
import type { ConfigDto, ExperienceDto, ProjectDto, SkillDto } from "@/lib/dto";

interface HeroSectionProps {
  config: ConfigDto;
  /** True once the intro gate has handed the screen over. */
  revealed: boolean;
  projects: ProjectDto[];
  skills: SkillDto[];
  experiences: ExperienceDto[];
}

/**
 * HeroSection — 1:1 Teyvat Traveler Dossier Master Showcase.
 *
 * Implements the full-screen character dossier card directly from
 * Dribbble reference ref2.png & ref_video.mp4 with Genshin fantasy curves.
 * The traveler config arrives with the server render, so the section is
 * purely presentational — no fetch, no placeholder state.
 */
export function HeroSection({ config, revealed, projects, skills, experiences }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20">
      {/* Atmosphere Background Layers */}
      <div className="pointer-events-none absolute inset-0 bg-parchment-base" />
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />

      <div className="relative mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        {/* Traveler Status Line */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-parchment-base/95 border border-leather-caramel/35 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-jade-400 animate-pulse" />
            <span className="codex-label">
              Traveler status: {config.status}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-1 rounded-full bg-parchment-base/95 border border-leather-caramel/35 shadow-sm">
            <AssetIcon icon="handbook" size="sm" className="shrink-0" />
            <span className="codex-label-active">
              Region: {config.location}
            </span>
          </div>
        </motion.div>

        {/* Master Traveler Dossier Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={revealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.98, y: 15 }}
          transition={{ duration: 0.6, ease: EASE_CODEX }}
        >
          <HeroDossierCard
            name={config.name}
            tagline={config.tagline}
            bio={config.bio}
            avatar={config.avatar}
            projects={projects}
            skills={skills}
            experiences={experiences}
          />
        </motion.div>
      </div>
    </section>
  );
}
