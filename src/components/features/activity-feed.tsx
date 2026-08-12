"use client";

import { memo } from "react";
import { RefreshCw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot, type StatusTone } from "@/components/ui/status-dot";

/**
 * ActivityFeed — reusable HUD activity log panel.
 *
 * Extracted from the dashboard overview page so the "Activity Log" feed
 * (status dots + mono timestamps) can be reused across ops panels without
 * duplicating the glass diamond card + sys-label markup.
 */

interface ActivityItem {
  action: string;
  detail: string;
  time: string;
  type: "deploy" | "update" | "calibrate";
}

const DOT_TONE: Record<ActivityItem["type"], StatusTone> = {
  deploy: "active",
  update: "gold",
  calibrate: "stellar",
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
            <TrendingUp className="h-4 w-4 text-gold-400" />
            <CardTitle>Activity Log</CardTitle>
          </div>
          <RefreshCw className="h-3.5 w-3.5 text-text-muted/60" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="py-4 text-center font-mono text-xs text-text-muted">
              [EMPTY] // No activity logged
            </p>
          ) : (
            items.map((activity, i) => (
              <div key={i} className="flex gap-3 group">
                <StatusDot
                  tone={DOT_TONE[activity.type]}
                  label={activity.action}
                  className="mt-0.5 transition-transform duration-200 group-hover:scale-125"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[11px] font-medium tracking-wider text-text-main group-hover:text-gold-400 transition-colors duration-200">
                    {activity.action}
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] text-text-muted">
                    {activity.detail}
                  </p>
                  <p className="sys-label mt-0.5 text-[8px]">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
});
