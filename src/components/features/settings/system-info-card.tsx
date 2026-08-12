"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { fadeInUp } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/info-row";

interface SystemInfoCardProps {
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
}

/**
 * SystemInfoCard — static stack readout for the dashboard settings page.
 *
 * Extracted from settings-view. Displays the fixed platform facts
 * (framework / database / deploy / design system) as InfoRow entries.
 * Pure presentation — no props beyond the animation delay.
 */
export function SystemInfoCard({ delay = 0 }: SystemInfoCardProps) {
  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-gold-400" />
            <CardTitle>System Info</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow
            label="FRAMEWORK"
            value="Next.js 16"
          />
          <InfoRow
            label="DATABASE"
            value="PostgreSQL"
            tone="stellar"
          />
          <InfoRow
            label="DEPLOY"
            value="Vercel"
          />
          <InfoRow
            label="DESIGN SYSTEM"
            value="AETHER-HUD v2"
            tone="gold"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
