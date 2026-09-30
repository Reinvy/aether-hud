"use client";

import { memo } from "react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot, type StatusTone } from "@/components/ui/status-dot";

/**
 * ActivityFeed — the Codex Console chronicle of recent content changes.
 *
 * Renders the /api/dashboard/activity payload (a deploy/update/calibrate/sync
 * feed) as a dated list of entries with their status diamond.
 */

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  time: string;
  type: "deploy" | "update" | "calibrate" | "sync";
  /** ISO instant the entry happened; the list is already sorted by it. */
  timestamp: string;
}

const DOT_TONE: Record<ActivityItem["type"], StatusTone> = {
  deploy: "active",
  update: "gold",
  calibrate: "jade",
  sync: "jade",
};

export const ActivityFeed = memo(function ActivityFeed({
  items,
}: {
  items: ActivityItem[];
}) {
  return (
    <Card variant="glass" hover="none" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AssetIcon icon="archiveTravelLog" size="sm" />
          <CardTitle>Activity Log</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4" aria-label="Recent activity">
          {items.length === 0 ? (
            <p className="py-6 text-center text-xs font-body text-leather-muted">
              Nothing has changed in the codex yet.
            </p>
          ) : (
            items.map((activity, i) => (
              <div key={activity.id || i} className="flex gap-3 group">
                <StatusDot
                  tone={DOT_TONE[activity.type] || "gold"}
                  label={activity.action}
                  className="mt-1.5 transition-transform duration-200 group-hover:scale-125"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-sm font-semibold text-leather-dark transition-colors duration-200 group-hover:text-leather-caramel">
                    {activity.action}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-body text-leather-muted">
                    {activity.detail}
                  </p>
                  <p className="codex-label mt-1 text-[9px] tabular-nums">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
});
