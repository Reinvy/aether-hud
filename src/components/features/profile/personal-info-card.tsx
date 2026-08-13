"use client";

import { Smile } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * PersonalInfoCard — reusable identity fields panel for profile control.
 *
 * Extracted from the dashboard profile view: the seven identity fields
 * (name/tagline/email/location/sysVersion/status/avatar) rendered as a
 * chamfered HUD card with FIELD_xx sys-labels. The parent owns the form
 * state and save handler; this card is a controlled, presentational
 * sub-component.
 */

export interface ProfileFormState {
  name: string;
  tagline: string;
  email: string;
  location: string;
  sysVersion: string;
  bio: string;
  status: string;
  avatar: string;
}

interface PersonalInfoCardProps {
  form: ProfileFormState;
  onFieldChange: (key: string, value: string) => void;
}

export function PersonalInfoCard({ form, onFieldChange }: PersonalInfoCardProps) {
  return (
    <Card variant="glass" hover="none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Smile className="h-4 w-4 text-gold-400" />
          <CardTitle>Personal Info</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="FIELD_01 // DISPLAY NAME"
          value={form.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          placeholder="Your name"
        />
        <Input
          label="FIELD_02 // TAGLINE"
          value={form.tagline}
          onChange={(e) => onFieldChange("tagline", e.target.value)}
          placeholder="Full-Stack Developer & AI Engineer"
        />
        <Input
          label="FIELD_03 // EMAIL NODE"
          type="email"
          value={form.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          placeholder="hello@aether-hud.dev"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="FIELD_04 // LOCATION"
            value={form.location}
            onChange={(e) => onFieldChange("location", e.target.value)}
            placeholder="Jakarta, Indonesia"
          />
          <Input
            label="FIELD_05 // SYS VERSION"
            value={form.sysVersion}
            onChange={(e) => onFieldChange("sysVersion", e.target.value)}
            placeholder="v2.4.1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="FIELD_06 // STATUS"
            value={form.status}
            onChange={(e) => onFieldChange("status", e.target.value)}
            placeholder="ONLINE"
          />
          <Input
            label="FIELD_07 // AVATAR URL"
            value={form.avatar}
            onChange={(e) => onFieldChange("avatar", e.target.value)}
            placeholder="/placeholder.svg"
          />
        </div>
      </CardContent>
    </Card>
  );
}
