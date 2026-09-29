"use client";

import { Gauge, Database, MemoryStick, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "@/lib/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { WidgetError } from "@/components/ui/widget-error";
import { CodexLoader } from "@/components/ui/codex-loader";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import {
  TelemetryMetricCard,
  type TelemetryMetricSummary,
} from "@/components/features/telemetry-metric-card";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { staggerContainer, fadeInUpItem } from "@/lib/motion-variants";
import { cn } from "@/lib/utils";

/**
 * TelemetryView — the Astral Observatory: real-user Web Vitals for the realm.
 *
 * Reads the aggregated performance summary (LCP/INP/CLS/FCP/TTFB) from
 * /api/telemetry/summary — the durable PostgreSQL table with the per-instance
 * memory ring as fallback. Each metric renders as a reusable
 * TelemetryMetricCard (count/min/avg/p95/max + latest sample origin).
 * Loading shows the shimmer skeleton; a failed read renders the inline error
 * with its own retry instead of blanking the page.
 */

interface TelemetrySummary {
  ok: boolean;
  source: "database" | "memory";
  startedAt: string;
  totalRecorded: number;
  metrics: Record<string, TelemetryMetricSummary>;
}

const METRIC_ORDER = ["LCP", "INP", "CLS", "FCP", "TTFB"];

/**
 * Where the samples are being kept: the durable PostgreSQL table or the
 * process-memory ring that only holds this session.
 */
function SourceBadge({ source }: { source: "database" | "memory" }) {
  const isDb = source === "database";
  return (
    <span
      className={cn(
        "codex-radius-sm inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold",
        isDb
          ? "border-jade-400/30 bg-jade-400/10 text-jade-ink"
          : "border-gold-400/30 bg-gold-400/10 text-gold-ink"
      )}
    >
      {isDb ? (
        <Database className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <MemoryStick className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {isDb ? "Kept in the database" : "Held in memory for this session"}
    </span>
  );
}

function TelemetrySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} variant="glass" hover="none" className="h-full">
          <CardContent className="space-y-4 p-5">
            <div className="h-3 w-2/3 rounded-full bg-leather-caramel/15 codex-shimmer" />
            <div className="h-8 w-1/2 codex-radius-card bg-leather-caramel/15 codex-shimmer" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, j) => (
                <div
                  key={j}
                  className="h-8 codex-radius-card bg-leather-caramel/10 codex-shimmer"
                />
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
        eyebrow="ASTRAL OBSERVATORY"
        title="Performance Telemetry"
        titleHighlight="Telemetry"
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="shrink-0"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", loading && "elemental-rotate")}
              aria-hidden="true"
            />
            Refresh
          </Button>
        }
      />

      {error ? (
        <ErrorBoundary section="telemetry" fallback={<WidgetError label="TELEMETRY" />}>
          <div className="codex-panel codex-panel-radius flex flex-col items-center gap-4 p-8">
            <WidgetError label="TELEMETRY" />
            <Button variant="secondary" size="sm" onClick={refetch}>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </Button>
          </div>
        </ErrorBoundary>
      ) : loading || !data ? (
        <TelemetrySkeleton />
      ) : (
        <ErrorBoundary section="telemetry" fallback={<WidgetError label="TELEMETRY" />}>
          <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
            {/* Source + collection window */}
            <motion.div variants={fadeInUpItem} className="flex flex-wrap items-center justify-between gap-3">
              <SourceBadge source={data.source} />
              <span className="text-xs text-leather-muted tabular-nums">
                Collecting since{" "}
                {new Date(data.startedAt).toLocaleString("en-GB", { hour12: false })}
              </span>
            </motion.div>

            <motion.div variants={fadeInUpItem} className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="SAMPLES RECORDED"
                value={String(data.totalRecorded)}
                icon={Database}
                tone="gold"
              />
              <StatCard
                label="METRICS TRACKED"
                value={String(Object.keys(data.metrics).length)}
                icon={Gauge}
                tone="jade"
              />
              <StatCard
                label="STORED IN"
                value={data.source === "database" ? "Database" : "Memory"}
                icon={MemoryStick}
                tone={data.source === "database" ? "jade" : "gold"}
              />
            </motion.div>

            {/* Metric cards — stable order, unknown metrics appended */}
            <motion.div variants={fadeInUpItem} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {METRIC_ORDER.filter((m) => data.metrics[m]).map((name) => (
                <TelemetryMetricCard key={name} name={name} summary={data.metrics[name]} />
              ))}
              {Object.keys(data.metrics)
                .filter((m) => !METRIC_ORDER.includes(m))
                .map((name) => (
                  <TelemetryMetricCard key={name} name={name} summary={data.metrics[name]} />
                ))}
            </motion.div>

            {Object.keys(data.metrics).length === 0 && (
              <motion.div
                variants={fadeInUpItem}
                className="codex-panel codex-panel-radius flex flex-col items-center gap-3 p-10 text-center"
              >
                <Gauge className="h-6 w-6 text-leather-caramel" aria-hidden="true" />
                <span className="codex-label">No telemetry captured yet</span>
                <p className="max-w-md text-xs font-body text-leather-muted">
                  Samples arrive from real browsers through the Web Vitals reporter. Open the
                  portal, browse a while, and the first readings will appear here.
                </p>
                <CodexLoader label="Awaiting beacons" size="sm" className="mt-2" />
              </motion.div>
            )}
          </motion.div>
        </ErrorBoundary>
      )}
    </div>
  );
}
