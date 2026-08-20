"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useData } from "@/lib/use-data";
import { HeroDossierCard } from "@/components/features/hero/hero-dossier-card";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

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
 * Dribbble reference ref2.png & ref_video.mp4 with Genshin fantasy curves.
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
    <section id="hero" className="relative min-h-screen overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20">
      {/* Atmosphere Background Layers */}
      <div className="pointer-events-none absolute inset-0 bg-parchment-base dark:bg-deep-space transition-colors duration-500" />
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15 dark:opacity-30" />

      <div className="relative mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        {/* Top Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5]/95 dark:bg-surface-primary/90 border border-leather-caramel/35 dark:border-gold-400/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-wider text-[#2C1E14] dark:text-gold-400 uppercase">
              STATUS: {cfg.status} // ADVENTURER AR 60
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5]/95 dark:bg-surface-primary/90 border border-leather-caramel/35 dark:border-gold-400/30 shadow-sm">
            <div className="w-3.5 h-3.5 relative">
              <Image
                src={GENSHIN_UI_ICONS.handbook}
                alt="Adventurer Handbook"
                width={14}
                height={14}
                className="object-contain"
              />
            </div>
            <span className="font-mono text-[9px] text-[#8C6239] dark:text-gold-300 font-bold uppercase">
              REALM: {cfg.location.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Master Traveler Dossier Card */}
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
