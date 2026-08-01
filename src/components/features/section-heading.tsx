"use client";

import { motion } from "framer-motion";
import { fadeInView } from "@/lib/motion-variants";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * SectionHeading — reusable HUD section header block.
 *
 * Encapsulates the AETHER-HUD header pattern used across all landing
 * sections: gold badge label + Orbitron display title (with a gold
 * highlight span) + muted subtitle, animated with fade-in-up.
 *
 * Design: Obsidian & Imperial Gold — Luxury Cybernetics.
 */


interface SectionHeadingProps {
  /** Short uppercase label rendered inside the gold badge. */
  badge: string;
  /** Optional icon rendered next to the badge label. */
  icon?: ReactNode;
  /** Display title (Orbitron). */
  title: string;
  /** Portion of the title rendered with the gold gradient. */
  highlight?: string;
  /** Subtitle paragraph under the title. */
  subtitle?: string;
  /** Alignment — centered by default (HUD standard). */
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
      <Badge variant="gold" size="md" className="mb-4">
        {icon}
        {badge}
      </Badge>
      <h2 className="font-display text-3xl font-bold tracking-[0.08em] text-text-main sm:text-4xl">
        {title}{" "}
        {highlight && <span className="text-gradient-gold">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-text-muted font-body">{subtitle}</p>
      )}
    </motion.div>
  );
}
