"use client";

import { memo } from "react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Card, CardContent } from "@/components/ui/card";
import type { GenshinIconKey } from "@/lib/ui-icons";
import { cn } from "@/lib/utils";

/**
 * StatCard — reusable dashboard stat card.
 *
 * Extracted from the dashboard overview page so every stat tile
 * (ACTIVE PROJECTS, SKILL MODULES, ...) shares the same Teyvat Codex treatment: ledger card, codex-label, display
 * value, artwork medallion with hover scale.
 */
interface StatCardProps {
  label: string;
  value: string;
  icon: GenshinIconKey;
  /** Accent tone for the value + medallion. */
  tone?: "gold" | "jade";
  className?: string;
}

export const StatCard = memo(function StatCard({ label, value, icon, tone = "gold", className }: StatCardProps) {
  return (
    <Card variant="ledger" hover="lift" className={className}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="codex-label text-[9px]">{label}</span>
            <p
              className={cn(
                "mt-2 font-display text-2xl sm:text-3xl font-bold tracking-wider tabular-nums",
                tone === "gold" ? "text-gold-ink" : "text-jade-ink"
              )}
            >
              {value}
            </p>
          </div>
          <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">
            <AssetIcon icon={icon} size="md" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
});
