"use client";

import { memo } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * ContactConfigCard — dashboard widget for the site contact configuration.
 *
 * Extracted from the contact dashboard view (was inline) so the view stays a
 * thin orchestrator. Renders the read-only profile fields plus the editable
 * email address; the parent owns data fetching and the save handler.
 */

export interface ApiConfig {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  status: string;
  sysVersion: string;
}

interface ContactConfigCardProps {
  config: ApiConfig | null;
  email: string;
  onEmailChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export const ContactConfigCard = memo(function ContactConfigCard({
  config,
  email,
  onEmailChange,
  onSave,
  saving,
}: ContactConfigCardProps) {
  return (
    <Card variant="glass" hover="none" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gold-400" />
          <CardTitle>Contact Config</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="FIELD_01 // DISPLAY NAME"
          value={config?.name ?? ""}
          disabled
        />
        <Input
          label="FIELD_02 // TAGLINE"
          value={config?.tagline ?? ""}
          disabled
        />
        <Input
          label="FIELD_03 // EMAIL ADDRESS"
          type="email"
          placeholder="hello@aether-hud.dev"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <Input
          label="FIELD_04 // LOCATION"
          value={config?.location ?? ""}
          disabled
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="FIELD_05 // STATUS"
            value={config?.status ?? "ONLINE"}
            disabled
            prefix={<span className="led-active" aria-hidden="true" />}
            /* .input-recessed is unlayered CSS so it beats Tailwind utility
               classes in v4's cascade layers — inline style is the only way
               to tint a disabled input's value text. */
            style={{ color: "var(--color-stellar-400)" }}
          />
          <Input
            label="FIELD_06 // SYS VERSION"
            value={config?.sysVersion ?? "v2.4.1"}
            disabled
            style={{ color: "var(--color-text-muted)" }}
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onSave}
            loading={saving}
          >
            UPDATE EMAIL
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
