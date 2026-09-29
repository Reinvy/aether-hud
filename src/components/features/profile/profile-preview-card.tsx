"use client";

import { Globe, Mail, MapPin, Tag, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot } from "@/components/ui/status-dot";

interface ProfilePreviewData {
  name: string;
  tagline: string;
  location: string;
  email: string;
  edition: string;
  status: string;
}

interface ProfilePreviewCardProps {
  data: ProfilePreviewData;
}

/**
 * ProfilePreviewCard — live identity readout for the traveler dossier.
 *
 * Self-contained unit: avatar frame, display name, tagline, meta line and the
 * availability mark all render from a single ProfilePreviewData record, so the
 * view mirrors the current form state back to the operator as they type.
 */
export function ProfilePreviewCard({ data }: ProfilePreviewCardProps) {
  const isOnline = data.status === "ONLINE";

  return (
    <Card variant="glass" hover="none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gold-ink" aria-hidden="true" />
          <CardTitle>Profile Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-6">
          {/* Avatar frame */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-leather-caramel/30 bg-parchment-subtle">
            <User className="h-7 w-7 text-leather-caramel/60" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-bold tracking-[0.08em] text-leather-dark">
              {data.name || "Display name"}
            </h3>
            <p className="font-body text-xs font-medium text-leather-caramel">
              {data.tagline || "Tagline"}
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              {data.location && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-leather-muted">
                  <MapPin className="h-3 w-3" aria-hidden="true" /> {data.location}
                </span>
              )}
              {data.email && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-leather-muted">
                  <Mail className="h-3 w-3" aria-hidden="true" /> {data.email}
                </span>
              )}
              {data.edition && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-leather-muted">
                  <Tag className="h-3 w-3" aria-hidden="true" /> {data.edition}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot
              tone={isOnline ? "active" : "warning"}
              pulse={isOnline}
              label={data.status || "ONLINE"}
            />
            <span className="codex-label-active text-[9px]">{data.status || "ONLINE"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
