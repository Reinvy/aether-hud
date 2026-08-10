"use client";

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

export function ContactConfigCard({
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
          <div>
            <label className="sys-label mb-2 block text-text-muted">
              FIELD_05 // STATUS
            </label>
            <div className="input-recessed flex items-center gap-2 px-4 py-2.5">
              <span className="led-active" />
              <span className="font-mono text-xs text-stellar-400">{config?.status ?? "ONLINE"}</span>
            </div>
          </div>
          <div>
            <label className="sys-label mb-2 block text-text-muted">
              FIELD_06 // SYS VERSION
            </label>
            <div className="input-recessed flex items-center px-4 py-2.5">
              <span className="font-mono text-xs text-text-muted">{config?.sysVersion ?? "v2.4.1"}</span>
            </div>
          </div>
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
}
