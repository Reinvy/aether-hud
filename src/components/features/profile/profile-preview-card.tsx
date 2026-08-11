"use client";

import { Globe, Mail, MapPin, Tag, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot } from "@/components/ui/status-dot";

export interface ProfilePreviewData {
  name: string;
  tagline: string;
  location: string;
  email: string;
  sysVersion: string;
  status: string;
}

/**
 * ProfilePreviewCard — live identity readout for the dashboard profile
 * page.
 *
 * Extracted from profile-view so the preview panel is a self-contained
 * unit: avatar frame, display name, tagline, meta chips and the system
 * status node all render from a single ProfilePreviewData record. The
 * view just feeds the current form state in.
 */
export function ProfilePreviewCard({ data }: { data: ProfilePreviewData }) {
  const isOnline = data.status === "ONLINE";

  return (
    <Card variant="glass" hover="none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gold-400" />
          <CardTitle>Profile Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-6">
          {/* Avatar placeholder */}
          <div className="flex h-16 w-16 items-center justify-center chamfered border-2 border-gold-400/30 bg-deep-space">
            <User className="h-7 w-7 text-gold-400/50" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold tracking-[0.08em] text-text-main">
              {data.name || "DISPLAY NAME"}
            </h3>
            <p className="font-mono text-xs text-gold-400/80">{data.tagline || "TAGLINE"}</p>
            <div className="mt-2 flex flex-wrap gap-4">
              {data.location && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
                  <MapPin className="h-3 w-3" /> {data.location}
                </span>
              )}
              {data.email && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
                  <Mail className="h-3 w-3" /> {data.email}
                </span>
              )}
              {data.sysVersion && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
                  <Tag className="h-3 w-3" /> {data.sysVersion}
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
            <span className="sys-label-active text-[9px]">{data.status || "ONLINE"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
