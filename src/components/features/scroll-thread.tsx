"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useMotionPrefs } from "@/components/motion-provider";

/**
 * ScrollThread — the imperial-gold thread drawn at the top of the dossier.
 *
 * A fixed 2px ribbon whose width tracks the reading position, so the page
 * reads as one continuous scroll of parchment. Purely decorative: it is
 * `aria-hidden` and disappears entirely when motion is off (either the OS
 * preference or the operator's console switch).
 */
export function ScrollThread() {
  const prefersReduced = useReducedMotion();
  const { animationsEnabled } = useMotionPrefs();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReduced || !animationsEnabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-gradient-to-r from-gold-600 to-gold-400"
    />
  );
}
