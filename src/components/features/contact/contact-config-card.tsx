"use client";

import { memo } from "react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusDot } from "@/components/ui/status-dot";
import type { ConfigDto } from "@/lib/dto";

/**
 * ContactConfigCard — dashboard widget for the site contact configuration.
 *
 * Renders the read-only profile fields plus the editable email address; the
 * parent owns data fetching, the save handler and the error it reports.
 */

interface ContactConfigCardProps {
  config: ConfigDto | null;
  email: string;
  onEmailChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
  /** Save failure reported by the parent, rendered above the button. */
  error?: string | null;
}

export const ContactConfigCard = memo(function ContactConfigCard({
  config,
  email,
  onEmailChange,
  onSave,
  saving,
  error = null,
}: ContactConfigCardProps) {
  return (
    <Card variant="glass" hover="none" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AssetIcon icon="mail" size="sm" />
          <CardTitle>Contact Config</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input label="Display name" value={config?.name ?? ""} disabled />
        <Input label="Tagline" value={config?.tagline ?? ""} disabled />
        <Input
          label="Email address"
          type="email"
          placeholder="hello@aether-hud.dev"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <Input label="Location" value={config?.location ?? ""} disabled />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Status"
            value={config?.status ?? "ONLINE"}
            disabled
            prefix={<StatusDot tone="active" pulse label="Online" />}
            /* .codex-input is unlayered CSS so it beats Tailwind utility
               classes in v4's cascade layers — inline style is the only way
               to tint a disabled input's value text. */
            style={{ color: "var(--color-jade-ink)" }}
          />
          <Input
            label="Sys version"
            value={config?.edition ?? "Teyvat Codex Edition"}
            disabled
            style={{ color: "var(--color-leather-muted)" }}
          />
        </div>
        {error && (
          <p role="alert" className="text-xs text-crimson-600">
            {error}
          </p>
        )}
        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onSave} loading={saving}>
            Update email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
