"use client";

import { motion } from "framer-motion";
import { fadeInView } from "@/lib/motion-variants";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Short uppercase label rendered inside the badge. */
  badge: string;
  /** Optional icon rendered next to the badge label. */
  icon?: ReactNode;
  /** Display title (Cinzel / Orbitron). */
  title: string;
  /** Portion of the title rendered with the gold gradient. */
  highlight?: string;
  /** Subtitle paragraph under the title. */
  subtitle?: string;
  /** Alignment — centered by default. */
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  badge,
  icon,
  title,
  highlight,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
      {...fadeInView}
    >
      <div className="inline-flex items-center gap-1.5 px-3 py-1 chamfered-xs bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/25 dark:border-gold-400/30 text-leather-dark dark:text-gold-400 text-xs font-mono tracking-widest font-semibold mb-4 shadow-sm">
        {icon}
        <span>{badge}</span>
      </div>

      <h2 className="font-display text-3xl font-bold tracking-[0.08em] text-leather-dark dark:text-platinum-50 sm:text-4xl uppercase">
        {title}{" "}
        {highlight && <span className="text-gradient-gold">{highlight}</span>}
      </h2>

      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-leather-muted dark:text-text-muted font-body leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
