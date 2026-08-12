"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { fadeInUp } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface SiteIdentityValues {
  siteName: string;
  siteDescription: string;
  sysVersion: string;
}

interface SiteIdentityCardProps {
  values: SiteIdentityValues;
  onChange: (field: keyof SiteIdentityValues, value: string) => void;
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
}

/**
 * SiteIdentityCard — editable web-identity panel for the dashboard
 * settings page.
 *
 * Extracted from settings-view so the identity fields (site name,
 * description, sys version) are a self-contained unit. The view feeds
 * the current form values in and receives field updates through the
 * onChange callback — the card stays presentation-only.
 */
export function SiteIdentityCard({ values, onChange, delay = 0 }: SiteIdentityCardProps) {
  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gold-400" />
            <CardTitle>Site Identity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="FIELD_01 // SITE NAME"
            value={values.siteName}
            onChange={(e) => onChange("siteName", e.target.value)}
            placeholder="AETHER-HUD"
          />
          <Textarea
            label="FIELD_02 // SITE DESCRIPTION"
            rows={3}
            value={values.siteDescription}
            onChange={(e) => onChange("siteDescription", e.target.value)}
            placeholder="High-End Tactical Portfolio"
            className="resize-none"
          />
          <p className="mt-1 sys-label text-[9px] text-text-muted">
            Used for SEO meta tags and social sharing
          </p>
          <Input
            label="FIELD_03 // SYS VERSION"
            value={values.sysVersion}
            onChange={(e) => onChange("sysVersion", e.target.value)}
            placeholder="v2.4.1"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
