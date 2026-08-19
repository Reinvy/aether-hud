"use client";

import { motion } from "framer-motion";
import { useData } from "@/lib/use-data";
import { HeroDossierCard } from "@/components/features/hero/hero-dossier-card";
import { ShieldCheck } from "lucide-react";

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
 * HeroSection — 1:1 Teyvat Traveler Dossier Master Showcase.
 *
 * Implements the full-screen character dossier card directly from
 * Dribbble reference ref2.png & ref_video.mp4 with zero sci-fi leftovers.
 */
export function HeroSection() {
  const { data: config } = useData<Config>("/api/config");

  const cfg = config || {
    id: "main",
    name: "Bahrul Ulumul Haq",
    tagline: "Full-Stack Architect & AI Systems Engineer",
    bio: "A digital wanderer across seven distributed realms, weaving resilient web architectures, neural intelligence systems, and high-precision tactical interfaces.",
    email: "hello@aether-hud.dev",
    location: "Jakarta, Indonesia",
    avatar: "/avatar.jpg",
    sysVersion: "v2.4.1",
    status: "ONLINE",
  };

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20">
      {/* Atmosphere Background Layers */}
      <div className="pointer-events-none absolute inset-0 bg-parchment-base dark:bg-deep-space transition-colors duration-500" />
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Subtle Top Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="flex items-center gap-2 px-3.5 py-1 chamfered-xs bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/25 dark:border-gold-400/25">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-leather-dark dark:text-gold-400 uppercase">
              STATUS: {cfg.status} // ADVENTURER AR 60
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 chamfered-xs bg-leather-caramel/5 dark:bg-surface-primary border border-leather-caramel/15 dark:border-gold-400/15">
            <ShieldCheck className="w-3 h-3 text-leather-caramel dark:text-gold-400" />
            <span className="font-mono text-[9px] text-leather-muted dark:text-text-muted">
              LOC: {cfg.location.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Master Traveler Dossier Card (Ref 2 & Dribbble Video) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroDossierCard
            name={cfg.name}
            tagline={cfg.tagline}
            bio={cfg.bio}
          />
        </motion.div>
      </div>
    </section>
  );
}
