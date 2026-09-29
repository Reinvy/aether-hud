"use client";

import { motion } from "framer-motion";
import { Monitor, Palette } from "lucide-react";
import { fadeInUp } from "@/lib/motion-variants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";

interface AppearanceCardProps {
  animationsEnabled: boolean;
  onAnimationsChange: (enabled: boolean) => void;
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
}

/**
 * AppearanceCard — the palette statement plus the motion switch.
 *
 * The codex ships in exactly one palette (warm ivory parchment & saddle
 * leather), so the first row states the active theme instead of pretending to
 * be a chooser. The only operator-controlled visual preference is whether the
 * Teyvat motion layer plays.
 */
export function AppearanceCard({
  animationsEnabled,
  onAnimationsChange,
  delay = 0,
}: AppearanceCardProps) {
  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gold-ink" aria-hidden="true" />
            <CardTitle>Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            aria-disabled="true"
            className="flex items-center gap-4 codex-radius-card border-2 border-leather-caramel/40 bg-leather-caramel/10 px-4 py-3"
          >
            <span
              className="h-4 w-4 rotate-45 bg-parchment-base ring-1 ring-leather-caramel/40"
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="font-display text-xs font-semibold tracking-[0.08em] text-leather-dark">
                Teyvat Codex
              </p>
              <p className="font-body text-[11px] text-leather-muted">
                warm ivory parchment &amp; saddle leather
              </p>
            </div>
            <Badge variant="gold" size="sm">Active</Badge>
          </div>

          <div className="flex items-center justify-between codex-radius-card border border-border-subtle bg-parchment-subtle/70 px-4 py-3">
            <label htmlFor="animations-toggle" className="flex cursor-pointer items-center gap-3">
              <Monitor className="h-4 w-4 text-leather-caramel" aria-hidden="true" />
              <span>
                <span className="block font-body text-xs font-medium text-leather-dark">
                  Motion effects
                </span>
                <span className="block font-body text-[11px] text-leather-muted">
                  Framer Motion transitions across the codex
                </span>
              </span>
            </label>
            <Toggle
              id="animations-toggle"
              checked={animationsEnabled}
              onChange={onAnimationsChange}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
