"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/lib/use-data";

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

type Social = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
};

export function HeroSection() {
  const { data: config, loading: configLoading } = useData<Config>("/api/config");
  const { data: socials } = useData<Social[]>("/api/socials");

  const cfg = config || {
    name: "Bahrul Ulumul Haq",
    tagline: "Full-Stack Developer & AI Engineer",
    sysVersion: "v2.4.1",
    status: "ONLINE",
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
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
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-none border border-border-glass bg-[rgba(242,201,76,0.06)] px-4 py-1.5 tactical-btn">
              <span className="led-active" />
              <span className="sys-label-active text-[10px]">
                STATUS: {cfg.status} // SYS_READY
              </span>
              <span className="sys-label text-[10px]">
                {cfg.sysVersion}
              </span>
            </div>
          </motion.div>

          {/* Main Title */}
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="text-text-main/90 font-display tracking-[0.08em]">
              {cfg.name}
            </span>
            <br />
            <span className="text-gradient-gold font-display tracking-[0.08em] mt-2 block">
              {cfg.tagline}
            </span>
          </h1>

          {/* Subtitle / Bio */}
          <motion.p
            className="mt-6 text-lg leading-8 text-text-muted sm:text-xl max-w-3xl mx-auto font-body"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Architecting high-performance digital experiences at the intersection of
            <span className="text-gold-400"> AI</span>,
            <span className="text-gold-400"> game design</span>, and
            <span className="text-gold-400"> full-stack engineering</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Link href="#projects">
              <Button size="lg" variant="primary" glow="gold" className="gap-2 crosshair-ring">
                <Sparkles className="h-5 w-5" />
                VIEW PROJECTS
              </Button>
            </Link>
            <Link href="#contact">
              <Button variant="secondary" size="lg" className="gap-2">
                CONTACT NODE
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Call to action subtext */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Activity className="h-3 w-3 text-gold-400/50" />
            <span className="sys-label">
              SCROLL TO EXPLORE // {new Date().getFullYear()} ARCHIVE
            </span>
            <ArrowRight className="h-3 w-3 text-gold-400/50 animate-float-drift" />
          </motion.div>
        </motion.div>

        {/* Hero Terminal Panel */}
        <motion.div
          className="relative mx-auto mt-16 max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="glass-panel chamfered overflow-hidden">
            {/* Terminal-style header */}
            <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-hud-danger shadow-[0_0_6px_rgba(255,0,85,0.5)]" />
                <div className="h-3 w-3 rounded-full bg-hud-warning shadow-[0_0_6px_rgba(255,153,0,0.5)]" />
                <div className="h-3 w-3 rounded-full bg-hud-active shadow-[0_0_6px_rgba(0,255,135,0.5)]" />
              </div>
              <div className="ml-4 flex gap-1 sys-label">
                <span className="rounded bg-[rgba(242,201,76,0.1)] px-2 py-0.5 text-gold-400">
                  aether
                </span>
                <span className="text-text-muted/30">/</span>
                <span className="text-text-muted/50">$(whoami)</span>
              </div>
              <span className="ml-auto sys-label text-text-muted/20">NODE//01 // ACTIVE</span>
            </div>

            {/* Terminal content */}
            <div className="p-6 sm:p-10">
              <div className="space-y-3 font-mono text-sm">
                <p className="text-text-muted">
                  <span className="text-gold-400">[AETHER@HUD]</span>
                  <span className="text-text-muted/30">:~$</span> cat /etc/profile
                </p>
                <p className="text-text-main/80">
                  {">"} Full-Stack Developer specializing in AI-driven applications
                </p>
                <p className="text-text-main/80">
                  {">"} Core Stack: Next.js · TypeScript · Prisma · Python
                </p>
                <p className="text-text-main/80">
                  {">"} Design Philosophy: AAA Game HUD Aesthetics · Luxury Cybernetics
                </p>
                <p className="text-gold-400/70">
                  {">"} <span className="animate-energy-pulse">_</span> Ready for deployment
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="gold" size="sm">Next.js</Badge>
                <Badge variant="gold" size="sm">TypeScript</Badge>
                <Badge variant="stellar" size="sm">AI</Badge>
                <Badge variant="gold" size="sm">Prisma</Badge>
                <Badge variant="default" size="sm">Tailwind v4</Badge>
                <Badge variant="default" size="sm">Framer Motion</Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
