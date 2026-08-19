"use client";

import { motion } from "framer-motion";
import { useData } from "@/lib/use-data";
import { HeroStatusBadge } from "@/components/features/hero/hero-status-badge";
import { HeroCtaRow } from "@/components/features/hero/hero-cta-row";
import { HeroTerminalPanel } from "@/components/features/hero/hero-terminal-panel";

type Config = {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  status: string;
  sysVersion: string;
};

/**
 * HeroSection — landing hero orchestrator.
 *
 * Composes the reusable hero sub-components (status badge, CTA row,
 * terminal panel) around the title block. Every sub-component lives in
 * src/components/features/hero/ and follows the AETHER-HUD design
 * system (chamfered panels, gold gradient CTAs, sys-label typography).
 * All copy comes from /api/config with a static fallback so the hero
 * never blanks while the config endpoint resolves.
 */
export function HeroSection() {
  const { data: config } = useData<Config>("/api/config");

  const cfg = config || {
    id: "main",
    name: "Bahrul Ulumul Haq",
    tagline: "Full-Stack Developer & AI Engineer",
    bio: "Architecting high-performance digital experiences at the intersection of AI, game design, and full-stack engineering. Specializing in Next.js, AI integration, and immersive UI systems.",
    email: "hello@aether-hud.dev",
    location: "Jakarta, Indonesia",
    avatar: "/placeholder.svg",
    sysVersion: "v2.4.1",
    status: "ONLINE",
  };

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-deep-space" />
      <div className="pointer-events-none absolute inset-0 bg-starfield" />
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-30" />
      <div className="pointer-events-none absolute inset-0 scanline" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-violet" />

      {/* Particles placeholder - Canvas API grid */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-border-glass/30 rounded-full blur-3xl bg-gold-500/5" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 border border-border-glass/20 rounded-full blur-3xl bg-stellar-400/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-5xl text-center"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Status Badge — reusable HUD status pill */}
          <HeroStatusBadge status={cfg.status} sysVersion={cfg.sysVersion} />

          {/* Main Title */}
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="text-text-main/90 font-display tracking-[0.08em] block text-balance">
              {cfg.name}
            </span>
            <span className="text-gradient-gold font-display tracking-[0.08em] mt-2 block text-balance">
              {cfg.tagline}
            </span>
          </h1>

          {/* Dynamic Subtitle / Bio */}
          <motion.p
            className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-text-muted max-w-3xl mx-auto font-body text-pretty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {cfg.bio}
          </motion.p>

          {/* CTA Buttons — reusable primary/secondary cluster */}
          <HeroCtaRow />
        </motion.div>

        {/* Terminal Panel — dynamic system readout */}
        <HeroTerminalPanel config={cfg} />
      </div>
    </section>
  );
}
