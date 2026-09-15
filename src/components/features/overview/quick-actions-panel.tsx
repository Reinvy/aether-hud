"use client";

import { useState } from "react";
import { Gauge, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionsPanelProps {
  /** Refetches the overview data feeds (stats, domains, activity). */
  onSync?: () => void | Promise<void>;
  className?: string;
}

/**
 * QuickActionsPanel — shortcut cluster for the Codex Console overview.
 *
 * Two working shortcuts:
 *   - "Refresh codex" runs `onSync` (the overview refetches its stats,
 *     domain and activity feeds) with the elemental diamond spinning while
 *     the refetch is in flight.
 *   - "Open observatory" navigates to the /dashboard/telemetry page.
 *
 * `onSync` is optional so a static variant can render without handlers; the
 * observatory shortcut always navigates.
 */
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
    <Card variant="glass" hover="none" className={className}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="codex-label-gold text-[9px]">Quick actions</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSync}
            disabled={syncing || !onSync}
            aria-busy={syncing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", syncing && "elemental-rotate")} aria-hidden="true" />
            {syncing ? "Refreshing…" : "Refresh codex"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/dashboard/telemetry")}
          >
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            Open observatory
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
