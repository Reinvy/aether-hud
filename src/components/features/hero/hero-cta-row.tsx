"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * HeroCtaRow — primary/secondary call-to-action cluster for the hero.
 *
 * Extracted from the hero section so the same CTA chrome (gold glow
 * primary + glass secondary, crosshair-ring hover, staggered motion)
 * can be reused in section footers and banner CTAs without duplicating
 * the animation plumbing.
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
    </>
  );
}
