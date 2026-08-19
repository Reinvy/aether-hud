"use client";

import { memo } from "react";
import { RefreshCw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot, type StatusTone } from "@/components/ui/status-dot";

/**
 * ActivityFeed — reusable HUD activity log panel.
 *
 * Displays live system events and content audit changes with
 * tactical status dots and mono timestamps.
 */

export interface ActivityItem {
  id?: string;
  action: string;
  detail: string;
  time: string;
  type: "deploy" | "update" | "calibrate" | "sync";
}

const DOT_TONE: Record<ActivityItem["type"], StatusTone> = {
  deploy: "active",
  update: "gold",
  calibrate: "stellar",
  sync: "stellar",
};

export const ActivityFeed = memo(function ActivityFeed({
  items,
}: {
  items: ActivityItem[];
}) {
  return (
    <Card variant="glass" hover="none" diamond className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold-400" aria-hidden="true" />
            <CardTitle>Activity Log</CardTitle>
          </div>
          <RefreshCw className="h-3.5 w-3.5 text-text-muted/60" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4" aria-label="System activity log">
          {items.length === 0 ? (
            <p className="py-4 text-center font-mono text-xs text-text-muted">
              [EMPTY] // No activity logged
            </p>
          ) : (
            items.map((activity, i) => (
              <div key={activity.id || i} className="flex gap-3 group">
                <StatusDot
                  tone={DOT_TONE[activity.type] || "gold"}
                  label={activity.action}
                  className="mt-0.5 transition-transform duration-200 group-hover:scale-125"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[11px] font-medium tracking-wider text-text-main group-hover:text-gold-400 transition-colors duration-200">
                    {activity.action}
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] text-text-muted truncate">
                    {activity.detail}
                  </p>
                  <p className="sys-label mt-0.5 text-[8px] font-mono tabular-nums">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
});
