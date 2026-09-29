import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/info-row";
import type { TelemetryMetricSummary } from "@/lib/dto";

/**
 * TelemetryMetricCard — one Web Vitals metric from the Astral Observatory.
 *
 * Renders the aggregated summary (count/min/avg/p95/max) for a single metric
 * (LCP, INP, CLS, FCP, TTFB) plus the most recent sample's page and time.
 * Kept as its own module so the metric → label/unit/rating mapping stays
 * colocated.
 */

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

/** Rating → Badge variant (jade = good, gold = needs improvement, default = poor). */
const RATING_VARIANT: Record<string, "jade" | "gold" | "default"> = {
  good: "jade",
  "needs-improvement": "gold",
  poor: "default",
};

/** Rating → badge copy; anything the server did not rate reads as "No data". */
const RATING_LABEL: Record<string, string> = {
  good: "Good",
  "needs-improvement": "Fair",
  poor: "Poor",
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
  const ratingText = RATING_LABEL[rating] ?? "No data";

  return (
    <Card variant="glass" hover="sweep" className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col gap-4 p-5">
        {/* Header — metric label + rating badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="codex-label-gold text-[9px]">{name}</span>
            <h3 className="mt-1 truncate font-display text-xs font-bold tracking-[0.08em] text-leather-dark">
              {label}
            </h3>
          </div>
          <Badge variant={ratingVariant} size="sm" className="shrink-0">
            {ratingText}
          </Badge>
        </div>

        {/* Aggregates */}
        <div className="grid grid-cols-2 gap-2">
          <InfoRow label="SAMPLES" value={String(summary.count)} tone="default" />
          <InfoRow label="MIN" value={formatValue(name, summary.min)} tone="default" />
          <InfoRow label="AVG" value={formatValue(name, summary.avg)} tone="gold" />
          <InfoRow label="P95" value={formatValue(name, summary.p95)} tone="gold" />
          <InfoRow label="MAX" value={formatValue(name, summary.max)} tone="default" />
          <InfoRow
            label="LATEST"
            value={formatValue(name, summary.last?.value ?? null)}
            tone="jade"
          />
        </div>

        {/* Latest sample origin */}
        <div className="mt-auto space-y-1.5 border-t border-border-subtle pt-3">
          {summary.last ? (
            <>
              <p className="font-mono text-[10px] text-leather-muted truncate tabular-nums">
                {summary.last.path}
              </p>
              <p className="text-[10px] font-body text-leather-muted">
                {formatDate(summary.last.recordedAt)} · {formatTime(summary.last.recordedAt)}
              </p>
            </>
          ) : (
            <p className="text-[10px] font-body text-leather-muted">No sample yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
