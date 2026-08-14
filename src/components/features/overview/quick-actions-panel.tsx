"use client";

import { useState } from "react";
import { RefreshCw, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * QuickActionsPanel — operator shortcut cluster for the dashboard
 * overview page.
 *
 * Extracted from overview-view so the quick-actions card is a reusable
 * unit. The two tactical shortcuts are functional:
 *   - SYNC DATA     → calls `onSync` (the overview view refetches its
 *                     stats + project feeds) with a HUD-rotate loading
 *                     state while the refetch is in flight.
 *   - VIEW ANALYTICS → navigates to the /dashboard/telemetry node.
 *
 * `onSync` is optional so a static variant can render without handlers;
 * the ANALYTICS shortcut always navigates.
 */
interface QuickActionsPanelProps {
  /** Refetches the overview data feeds (stats + projects). */
  onSync?: () => void | Promise<void>;
  className?: string;
}

export function QuickActionsPanel({ onSync, className }: QuickActionsPanelProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  async function handleSync() {
    if (!onSync || syncing) return;
    setSyncing(true);
    try {
      await onSync();
    } finally {
      setSyncing(false);
    }
  }

  return (
    <Card variant="glass" hover="none" diamond className={className}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="sys-label-gold text-[9px]">QUICK ACTIONS //</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSync}
            disabled={syncing || !onSync}
            aria-busy={syncing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", syncing && "hud-rotate")} />
            {syncing ? "SYNCING..." : "SYNC DATA"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/dashboard/telemetry")}
          >
            <Users className="h-3.5 w-3.5" />
            VIEW ANALYTICS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
