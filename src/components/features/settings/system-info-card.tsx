"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { fadeInUp } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/info-row";
import { useData } from "@/lib/use-data";

interface SystemInfoCardProps {
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
}

interface SiteConfig {
  siteName: string;
  sysVersion: string;
  status: string;
}

/**
 * SystemInfoCard — dynamic stack readout for the dashboard settings page.
 *
 * Displays live platform facts (framework / database / deploy / design system version).
 */
export function SystemInfoCard({ delay = 0 }: SystemInfoCardProps) {
  const { data: config } = useData<SiteConfig>("/api/config");

  const sysVersion = config?.sysVersion || "v2.4.1";
  const sysStatus = config?.status || "ONLINE";

  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-gold-400" aria-hidden="true" />
            <CardTitle>System Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow
            label="FRAMEWORK"
            value="Next.js 16 (App Router)"
          />
          <InfoRow
            label="DATABASE"
            value="PostgreSQL (Prisma ORM)"
            tone="stellar"
          />
          <InfoRow
            label="NODE STATUS"
            value={sysStatus}
            tone="stellar"
          />
          <InfoRow
            label="CORE DESIGN VERSION"
            value={`AETHER-HUD ${sysVersion}`}
            tone="gold"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
