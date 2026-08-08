import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/info-row";

/**
 * TelemetryMetricCard — reusable HUD card for a single Web Vitals metric.
 * AETHER-HUD Design System: Obsidian & Imperial Gold
 *
 * Renders the aggregated summary (count/min/avg/p95/max) for one metric
 * (LCP, INP, CLS, FCP, TTFB) plus the most recent sample's path + time.
 * Used by the dashboard telemetry view; kept as its own module so the
 * metric → label/unit/rating mapping stays colocated and testable.
 */

export interface TelemetryMetricSummary {
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  p95: number | null;
  last: {
    value: number;
    rating: string;
    path: string;
    recordedAt: string;
  } | null;
}

/** Human label per Web Vitals metric name (falls back to the raw name). */
const METRIC_LABELS: Record<string, string> = {
  LCP: "LARGEST CONTENTFUL PAINT",
  INP: "INTERACTION TO NEXT PAINT",
  CLS: "CUMULATIVE LAYOUT SHIFT",
  FCP: "FIRST CONTENTFUL PAINT",
  TTFB: "TIME TO FIRST BYTE",
};

/** CLS is unitless; every other vitals metric is milliseconds. */
const METRIC_UNIT: Record<string, string> = {
  CLS: "",
};

/** Rating → Badge variant (stellar = good, gold = needs-improvement, default = poor). */
const RATING_VARIANT: Record<string, "stellar" | "gold" | "default"> = {
  good: "stellar",
  "needs-improvement": "gold",
  poor: "default",
};

function formatValue(name: string, value: number | null): string {
  if (value === null) return "—";
  if (METRIC_UNIT[name] === "") {
    // CLS — 4 significant decimals, e.g. 0.0042
    return value.toFixed(4);
  }
  return `${Math.round(value)}ms`;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString("en-GB", { hour12: false });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    hour12: false,
  });
}

interface TelemetryMetricCardProps {
  name: string;
  summary: TelemetryMetricSummary;
  className?: string;
}

export function TelemetryMetricCard({ name, summary, className }: TelemetryMetricCardProps) {
  const label = METRIC_LABELS[name] ?? name;
  const rating = summary.last?.rating ?? "unknown";
  const ratingVariant = RATING_VARIANT[rating] ?? "default";
  const ratingText = rating === "good" ? "GOOD" : rating === "needs-improvement" ? "WARN" : rating === "poor" ? "POOR" : "N/A";

  return (
    <Card variant="glass" hover="sweep" diamond className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col gap-4 p-5">
        {/* Header — metric label + rating badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="sys-label-gold text-[9px]">{name}</span>
            <h3 className="mt-1 truncate font-display text-xs font-bold tracking-[0.08em] text-text-main">
              {label}
            </h3>
          </div>
          <Badge variant={ratingVariant} size="sm" className="shrink-0">
            {ratingText}
          </Badge>
        </div>

        {/* Aggregates */}
        <div className="grid grid-cols-2 gap-2">
          <InfoRow label="SAMPLES" value={String(summary.count)} tone="titanium" />
          <InfoRow label="MIN" value={formatValue(name, summary.min)} tone="titanium" />
          <InfoRow label="AVG" value={formatValue(name, summary.avg)} tone="gold" />
          <InfoRow label="P95" value={formatValue(name, summary.p95)} tone="gold" />
          <InfoRow label="MAX" value={formatValue(name, summary.max)} tone="titanium" />
          <InfoRow
            label="LATEST"
            value={formatValue(name, summary.last?.value ?? null)}
            tone="stellar"
          />
        </div>

        {/* Latest sample origin */}
        <div className="mt-auto space-y-1.5 border-t border-border-subtle pt-3">
          <div className="flex items-center gap-2">
            <span className="sys-node" />
            <span className="min-w-0 truncate font-mono text-[10px] text-text-muted">
              {summary.last?.path ?? "NO SAMPLE YET"}
            </span>
          </div>
          {summary.last && (
            <p className="font-mono text-[10px] text-text-muted/70">
              {formatDate(summary.last.recordedAt)} // {formatTime(summary.last.recordedAt)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
