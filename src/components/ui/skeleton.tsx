/**
 * AETHER-HUD Skeleton Loading Components
 * Reusable UI skeletons for loading states with HUD aesthetic.
 * Design: Obsidian & Imperial Gold — Luxury Cybernetics.
 */
import { cn } from "@/lib/utils";

/** Pulse animation for skeleton segments */
const pulseClass = "animate-pulse";

/* ─── Segment Skeleton Bar ─────────────────────────────────── */

interface SegmentSkeletonProps {
  segments?: number;
  active?: number;
  className?: string;
}

export function SegmentSkeleton({ segments = 10, active = 0, className }: SegmentSkeletonProps) {
  return (
    <div className={cn("segment-bar", className)}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "segment",
            i < active && "active",
            "opacity-50",
          )}
        />
      ))}
    </div>
  );
}

/* ─── Text Skeleton ────────────────────────────────────────── */

interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export function TextSkeleton({ lines = 3, className }: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 rounded-none bg-glass-300",
            i === lines - 1 ? "w-2/3" : "w-full",
            pulseClass,
          )}
        />
      ))}
    </div>
  );
}

/* ─── Card Skeleton ────────────────────────────────────────── */

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn("glass-panel chamfered overflow-hidden", className)}>
      {/* Image area */}
      <div className={cn("relative h-48 bg-glass-200", pulseClass)}>
        <div className="absolute inset-0 bg-grid-hud opacity-10" />
        {/* Badge placeholders */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <div className="h-5 w-16 bg-glass-300 rounded-none" />
          <div className="h-5 w-14 bg-glass-300 rounded-none" />
        </div>
      </div>
      {/* Content area */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className={cn("h-5 w-2/3 bg-glass-300 rounded-none", pulseClass)} />
          <div className={cn("h-4 w-12 bg-glass-300 rounded-none", pulseClass)} />
        </div>
        <div className="space-y-2">
          <div className={cn("h-3 w-full bg-glass-200 rounded-none", pulseClass)} />
          <div className={cn("h-3 w-5/6 bg-glass-200 rounded-none", pulseClass)} />
        </div>
        {/* Tags */}
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn("h-5 w-16 bg-glass-200 rounded-none", pulseClass)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Section Skeleton ─────────────────────────────────────── */

interface SectionSkeletonProps {
  className?: string;
}

export function SectionHeaderSkeleton({ className }: SectionSkeletonProps) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <div className={cn("mx-auto mb-4 h-7 w-48 bg-glass-300 rounded-none", pulseClass)} />
      <div className={cn("mx-auto h-10 w-3/4 bg-glass-300 rounded-none", pulseClass)} />
      <div className={cn("mx-auto mt-4 h-5 w-1/2 bg-glass-200 rounded-none", pulseClass)} />
    </div>
  );
}

/* ─── Dashboard Stat Skeleton ──────────────────────────────── */

interface DashboardStatSkeletonProps {
  className?: string;
}

export function DashboardStatSkeleton({ className }: DashboardStatSkeletonProps) {
  return (
    <div className={cn("glass-panel chamfered p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className={cn("h-3 w-24 bg-glass-300 rounded-none", pulseClass)} />
          <div className={cn("h-8 w-16 bg-glass-300 rounded-none", pulseClass)} />
        </div>
        <div className={cn("h-8 w-8 bg-glass-300 rounded-none", pulseClass)} />
      </div>
    </div>
  );
}

/* ─── Loading Pulse Dot ────────────────────────────────────── */

export function LoadingDots({ label = "LOADING" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
      <span className="sys-label text-[10px] text-text-muted">{label}...</span>
    </div>
  );
}

/* ─── Full Page Dashboard Skeleton ─────────────────────────── */

export function DashboardPageSkeleton() {
  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className={cn("h-4 w-4 bg-glass-300 rounded-none", pulseClass)} />
              <div className={cn("h-3 w-48 bg-glass-300 rounded-none", pulseClass)} />
            </div>
            <div className={cn("h-8 w-64 bg-glass-300 rounded-none", pulseClass)} />
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
          <div className={cn("glass-panel chamfered p-6", pulseClass)}>
            <div className="space-y-4">
              <div className="h-5 w-40 bg-glass-300 rounded-none" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-glass-200 rounded-none" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 bg-glass-200 rounded-none" />
                    <div className="h-2 w-1/2 bg-glass-200 rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className={cn("glass-panel chamfered p-6 h-full", pulseClass)}>
            <div className="space-y-4">
              <div className="h-5 w-32 bg-glass-300 rounded-none" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 w-4 bg-glass-200 rounded-none mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-full bg-glass-200 rounded-none" />
                    <div className="h-2 w-2/3 bg-glass-200 rounded-none" />
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
    <div className={cn("dashboard-grid-bg min-h-full p-6 lg:p-8", className)}>
      {/* Header */}
      <div className={cn("mb-6 flex items-center justify-between", pulseClass)}>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="h-4 w-4 bg-glass-300 rounded-none" />
            <div className="h-3 w-40 bg-glass-300 rounded-none" />
          </div>
          <div className="h-8 w-56 bg-glass-300 rounded-none" />
        </div>
        <div className="h-9 w-32 bg-glass-300 rounded-none tactical-btn" />
      </div>

      {/* Filters */}
      <div className={cn("mb-6 flex gap-2", pulseClass)}>
        <div className="h-7 w-24 bg-glass-200 rounded-none tech-badge" />
        <div className="h-7 w-28 bg-glass-200 rounded-none tech-badge" />
        <div className="h-7 w-20 bg-glass-200 rounded-none tech-badge" />
      </div>

      {/* List rows */}
      <div className="space-y-3">
        <div className="flex items-center gap-4 border-b border-border-subtle px-4 py-2">
          <div className="h-3 w-8 bg-glass-200 rounded-none" />
          <div className="h-3 flex-1 bg-glass-200 rounded-none" />
          <div className="h-3 w-24 bg-glass-200 rounded-none hidden sm:block" />
          <div className="h-3 w-20 bg-glass-200 rounded-none hidden md:block" />
          <div className="h-3 w-20 bg-glass-200 rounded-none" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={cn("glass-panel chamfered p-4", pulseClass)}>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-glass-300 rounded-none shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/5 bg-glass-300 rounded-none" />
                <div className="h-2 w-2/3 bg-glass-200 rounded-none" />
              </div>
              <div className="h-5 w-20 bg-glass-200 rounded-none hidden sm:block" />
              <div className="h-5 w-16 bg-glass-200 rounded-none hidden md:flex items-center gap-2" />
              <div className="flex gap-1">
                <div className="h-7 w-7 bg-glass-200 rounded-none" />
                <div className="h-7 w-7 bg-glass-200 rounded-none" />
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
    <div className={cn("dashboard-grid-bg min-h-full p-6 lg:p-8", className)}>
      <div className={cn("mb-6", pulseClass)}>
        <div className="mb-1 flex items-center gap-2">
          <div className="h-4 w-4 bg-glass-300 rounded-none" />
          <div className="h-3 w-36 bg-glass-300 rounded-none" />
        </div>
        <div className="h-8 w-52 bg-glass-300 rounded-none" />
      </div>

      <div className={cn("glass-panel chamfered p-6 max-w-2xl", pulseClass)}>
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-32 bg-glass-300 rounded-none mb-2" />
              <div className="h-10 w-full bg-glass-200 rounded-none" />
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <div className="h-9 w-24 bg-glass-200 rounded-none tactical-btn" />
            <div className="h-9 w-32 bg-glass-300 rounded-none tactical-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}
