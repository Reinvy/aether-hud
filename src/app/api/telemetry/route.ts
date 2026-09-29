import { NextResponse } from "next/server";
import { recordTelemetry, persistTelemetry } from "@/lib/telemetry-store";

/**
 * POST /api/telemetry — Web Vitals collector endpoint.
 *
 * Receives fire-and-forget beacons from the client WebVitalsReporter. The route
 * is public by design, so it sanitises what it accepts: a fixed metric name, a
 * value clamped to a real measurement window, and a path stripped to its route.
 * A per-client in-process limiter drops floods (60 events/minute) and answers
 * `200 { ok: true, dropped: true }` so the beacon never retries or surfaces an
 * error to a visitor.
 *
 * Returns 400 on malformed payloads, 200 otherwise.
 */
const ALLOWED_METRICS = new Set(["FCP", "LCP", "CLS", "INP", "TTFB", "TTFB_HTTP", "RT"]);

/** 10 minutes — longer than any real metric, shorter than a stuck timer. */
const MAX_METRIC_VALUE = 600_000;
const MAX_PATH_LENGTH = 120;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_EVENTS = 60;

const recentByClient = new Map<string, number[]>();

function allowEvent(clientId: string): boolean {
  const now = Date.now();
  const recent = (recentByClient.get(clientId) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX_EVENTS) {
    recentByClient.set(clientId, recent);
    return false;
  }
  recent.push(now);
  recentByClient.set(clientId, recent);
  // Bound the map itself: a client id that stops sending is forgotten.
  if (recentByClient.size > 500) {
    for (const [id, timestamps] of recentByClient) {
      if (now - (timestamps[timestamps.length - 1] ?? 0) > RATE_LIMIT_WINDOW_MS) {
        recentByClient.delete(id);
      }
    }
  }
  return true;
}

/** Strip query/hash so only the route is stored; anything unusable becomes "/". */
function sanitizePath(path: unknown): string {
  if (typeof path !== "string") return "/";
  const trimmed = path.split(/[?#]/)[0];
  if (!trimmed.startsWith("/")) return "/";
  return trimmed.length > MAX_PATH_LENGTH ? trimmed.slice(0, MAX_PATH_LENGTH) : trimmed;
}

function clampValue(value: number): number {
  return Math.min(MAX_METRIC_VALUE, Math.max(0, value));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name : "";
    const rawValue = typeof body?.value === "number" ? body.value : NaN;

    if (!ALLOWED_METRICS.has(name) || !Number.isFinite(rawValue)) {
      return NextResponse.json(
        { ok: false, error: "invalid telemetry payload" },
        { status: 400 }
      );
    }

    const clientId = typeof body?.id === "string" ? body.id.slice(0, 64) : "";
    if (!allowEvent(clientId)) {
      return NextResponse.json({ ok: true, dropped: true });
    }

    const value = clampValue(rawValue);
    const rating = typeof body?.rating === "string" ? body.rating : "unknown";
    const sample = {
      name,
      value,
      rating,
      delta: typeof body?.delta === "number" ? body.delta : 0,
      id: clientId,
      path: sanitizePath(body?.path),
      recordedAt: new Date().toISOString(),
    };

    // Collector hook — write validated payloads to the in-memory sink so
    // they're visible via GET /api/telemetry/summary, then durably
    // persist to PostgreSQL (pruned, bounded). Neither sink may fail the
    // beacon: telemetry must not break the app.
    try {
      recordTelemetry(sample);
      await persistTelemetry(sample);
    } catch (sinkErr) {
      console.error("[TELEMETRY]", "sink error:", sinkErr);
    }

    return NextResponse.json({ ok: true, received: { name, value, rating } });
  } catch (err) {
    // Keep the tagged console.error pattern used by every other API route;
    // malformed JSON bodies are still rejected with 400 (client contract).
    console.error("[TELEMETRY]", err);
    return NextResponse.json({ ok: false, error: "unparseable body" }, { status: 400 });
  }
}
