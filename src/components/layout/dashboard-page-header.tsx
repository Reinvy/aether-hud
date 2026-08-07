/**
 * DashboardPageHeader — Reusable header component for all dashboard sub-pages
 * AETHER-HUD Design System: Obsidian & Imperial Gold
 */
"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/ui/status-dot";

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-gold-400" />
            <span className="sys-label-gold">{label}</span>
          </div>
          <h1 className="font-display text-xl font-bold tracking-[0.08em] text-text-main sm:text-2xl">
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
              <StatusDot
                tone={statusActive ? "active" : "danger"}
                pulse={statusActive}
                label={statusLabel}
                className="h-1.5 w-1.5"
              />
              <span className="sys-label-active hidden text-[10px] sm:inline">{statusLabel}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
