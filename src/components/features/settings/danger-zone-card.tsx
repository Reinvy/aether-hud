"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { fadeInUp } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DangerZoneCardProps {
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
  onReset?: () => void;
  resetting?: boolean;
}

/**
 * DangerZoneCard — irreversible-action panel for the settings page.
 *
 * Renders as warm parchment in the light realm and only borrows the deep
 * surface in Celestial Night; the destructive accent stays hud-danger in both.
 */
export function DangerZoneCard({ delay = 0, onReset, resetting = false }: DangerZoneCardProps) {
  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-hud-danger" aria-hidden="true" />
            <CardTitle className="text-hud-danger">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-body text-xs leading-relaxed text-text-muted dark:text-platinum-200">
            These actions are irreversible. Proceed with caution.
          </p>
          <div className="flex items-center justify-between gap-3 codex-radius-sm border border-hud-danger/30 bg-hud-danger/5 px-4 py-3 dark:bg-hud-danger/10">
            <div className="min-w-0">
              <p className="font-body text-xs font-medium text-text-main dark:text-platinum-50">Reset all data</p>
              <p className="font-body text-[11px] text-text-muted dark:text-platinum-200">
                Restore the authored seed data
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              glow="none"
              onClick={onReset}
              disabled={resetting || !onReset}
              loading={resetting}
              className="shrink-0 border-hud-danger/30 text-hud-danger hover:bg-hud-danger/10"
            >
              {!resetting && <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
