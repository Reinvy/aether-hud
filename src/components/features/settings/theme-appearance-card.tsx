"use client";

import { motion } from "framer-motion";
import { Monitor, Palette } from "lucide-react";
import { fadeInUp } from "@/lib/motion-variants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface ThemePreset {
  key: string;
  name: string;
  desc: string;
  color: string;
}

const THEME_PRESETS: ThemePreset[] = [
  { key: "obsidian", name: "OBSIDIAN", desc: "Deep space & imperial gold", color: "bg-gold-400" },
  { key: "night-ops", name: "NIGHT OPS", desc: "Dark tactical & stellar blue", color: "bg-stellar-400" },
  { key: "titanium", name: "TITANIUM", desc: "Platinum & silver frost", color: "bg-platinum-100" },
];

interface ThemeAppearanceCardProps {
  themePreset: string;
  animationsEnabled: boolean;
  onChange: (field: "themePreset" | "animationsEnabled", value: string | boolean) => void;
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
}

/**
 * ThemeAppearanceCard — theme preset selector + animation toggle for the
 * dashboard settings page.
 *
 * Extracted from settings-view. Owns the THEME_PRESETS registry and
 * renders the hexagonal-color preset rows plus the animations switch.
 * The view feeds current form values in and receives
 * updates through onChange — the card stays presentation-only.
 */
export function ThemeAppearanceCard({
  themePreset,
  animationsEnabled,
  onChange,
  delay = 0,
}: ThemeAppearanceCardProps) {
  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gold-400" />
            <CardTitle>Theme & Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Presets */}
          <div>
            <span className="sys-label mb-3 block">FIELD_04 // THEME PRESET</span>
            <div className="grid grid-cols-1 gap-3">
              {THEME_PRESETS.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => onChange("themePreset", theme.key)}
                  className={cn(
                    "flex items-center gap-4 chamfered-sm border-2 px-4 py-3 text-left transition-all duration-300",
                    "hover-scale-sm press-scale focus-ring-gold",
                    themePreset === theme.key
                      ? "border-gold-400 bg-[rgba(242,201,76,0.06)]"
                      : "border-border-subtle text-text-muted hover:border-border-glass"
                  )}
                >
                  <span className={cn("h-4 w-4 rotate-45 border border-border-glass/40", theme.color)} />
                  <div className="flex-1">
                    <p className={cn(
                      "font-mono text-xs font-medium tracking-wider",
                      themePreset === theme.key ? "text-gold-400" : "text-text-main"
                    )}>
                      {theme.name}
                    </p>
                    <p className="font-mono text-[9px] text-text-muted">{theme.desc}</p>
                  </div>
                  {themePreset === theme.key && (
                    <Badge variant="gold" size="sm">ACTIVE</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Animations Toggle */}
          <div className="flex items-center justify-between chamfered-sm border border-border-subtle bg-deep-space/40 px-4 py-3 transition-colors duration-300 hover:border-border-glass hover:bg-[rgba(242,201,76,0.04)]">
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4 text-gold-400/60" />
              <div>
                <p className="font-mono text-xs tracking-wider text-text-main">FIELD_05 // ANIMATIONS</p>
                <p className="font-mono text-[9px] text-text-muted">Framer Motion effects</p>
              </div>
            </div>
            <Toggle
              id="animations-toggle"
              checked={animationsEnabled}
              onChange={(v) => onChange("animationsEnabled", v)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
