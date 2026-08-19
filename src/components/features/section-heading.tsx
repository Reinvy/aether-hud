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
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#8C6239]/12 dark:bg-gold-400/10 border-2 border-[#8C6239]/35 dark:border-gold-400/30 text-[#1E1208] dark:text-gold-300 text-xs font-mono tracking-widest font-bold mb-4 shadow-sm">
        {icon}
        <span>{badge}</span>
      </div>

      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-[0.06em] text-[#1E1208] dark:text-platinum-50 uppercase text-balance drop-shadow-sm">
        {title}{" "}
        {highlight && <span className="text-gradient-gold font-black">{highlight}</span>}
      </h2>

      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-[#3D2514] dark:text-platinum-200 font-body font-medium leading-relaxed text-pretty max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
