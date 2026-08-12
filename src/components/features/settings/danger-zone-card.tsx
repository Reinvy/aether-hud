"use client";

import { motion } from "framer-motion";
import { RefreshCw, Settings2 } from "lucide-react";
import { fadeInUp } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DangerZoneCardProps {
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
}

/**
 * DangerZoneCard — irreversible-action warning panel for the dashboard
 * settings page.
 *
 * Extracted from settings-view. Pure presentation: the reset entry is a
 * static (non-wired) control, kept byte-identical to the original view.
 */
export function DangerZoneCard({ delay = 0 }: DangerZoneCardProps) {
  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-hud-danger" />
            <CardTitle className="text-hud-danger">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-mono text-[10px] text-text-muted leading-relaxed">
            These actions are irreversible. Proceed with caution.
          </p>
          <div className="flex items-center justify-between chamfered-sm border border-hud-danger/30 bg-[rgba(255,0,85,0.04)] px-4 py-3">
            <div>
              <p className="font-mono text-xs tracking-wider text-text-main">RESET ALL DATA</p>
              <p className="font-mono text-[9px] text-text-muted">Clear all portfolio content</p>
            </div>
            <Button variant="secondary" size="sm" glow="none" className="text-hud-danger border-hud-danger/30">
              <RefreshCw className="h-3.5 w-3.5" />
              RESET
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
