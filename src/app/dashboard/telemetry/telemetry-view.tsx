"use client";

import { Gauge, Database, MemoryStick, RefreshCw } from "lucide-react";
import { useData } from "@/lib/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { WidgetError } from "@/components/ui/widget-error";
import { HudLoader } from "@/components/ui/hud-loader";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import {
  TelemetryMetricCard,
  type TelemetryMetricSummary,
} from "@/components/features/telemetry-metric-card";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";

/**
 * TelemetryView — dashboard Web Vitals observability node.
 *
 * Reads the aggregated real-user performance summary (LCP/INP/CLS/FCP/TTFB)
 * from /api/telemetry/summary — the durable PostgreSQL sink with the
 * per-instance memory ring as fallback. Each metric renders as a reusable
 * TelemetryMetricCard (count/min/avg/p95/max + latest sample origin).
 * Loading uses the HUD skeleton system; failures render a WidgetError with
 * a RETRY action instead of blanking the view.
 */

interface TelemetrySummary {
  ok: boolean;
  source: "database" | "memory";
  startedAt: string;
  totalRecorded: number;
  metrics: Record<string, TelemetryMetricSummary>;
}

const METRIC_ORDER = ["LCP", "INP", "CLS", "FCP", "TTFB"];

function SourceBadge({ source }: { source: "database" | "memory" }) {
  const isDb = source === "database";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 chamfered-sm border px-3 py-1.5 font-mono text-[10px] tracking-wider",
        isDb
          ? "border-stellar-400/30 bg-[rgba(56,239,125,0.08)] text-stellar-400"
          : "border-gold-400/30 bg-[rgba(242,201,76,0.08)] text-gold-400"
      )}
    >
      {isDb ? <Database className="h-3.5 w-3.5" /> : <MemoryStick className="h-3.5 w-3.5" />}
      {isDb ? "DB LINK // DURABLE" : "MEM FALLBACK // EPHEMERAL"}
    </span>
  );
}

function TelemetrySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} variant="glass" hover="none" diamond className="h-full">
          <CardContent className="space-y-4 p-5">
            <div className="h-3 w-2/3 bg-glass-200 rounded-none skeleton-hud" />
            <div className="h-8 w-1/2 bg-glass-200 rounded-none skeleton-hud" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="h-8 bg-glass-200 rounded-none skeleton-hud" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TelemetryView() {
  const { data, loading, error, refetch } = useData<TelemetrySummary>("/api/telemetry/summary");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        icon={Gauge}
        label="TELEMETRY NODE"
        title="PERFORMANCE "
        titleHighlight="TELEMETRY"
        statusLabel={data ? (data.source === "database" ? "DB LINK ACTIVE" : "MEMORY FALLBACK") : "SCANNING..."}
        statusActive={!error}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="shrink-0"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "hud-rotate")} />
            REFRESH
          </Button>
        }
      />

      {error ? (
        <ErrorBoundary section="telemetry" fallback={<WidgetError label="TELEMETRY" />}>
          <div className="glass-panel chamfered corner-decor flex flex-col items-center gap-4 p-8">
            <WidgetError label="TELEMETRY NODE" />
            <Button variant="secondary" size="sm" onClick={refetch}>
              <RefreshCw className="h-3.5 w-3.5" />
              RETRY LINK
            </Button>
          </div>
        </ErrorBoundary>
      ) : loading || !data ? (
        <TelemetrySkeleton />
      ) : (
        <ErrorBoundary section="telemetry" fallback={<WidgetError label="TELEMETRY" />}>
          <div className="space-y-6">
            {/* Source + overview stat row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SourceBadge source={data.source} />
              <span className="font-mono text-[10px] text-text-muted">
                SINCE {new Date(data.startedAt).toLocaleString("en-GB", { hour12: false })}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="TOTAL SAMPLES"
                value={String(data.totalRecorded)}
                icon={Database}
                tone="gold"
              />
              <StatCard
                label="METRICS TRACKED"
                value={String(Object.keys(data.metrics).length)}
                icon={Gauge}
                tone="stellar"
              />
              <StatCard
                label="SOURCE"
                value={data.source === "database" ? "POSTGRES" : "MEMORY"}
                icon={MemoryStick}
                tone={data.source === "database" ? "stellar" : "gold"}
              />
            </div>

            {/* Metric cards — stable order, unknown metrics appended */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {METRIC_ORDER.filter((m) => data.metrics[m]).map((name) => (
                <TelemetryMetricCard key={name} name={name} summary={data.metrics[name]} />
              ))}
              {Object.keys(data.metrics)
                .filter((m) => !METRIC_ORDER.includes(m))
                .map((name) => (
                  <TelemetryMetricCard key={name} name={name} summary={data.metrics[name]} />
                ))}
            </div>

            {Object.keys(data.metrics).length === 0 && (
              <div className="glass-panel chamfered corner-decor flex flex-col items-center gap-3 p-10 text-center">
                <Gauge className="h-6 w-6 text-gold-400/40" />
                <span className="sys-label text-[10px]">NO TELEMETRY CAPTURED</span>
                <p className="max-w-md font-mono text-[11px] text-text-muted">
                  Beacons arrive from real browsers via the Web Vitals reporter. Open the portal
                  and interact — samples will populate this node automatically.
                </p>
                <HudLoader label="AWAITING BEACONS" size="sm" className="mt-2" />
              </div>
            )}
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
}
