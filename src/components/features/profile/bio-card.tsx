"use client";

import { Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

/**
 * BioCard — reusable bio/summary editor panel for profile control.
 *
 * Extracted from the dashboard profile view: the markdown-supported bio
 * textarea rendered as a chamfered HUD card. Controlled by the parent's
 * form state; renders the sys-label hint under the field.
 */

interface BioCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function BioCard({ value, onChange }: BioCardProps) {
  return (
    <Card variant="glass" hover="none" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-gold-400" />
          <CardTitle>Bio / Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          label="FIELD_08 // BIO"
          rows={10}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="System bio..."
          className="resize-none"
        />
        <p className="mt-2 sys-label text-[9px] text-text-muted">
          Markdown supported. Displayed in the Hero terminal section.
        </p>
      </CardContent>
    </Card>
  );
}
