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
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-leather-caramel/35 bg-leather-caramel/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-leather-dark shadow-sm">
        {icon}
        <span>{badge}</span>
      </div>

      <h2 className="font-serif text-3xl font-bold uppercase tracking-[0.04em] text-leather-dark drop-shadow-sm sm:text-4xl lg:text-5xl text-balance">
        {title}{" "}
        {highlight && <span className="codex-gradient-text font-bold">{highlight}</span>}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl font-body text-sm font-medium leading-relaxed text-leather-dark sm:text-base text-pretty">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
