/**
 * AETHER-HUD Shared Motion Variants
 *
 * Single source of truth for the animation variants used across the app.
 * Previously duplicated in 12+ files — extracting guarantees every
 * section/dashboard uses the SAME curve (cubic-bezier(0.16, 1, 0.3, 1))
 * per the design system, and keeps micro-interactions consistent.
 *
 * NOTE: typed as plain object literals (NOT framer-motion `Variants`),
 * matching the proven pattern already used across the codebase —
 * framer-motion v12's `Variants` type rejects top-level `transition`/
 * `viewport` keys. Consumers spread these onto `<motion.*>` elements.
 */

/** The AETHER-HUD easing curve — all transitions must use this. */
export const EASE_HUD = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Standard fade-in-up for animate-based enter (dashboard pages). */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: EASE_HUD },
} as const;

/** Fade-in-up variant for whileInView-based enter (landing sections). */
export const fadeInView = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5, ease: EASE_HUD },
} as const;

/** Parent container that staggers children (used with fadeInUpItem). */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
} as const;

/** Child item for use inside staggerContainer. */
export const fadeInUpItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_HUD },
  },
} as const;

/** Lightweight fade for micro-content blocks. */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, ease: EASE_HUD },
} as const;
