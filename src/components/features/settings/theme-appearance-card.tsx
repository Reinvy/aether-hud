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
  /** Swatch classes — stable accents, identical in both themes. */
  swatch: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    key: "teyvat-codex",
    name: "Teyvat Codex",
    desc: "Warm ivory parchment & saddle leather — the light default",
    swatch: "bg-gold-100",
  },
  {
    key: "celestial-night",
    name: "Celestial Night",
    desc: "Midnight indigo & electro stardust — the dark realm",
    swatch: "bg-deep-space",
  },
];

interface ThemeAppearanceCardProps {
  themePreset: string;
  animationsEnabled: boolean;
  onChange: (field: "themePreset" | "animationsEnabled", value: string | boolean) => void;
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
}

/**
 * ThemeAppearanceCard — theme preset selector + animation switch for the
 * settings page.
 *
 * Owns the THEME_PRESETS registry and renders the preset rows plus the
 * animations toggle. The view feeds current form values in and receives
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
            <Palette className="h-4 w-4 text-gold-400" aria-hidden="true" />
            <CardTitle>Theme & Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Presets */}
          <div>
            <span className="codex-label mb-3 block">Theme preset</span>
            <div className="grid grid-cols-1 gap-3">
              {THEME_PRESETS.map((theme) => (
                <button
                  key={theme.key}
                  type="button"
                  onClick={() => onChange("themePreset", theme.key)}
                  aria-pressed={themePreset === theme.key}
                  className={cn(
                    "flex items-center gap-4 codex-radius-sm border-2 px-4 py-3 text-left transition-all duration-300",
                    "hover-scale-sm press-scale codex-focus",
                    themePreset === theme.key
                      ? "border-leather-caramel bg-leather-caramel/10 dark:border-gold-400 dark:bg-gold-400/10"
                      : "border-border-subtle text-text-muted hover:border-border-glass dark:text-platinum-200"
                  )}
                >
                  <span
                    className={cn(
                      "h-4 w-4 rotate-45 border border-leather-caramel/40 dark:border-border-glass/40",
                      theme.swatch
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <p
                      className={cn(
                        "font-display text-xs font-semibold tracking-[0.08em]",
                        themePreset === theme.key
                          ? "text-leather-caramel dark:text-gold-400"
                          : "text-text-main dark:text-platinum-50"
                      )}
                    >
                      {theme.name}
                    </p>
                    <p className="font-body text-[11px] text-text-muted dark:text-platinum-200">{theme.desc}</p>
                  </div>
                  {themePreset === theme.key && (
                    <Badge variant="gold" size="sm">Active</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Animations Toggle */}
          <div className="flex items-center justify-between codex-radius-sm border border-border-subtle bg-parchment-subtle/70 px-4 py-3 transition-colors duration-300 hover:border-border-glass hover:bg-leather-caramel/10 dark:bg-deep-space/40 dark:hover:bg-gold-400/5">
            <label htmlFor="animations-toggle" className="flex cursor-pointer items-center gap-3">
              <Monitor className="h-4 w-4 text-leather-caramel dark:text-gold-400/60" aria-hidden="true" />
              <span>
                <span className="block font-body text-xs font-medium text-text-main dark:text-platinum-50">Motion effects</span>
                <span className="block font-body text-[11px] text-text-muted dark:text-platinum-200">
                  Framer Motion transitions across the codex
                </span>
              </span>
            </label>
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
