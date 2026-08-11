"use client";

import { RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * QuickActionsPanel — operator shortcut cluster for the dashboard
 * overview page.
 *
 * Extracted from overview-view so the quick-actions card is a reusable
 * unit. Currently ships the two tactical shortcuts (SYNC DATA / VIEW
 * ANALYTICS); future shortcuts slot in here without touching the view.
 */
export function QuickActionsPanel() {
  return (
    <Card variant="glass" hover="none" diamond>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="sys-label-gold text-[9px]">QUICK ACTIONS //</span>
          <Button variant="secondary" size="sm">
            <RefreshCw className="h-3.5 w-3.5" />
            SYNC DATA
          </Button>
          <Button variant="secondary" size="sm">
            <Users className="h-3.5 w-3.5" />
            VIEW ANALYTICS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
