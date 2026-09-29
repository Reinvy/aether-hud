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
 * Renders as a warm parchment panel; the destructive accent is crimson.
 */
export function DangerZoneCard({ delay = 0, onReset, resetting = false }: DangerZoneCardProps) {
  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-crimson-600" aria-hidden="true" />
            <CardTitle className="text-crimson-600">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-body text-xs leading-relaxed text-leather-muted">
            These actions are irreversible. Proceed with caution.
          </p>
          <div className="flex items-center justify-between gap-3 codex-radius-card border border-crimson-600/30 bg-crimson-600/8 px-4 py-3">
            <div className="min-w-0">
              <p className="font-body text-xs font-medium text-leather-dark">Reset all data</p>
              <p className="font-body text-[11px] text-leather-muted">
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
              className="shrink-0 border-crimson-600/30 text-crimson-600 hover:bg-crimson-600/8"
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
