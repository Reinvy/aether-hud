"use client";

import { motion } from "framer-motion";
import { AssetIcon } from "@/components/ui/asset-icon";
import { fadeInUp } from "@/lib/motion-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SiteIdentityValues {
  siteName: string;
  siteDescription: string;
  edition: string;
}

interface SiteIdentityCardProps {
  values: SiteIdentityValues;
  onChange: (field: keyof SiteIdentityValues, value: string) => void;
  /** Panel grid position — drives the staggered enter animation delay. */
  delay?: number;
}

/**
 * SiteIdentityCard — editable codex identity panel for the settings page.
 *
 * Owns the public-facing identity fields (codex name, description, version).
 * The view feeds the current form values in and receives field updates through
 * the onChange callback — the card stays presentation-only.
 */
export function SiteIdentityCard({ values, onChange, delay = 0 }: SiteIdentityCardProps) {
  return (
    <motion.div {...fadeInUp} transition={{ delay }}>
      <Card variant="glass" hover="none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AssetIcon icon="map" size="sm" />
            <CardTitle>Codex Identity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Codex name"
            value={values.siteName}
            onChange={(e) => onChange("siteName", e.target.value)}
            placeholder="Teyvat Codex"
          />
          <Textarea
            label="Codex description"
            rows={3}
            value={values.siteDescription}
            onChange={(e) => onChange("siteDescription", e.target.value)}
            placeholder="Interactive Traveler Dossier — portfolio, domains, talents and commissions"
            className="resize-none"
          />
          <p className="mt-1 codex-label text-[9px] text-leather-muted">
            Appears in search results and link previews
          </p>
          <Input
            label="Codex version"
            value={values.edition}
            onChange={(e) => onChange("edition", e.target.value)}
            placeholder="Teyvat Codex Edition"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
