/**
 * Teyvat Codex Skeleton Loading Components
 * Reusable UI skeletons for loading states in the codex aesthetic.
 * Design: Teyvat Codex — warm fantasy.
 */
import { cn } from "@/lib/utils";

/** Shimmer animation class applied to every skeleton segment. */
const pulseClass = "codex-shimmer";

/* ─── Dashboard Stat Skeleton (module-private; used by DashboardPageSkeleton) ── */

interface DashboardStatSkeletonProps {
  className?: string;
}

function DashboardStatSkeleton({ className }: DashboardStatSkeletonProps) {
  return (
    <div className={cn("codex-card codex-panel-radius p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className={cn("h-3 w-24 bg-leather-caramel/20 rounded-full", pulseClass)} />
          <div className={cn("h-8 w-16 bg-leather-caramel/20 codex-radius-card", pulseClass)} />
        </div>
        <div className={cn("h-8 w-8 bg-leather-caramel/20 codex-radius-card", pulseClass)} />
      </div>
    </div>
  );
}

/* ─── Full Page Dashboard Skeleton ─────────────────────────── */

export function DashboardPageSkeleton() {
  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className={cn("h-4 w-4 bg-leather-caramel/20 rounded-full", pulseClass)} />
              <div className={cn("h-3 w-48 bg-leather-caramel/20 rounded-full", pulseClass)} />
            </div>
            <div className={cn("h-8 w-64 bg-leather-caramel/20 codex-radius-card", pulseClass)} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <DashboardStatSkeleton key={i} />
        ))}
      </div>

      {/* Content rows */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className={cn("codex-card codex-panel-radius p-6", pulseClass)}>
            <div className="space-y-4">
              <div className="h-5 w-40 bg-leather-caramel/20 rounded-full codex-shimmer" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-leather-caramel/15 codex-radius-card codex-shimmer" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 bg-leather-caramel/15 rounded-full codex-shimmer" />
                    <div className="h-2 w-1/2 bg-leather-caramel/15 rounded-full codex-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className={cn("codex-card codex-panel-radius p-6 h-full", pulseClass)}>
            <div className="space-y-4">
              <div className="h-5 w-32 bg-leather-caramel/20 rounded-full codex-shimmer" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 w-4 bg-leather-caramel/15 rounded-full mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-full bg-leather-caramel/15 rounded-full codex-shimmer" />
                    <div className="h-2 w-2/3 bg-leather-caramel/15 rounded-full codex-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard Sub-page Skeleton (list/card view) ─────── */

interface ListSkeletonProps {
  rows?: number;
  className?: string;
}

export function DashboardListSkeleton({ rows = 5, className }: ListSkeletonProps) {
  return (
    <div className={cn("codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8", className)}>
      {/* Header */}
      <div className={cn("mb-6 flex items-center justify-between", pulseClass)}>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="h-4 w-4 bg-leather-caramel/20 rounded-full codex-shimmer" />
            <div className="h-3 w-40 bg-leather-caramel/20 rounded-full codex-shimmer" />
          </div>
          <div className="h-8 w-56 bg-leather-caramel/20 codex-radius-card codex-shimmer" />
        </div>
        <div className="h-9 w-32 bg-leather-caramel/20 codex-btn" />
      </div>

      {/* Filters */}
      <div className={cn("mb-6 flex gap-2", pulseClass)}>
        <div className="h-7 w-24 bg-leather-caramel/15 rounded-full codex-badge" />
        <div className="h-7 w-28 bg-leather-caramel/15 rounded-full codex-badge" />
        <div className="h-7 w-20 bg-leather-caramel/15 rounded-full codex-badge" />
      </div>

      {/* List rows */}
      <div className="space-y-3">
        <div className="flex items-center gap-4 border-b border-border-subtle px-4 py-2">
          <div className="h-3 w-8 bg-leather-caramel/15 rounded-full codex-shimmer" />
          <div className="h-3 flex-1 bg-leather-caramel/15 rounded-full codex-shimmer" />
          <div className="h-3 w-24 bg-leather-caramel/15 rounded-full hidden sm:block" />
          <div className="h-3 w-20 bg-leather-caramel/15 rounded-full hidden md:block" />
          <div className="h-3 w-20 bg-leather-caramel/15 rounded-full codex-shimmer" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={cn("codex-card codex-panel-radius p-4", pulseClass)}>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-leather-caramel/20 codex-radius-card shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/5 bg-leather-caramel/20 rounded-full codex-shimmer" />
                <div className="h-2 w-2/3 bg-leather-caramel/15 rounded-full codex-shimmer" />
              </div>
              <div className="h-5 w-20 bg-leather-caramel/15 rounded-full hidden sm:block" />
              <div className="h-5 w-16 bg-leather-caramel/15 rounded-full hidden md:flex items-center gap-2" />
              <div className="flex gap-1">
                <div className="h-7 w-7 bg-leather-caramel/15 codex-radius-card codex-shimmer" />
                <div className="h-7 w-7 bg-leather-caramel/15 codex-radius-card codex-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Settings/Form Page Skeleton ──────────────────────── */

export function DashboardFormSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8", className)}>
      <div className={cn("mb-6", pulseClass)}>
        <div className="mb-1 flex items-center gap-2">
          <div className="h-4 w-4 bg-leather-caramel/20 rounded-full codex-shimmer" />
          <div className="h-3 w-36 bg-leather-caramel/20 rounded-full codex-shimmer" />
        </div>
        <div className="h-8 w-52 bg-leather-caramel/20 codex-radius-card codex-shimmer" />
      </div>

      <div className={cn("codex-card codex-panel-radius p-6 max-w-2xl", pulseClass)}>
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-32 bg-leather-caramel/20 rounded-full mb-2" />
              <div className="h-10 w-full bg-leather-caramel/15 codex-btn codex-shimmer" />
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <div className="h-9 w-24 bg-leather-caramel/15 codex-btn" />
            <div className="h-9 w-32 bg-leather-caramel/20 codex-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}
