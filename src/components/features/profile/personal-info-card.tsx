"use client";

import { UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProfileFormState {
  name: string;
  tagline: string;
  email: string;
  location: string;
  edition: string;
  bio: string;
  status: string;
  avatar: string;
}

interface PersonalInfoCardProps {
  form: ProfileFormState;
  onFieldChange: (key: string, value: string) => void;
}

/**
 * PersonalInfoCard — traveler identity fields panel.
 *
 * Extracted from the dashboard profile view: the seven identity fields
 * (name, tagline, email, location, codex version, status, avatar) that make
 * up the public dossier. The parent owns the form state and the save handler;
 * this card is a controlled, presentational sub-component.
 */
export function PersonalInfoCard({ form, onFieldChange }: PersonalInfoCardProps) {
  return (
    <Card variant="glass" hover="none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-gold-400" aria-hidden="true" />
          <CardTitle>Personal Info</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Display name"
          value={form.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          placeholder="Your name"
        />
        <Input
          label="Tagline"
          value={form.tagline}
          onChange={(e) => onFieldChange("tagline", e.target.value)}
          placeholder="Full-Stack Developer & AI Engineer"
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          placeholder="hello@aether-hud.dev"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => onFieldChange("location", e.target.value)}
            placeholder="Jakarta, Indonesia"
          />
          <Input
            label="Codex version"
            value={form.edition}
            onChange={(e) => onFieldChange("edition", e.target.value)}
            placeholder="Teyvat Codex Edition"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Status"
            value={form.status}
            onChange={(e) => onFieldChange("status", e.target.value)}
            placeholder="ONLINE"
          />
          <Input
            label="Avatar URL"
            value={form.avatar}
            onChange={(e) => onFieldChange("avatar", e.target.value)}
            placeholder="/placeholder.svg"
          />
        </div>
      </CardContent>
    </Card>
  );
}
