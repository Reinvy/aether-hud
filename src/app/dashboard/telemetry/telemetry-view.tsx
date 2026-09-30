"use client";

import { motion } from "framer-motion";
import { useData } from "@/lib/use-data";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Button } from "@/components/ui/button";
import { CodexGlyph } from "@/components/ui/codex-glyph";
import { StatCard } from "@/components/ui/stat-card";
import { WidgetError } from "@/components/ui/widget-error";
import { CodexLoader } from "@/components/ui/codex-loader";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { TelemetryMetricCard } from "@/components/features/telemetry-metric-card";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { staggerContainer, fadeInUpItem } from "@/lib/motion-variants";
import { cn } from "@/lib/utils";
import type { TelemetrySummary } from "@/lib/dto";

/**
 * TelemetryView — the Astral Observatory: real-user Web Vitals for the realm.
 *
 * Reads the aggregated performance summary (LCP/INP/CLS/FCP/TTFB) from
 * /api/telemetry/summary — the durable PostgreSQL table with the per-instance
 * memory ring as fallback. Each metric renders as a reusable
 * TelemetryMetricCard (count/min/avg/p95/max + latest sample origin).
 * The shared list skeleton covers the first paint; a failed read renders one
 * WidgetError with its own retry instead of blanking the page.
 */

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
        <AssetIcon icon="memoryCore" tone="ink" size="sm" />
      ) : (
        <AssetIcon icon="archive" tone="ink" size="sm" />
      )}
      {isDb ? "Kept in the database" : "Held in memory for this session"}
    </span>
  );
}

export function TelemetryView() {
  const { data, loading, error, refetch } = useData<TelemetrySummary>("/api/telemetry/summary");

  return (
    <div className="codex-grid-bg min-h-full space-y-6 p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        icon="elementalSight"
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
            <CodexGlyph
              name="refresh"
              className={cn("text-base", loading && "elemental-rotate")}
            />
            Refresh
          </Button>
        }
      />

      {error !== null ? (
        <WidgetError label="Telemetry" message={error} onRetry={refetch} />
      ) : data === null ? (
        <DashboardListSkeleton rows={3} />
      ) : (
        <ErrorBoundary section="telemetry" fallback={<WidgetError label="Telemetry" />}>
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
                icon="list"
                tone="gold"
              />
              <StatCard
                label="METRICS TRACKED"
                value={String(Object.keys(data.metrics).length)}
                icon="performanceMedal"
                tone="jade"
              />
              <StatCard
                label="STORED IN"
                value={data.source === "database" ? "Database" : "Memory"}
                icon="memoryCore"
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
                <AssetIcon icon="elementalSight" size="md" />
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
