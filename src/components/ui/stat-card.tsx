"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * StatCard — reusable HUD dashboard stat card.
 *
 * Extracted from the dashboard overview page so every stat tile
 * (ACTIVE PROJECTS, SKILL MODULES, ...) shares the same Obsidian &
 * Imperial Gold treatment: glass chamfered panel, sys-label, display
 * value, tone-colored icon with hover scale/rotate/brighten.
 */
interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Accent tone for the value + icon. */
  tone?: "gold" | "stellar";
  className?: string;
}

export function StatCard({ label, value, icon: Icon, tone = "gold", className }: StatCardProps) {
  return (
    <Card variant="glass" hover="lift" diamond className={className}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <span className="sys-label text-[9px]">{label}</span>
            <p
              className={cn(
                "mt-2 font-display text-2xl sm:text-3xl font-bold tracking-wider tabular-nums",
                tone === "gold" ? "text-gold-400" : "text-stellar-400"
              )}
            >
              {value}
            </p>
          </div>
          <Icon
            className={cn(
              "h-6 w-6 sm:h-8 sm:w-8 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
              tone === "gold"
                ? "text-gold-400/30 group-hover:text-gold-400/60"
                : "text-stellar-400/30 group-hover:text-stellar-400/60"
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
