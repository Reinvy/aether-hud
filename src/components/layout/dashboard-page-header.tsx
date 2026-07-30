/**
 * DashboardPageHeader — Reusable header component for all dashboard sub-pages
 * AETHER-HUD Design System: Obsidian & Imperial Gold
 */
"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
  icon: React.ElementType;
  label: string;
  title: string;
  titleHighlight?: string;
  actions?: ReactNode;
  statusLabel?: string;
  statusActive?: boolean;
  className?: string;
}

export function DashboardPageHeader({
  icon: Icon,
  label,
  title,
  titleHighlight,
  actions,
  statusLabel = "ALL SYSTEMS NOMINAL",
  statusActive = true,
  className,
}: DashboardPageHeaderProps) {
  return (
    <motion.div
      className={cn("mb-8", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Icon className="h-4 w-4 text-gold-400" />
            <span className="sys-label-gold">{label}</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
            {titleHighlight ? (
              <>
                {title.replace(titleHighlight, "")}
                <span className="text-gradient-gold">{titleHighlight}</span>
              </>
            ) : (
              title
            )}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {actions}
          {(statusLabel || statusActive !== undefined) && (
            <>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  statusActive ? "bg-hud-active animate-energy-pulse" : "bg-hud-danger"
                )}
              />
              <span className="sys-label-active text-[10px]">{statusLabel}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
