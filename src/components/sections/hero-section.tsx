"use client";

import { motion } from "framer-motion";
import { useData } from "@/lib/use-data";
import { HeroStatusBadge } from "@/components/features/hero/hero-status-badge";
import { HeroDossierCard } from "@/components/features/hero/hero-dossier-card";
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
 * HeroSection — Teyvat Codex Master Hero Showcase.
 *
 * Combines the Traveler Dossier character card (Aether/Lumine switcher,
 * 7 elemental fragment icons, wishful/memory/myriad widgets) with the
 * live telemetry terminal console.
 */
export function HeroSection() {
  const { data: config } = useData<Config>("/api/config");

  const cfg = config || {
    id: "main",
    name: "Bahrul Ulumul Haq",
    tagline: "Full-Stack Developer & AI Systems Architect",
    bio: "Architecting high-performance digital experiences at the intersection of AI, game systems, and modern web architectures. Specializing in Next.js, AI agent integration, and immersive HUD experiences.",
    email: "hello@aether-hud.dev",
    location: "Jakarta, Indonesia",
    avatar: "/avatar.jpg",
    sysVersion: "v2.4.1",
    status: "ONLINE",
  };

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* Atmosphere Background Layers */}
      <div className="pointer-events-none absolute inset-0 bg-parchment-base dark:bg-deep-space transition-colors duration-500" />
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-violet opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <HeroStatusBadge status={cfg.status} sysVersion={cfg.sysVersion} />
        </motion.div>

        {/* Master Traveler Dossier Card (Ref 2 & Dribbble Video) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroDossierCard config={cfg} />
        </motion.div>

        {/* Terminal Telemetry Console Panel */}
        <HeroTerminalPanel config={cfg} />
      </div>
    </section>
  );
}
