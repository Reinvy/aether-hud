/**
 * telemetry-store — in-memory Web Vitals aggregation sink.
 *
 * The /api/telemetry collector writes validated beacon payloads here so
 * operators can inspect real-user performance without an external
 * analytics service. This is the "collector hook" the collector endpoint
 * documents: swap `recordTelemetry` internals (or add a forwarding call)
 * when an external sink (Vercel Analytics, Grafana, PostHog, ...) is
 * configured — the client contract and the summary endpoint stay stable.
 *
 * ⚠️ Serverless instances are ephemeral — this is a per-instance ring
 * buffer, NOT durable storage. It exists to prove the collector→sink
 * contract and to power GET /api/telemetry/summary.
 */

export interface TelemetrySample {
  name: string;
  value: number;
  rating: string;
  delta: number;
  id: string;
  path: string;
  recordedAt: string;
}

/** Cap per-metric history so the buffer stays bounded. */
const MAX_SAMPLES_PER_METRIC = 50;

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

export interface MetricSummary {
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  p95: number | null;
  last: TelemetrySample | null;
}

export function telemetrySummary(): {
  ok: boolean;
  startedAt: string;
  totalRecorded: number;
  metrics: Record<string, MetricSummary>;
} {
  const metrics: Record<string, MetricSummary> = {};

  for (const [name, samples] of samplesByMetric) {
    const values = samples
      .map((s) => s.value)
      .sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const p95Index = Math.min(
      values.length - 1,
      Math.floor(values.length * 0.95)
    );

    metrics[name] = {
      count: samples.length,
      min: values.length ? values[0] : null,
      max: values.length ? values[values.length - 1] : null,
      avg: values.length ? Math.round((sum / values.length) * 100) / 100 : null,
      p95: values.length ? values[p95Index] : null,
      last: samples[samples.length - 1] ?? null,
    };
  }

  return {
    ok: true,
    startedAt,
    totalRecorded,
    metrics,
  };
}
