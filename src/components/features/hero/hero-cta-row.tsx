"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * HeroCtaRow — primary/secondary call-to-action cluster for the hero.
 *
 * Renders accessible semantic links with the AETHER-HUD button styling
 * (gold gradient sweep, glass secondary, crosshair-ring hover, and focus ring).
 */
export function HeroCtaRow() {
  return (
    <>
      <motion.div
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Link
          href="#projects"
          className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 tactical-btn bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-deep-space font-mono text-xs font-bold tracking-widest transition-all duration-300 btn-glow-sweep crosshair-ring hover-scale-sm press-scale focus-ring-gold shadow-[0_0_25px_rgba(242,201,76,0.25)]"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-deep-space" aria-hidden="true" />
          <span>EXPLORE DOSSIER</span>
        </Link>
        <Link
          href="#contact"
          className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 tactical-btn glass-panel border border-border-glass/40 text-text-main font-mono text-xs tracking-widest transition-all duration-300 hover:border-gold-400/60 hover:text-gold-400 hover:bg-glass-300 hover-scale-sm press-scale focus-ring-gold"
        >
          <span>CONTACT NODE</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-gold-400/70 transition-transform group-hover:translate-x-0.5 group-hover:text-gold-400" aria-hidden="true" />
        </Link>
      </motion.div>

      {/* Call to action subtext */}
      <motion.div
        className="mt-8 flex items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Activity className="h-3 w-3 text-gold-400/50" aria-hidden="true" />
        <span className="sys-label font-mono tabular-nums">
          SCROLL TO EXPLORE // {new Date().getFullYear()} ARCHIVE
        </span>
        <ArrowRight className="h-3 w-3 text-gold-400/50 animate-float-drift" aria-hidden="true" />
      </motion.div>
    </>
  );
}
