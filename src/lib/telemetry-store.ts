/**
 * telemetry-store — Web Vitals aggregation sink (in-memory ring buffer)
 * with durable PostgreSQL persistence.
 *
 * The /api/telemetry collector writes validated beacon payloads here so
 * operators can inspect real-user performance without an external
 * analytics service. Two layers:
 *
 * 1. `recordTelemetry` — fast in-memory ring buffer (per-instance).
 *    Always succeeds; never blocks or fails the beacon.
 * 2. `persistTelemetry` — best-effort durable write to the
 *    `TelemetryEvent` table (survives serverless instance recycling),
 *    pruned to the newest MAX_DB_SAMPLES_PER_METRIC rows per metric.
 *    Any DB failure falls back silently to the memory layer.
 *
 * ⚠️ Serverless instances are ephemeral — the memory buffer is a
 * per-instance ring, NOT durable storage. The DB table is the durable
 * source of truth for GET /api/telemetry/summary; the memory layer is
 * the always-available fallback when the DB is unreachable.
 */

import { prisma } from "@/lib/prisma";

export interface TelemetrySample {
  name: string;
  value: number;
  rating: string;
  delta: number;
  id: string;
  path: string;
  recordedAt: string;
}

/** Cap per-metric history so the memory buffer stays bounded. */
const MAX_SAMPLES_PER_METRIC = 50;
/** Cap per-metric history so the DB table stays bounded. */
const MAX_DB_SAMPLES_PER_METRIC = 200;

const samplesByMetric = new Map<string, TelemetrySample[]>();
let totalRecorded = 0;
const startedAt = new Date().toISOString();

export function recordTelemetry(entry: TelemetrySample): void {
  const bucket = samplesByMetric.get(entry.name) ?? [];
  bucket.push(entry);
  if (bucket.length > MAX_SAMPLES_PER_METRIC) bucket.shift();
  samplesByMetric.set(entry.name, bucket);
  totalRecorded += 1;
}

/**
 * Best-effort durable write. Never throws — the beacon must not break
 * the app. Prunes each metric to the newest MAX_DB_SAMPLES_PER_METRIC
 * rows so an unbounded public endpoint can't grow the table forever.
 */
export async function persistTelemetry(entry: TelemetrySample): Promise<void> {
  try {
    await prisma.telemetryEvent.create({
      data: {
        name: entry.name,
        value: entry.value,
        rating: entry.rating,
        delta: entry.delta,
        clientId: entry.id,
        path: entry.path,
        recordedAt: new Date(entry.recordedAt),
      },
    });

    // Bounded retention: keep only the newest MAX_DB_SAMPLES_PER_METRIC
    // rows for this metric (cheap on the (name, recordedAt) index).
    const keep = await prisma.telemetryEvent.findMany({
      where: { name: entry.name },
      orderBy: { recordedAt: "desc" },
      take: MAX_DB_SAMPLES_PER_METRIC,
      select: { id: true },
    });
    await prisma.telemetryEvent.deleteMany({
      where: { name: entry.name, id: { notIn: keep.map((r) => r.id) } },
    });
  } catch (err) {
    // DB unreachable — the in-memory layer still has the sample.
    console.error("[TELEMETRY]", "durable persist failed (memory fallback):", err instanceof Error ? err.message : err);
  }
}

export interface MetricSummary {
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  p95: number | null;
  last: TelemetrySample | null;
}

function summarizeSamples(samples: TelemetrySample[]): MetricSummary {
  const values = samples.map((s) => s.value).sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const p95Index = Math.min(values.length - 1, Math.floor(values.length * 0.95));

  return {
    count: samples.length,
    min: values.length ? values[0] : null,
    max: values.length ? values[values.length - 1] : null,
    avg: values.length ? Math.round((sum / values.length) * 100) / 100 : null,
    p95: values.length ? values[p95Index] : null,
    last: samples[samples.length - 1] ?? null,
  };
}

function telemetrySummary(): {
  ok: boolean;
  source: "memory";
  startedAt: string;
  totalRecorded: number;
  metrics: Record<string, MetricSummary>;
} {
  const metrics: Record<string, MetricSummary> = {};
  for (const [name, samples] of samplesByMetric) {
    metrics[name] = summarizeSamples(samples);
  }
  return { ok: true, source: "memory", startedAt, totalRecorded, metrics };
}

/**
 * Durable summary — reads from the PostgreSQL sink (source of truth)
 * and falls back to the in-memory ring when the DB is unreachable.
 */
export async function durableTelemetrySummary(): Promise<{
  ok: boolean;
  source: "database" | "memory";
  startedAt: string;
  totalRecorded: number;
  metrics: Record<string, MetricSummary>;
}> {
  try {
    const rows = await prisma.telemetryEvent.findMany({
      orderBy: { recordedAt: "desc" },
      take: 5000,
    });
    const byMetric = new Map<string, TelemetrySample[]>();
    for (const row of rows) {
      const bucket = byMetric.get(row.name) ?? [];
      bucket.push({
        name: row.name,
        value: row.value,
        rating: row.rating,
        delta: row.delta,
        id: row.clientId,
        path: row.path,
        recordedAt: row.recordedAt.toISOString(),
      });
      byMetric.set(row.name, bucket);
    }
    const metrics: Record<string, MetricSummary> = {};
    for (const [name, samples] of byMetric) {
      // findMany desc → newest first; summarize expects ascending order
      metrics[name] = summarizeSamples(samples.reverse());
    }
    return { ok: true, source: "database", startedAt, totalRecorded: rows.length, metrics };
  } catch (err) {
    console.error("[TELEMETRY]", "durable summary failed (memory fallback):", err instanceof Error ? err.message : err);
    return telemetrySummary();
  }
}
