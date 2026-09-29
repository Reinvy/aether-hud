"use client";

import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import { fadeInUp } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/info-row";
import { useData } from "@/lib/use-data";
import type { ConfigDto } from "@/lib/dto";

interface SystemInfoCardProps {
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
}

/**
 * SystemInfoCard — read-only codex readout for the settings page.
 *
 * Reports the identity and platform facts of this deployment: the codex name
 * and edition the operator published (`siteName` / `edition` from
 * `/api/config`), its availability, and the stack serving it.
 */
export function SystemInfoCard({ delay = 0 }: SystemInfoCardProps) {
  const { data: config } = useData<ConfigDto>("/api/config");

  const siteName = config?.siteName || "Teyvat Codex";
  const edition = config?.edition || "Teyvat Codex Edition";
  const sysStatus = config?.status || "ONLINE";

  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-gold-ink" aria-hidden="true" />
            <CardTitle>System Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow
            label="Codex"
            value={siteName}
          />
          <InfoRow
            label="Codex version"
            value={edition}
            tone="gold"
          />
          <InfoRow
            label="Availability"
            value={sysStatus}
            tone="jade"
          />
          <InfoRow
            label="Platform"
            value="Next.js 16 · App Router"
          />
          <InfoRow
            label="Data store"
            value="PostgreSQL · Prisma"
            tone="jade"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
