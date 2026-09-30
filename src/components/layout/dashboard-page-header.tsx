/**
 * DashboardPageHeader — shared header for every Codex Console page.
 */
"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { AssetIcon } from "@/components/ui/asset-icon";
import type { GenshinIconKey } from "@/lib/ui-icons";
import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
  icon: GenshinIconKey;
  /** Lore eyebrow rendered above the title, e.g. "COMMISSION LOG". */
  eyebrow: string;
  title: string;
  /** Substring of `title` rendered in the gold gradient. */
  titleHighlight?: string;
  /** Trailing controls (create button, refresh, …). */
  actions?: ReactNode;
  className?: string;
}

export function DashboardPageHeader({
  icon,
  eyebrow,
  title,
  titleHighlight,
  actions,
  className,
}: DashboardPageHeaderProps) {
  return (
    <motion.div
      className={cn(
        "mb-8 border-b border-leather-caramel/20 pb-5",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AssetIcon icon={icon} size="lg" className="shrink-0" />
          <div className="min-w-0">
            <span className="codex-label-gold">{eyebrow}</span>
            <h1 className="font-display text-xl font-bold tracking-[0.08em] text-leather-dark sm:text-2xl">
              {/* The highlight must be a substring of the title; when a caller
                  passes something else the two are joined instead of being
                  concatenated without a separator. */}
              {!titleHighlight ? (
                title
              ) : title.includes(titleHighlight) ? (
                <>
                  {title.replace(titleHighlight, "")}
                  <span className="codex-gradient-text">{titleHighlight}</span>
                </>
              ) : (
                <>
                  {title} <span className="codex-gradient-text">{titleHighlight}</span>
                </>
              )}
            </h1>
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </motion.div>
  );
}
