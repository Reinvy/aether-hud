"use client";

import { AssetIcon } from "@/components/ui/asset-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface BioCardProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * BioCard — biography editor panel for the traveler dossier.
 *
 * Controlled by the parent's form state: the markdown-supported bio textarea
 * inside the shared Codex panel treatment, with a short hint underneath.
 */
export function BioCard({ value, onChange }: BioCardProps) {
  return (
    <Card variant="glass" hover="none" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AssetIcon icon="archive" size="sm" />
          <CardTitle>Biography</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          label="Bio"
          rows={10}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="A short chronicle of the traveler…"
          className="resize-none"
        />
        <p className="mt-2 codex-label text-[9px] text-leather-muted">
          Markdown supported. Shown in the hero dossier.
        </p>
      </CardContent>
    </Card>
  );
}
