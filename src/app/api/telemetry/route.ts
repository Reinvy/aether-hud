import { NextResponse } from "next/server";
import { recordTelemetry } from "@/lib/telemetry-store";

/**
 * POST /api/telemetry — Web Vitals collector endpoint.
 *
 * Receives fire-and-forget beacons from the client WebVitalsReporter.
 * Validates the payload shape and acknowledges; validated metrics are
 * written to the in-memory sink (see src/lib/telemetry-store.ts) and can
 * be inspected via GET /api/telemetry/summary. Swap `recordTelemetry` for
 * an external analytics API (Vercel Analytics, Grafana, PostHog, ...)
 * without changing the client contract.
 *
 * Returns 400 on malformed payloads and 200 { ok: true } otherwise.
 */
const ALLOWED_METRICS = new Set(["FCP", "LCP", "CLS", "INP", "TTFB", "TTFB_HTTP", "RT"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name : "";
    const value = typeof body?.value === "number" ? body.value : NaN;

    if (!ALLOWED_METRICS.has(name) || !Number.isFinite(value)) {
      return NextResponse.json(
        { ok: false, error: "invalid telemetry payload" },
        { status: 400 }
      );
    }

    // Collector hook — write validated payloads to the in-memory sink so
    // they're visible via GET /api/telemetry/summary. The sink never
    // fails the beacon: telemetry must not break the app.
    try {
      recordTelemetry({
        name,
        value,
        rating: typeof body?.rating === "string" ? body.rating : "unknown",
        delta: typeof body?.delta === "number" ? body.delta : 0,
        id: typeof body?.id === "string" ? body.id : "",
        path: typeof body?.path === "string" ? body.path : "/",
        recordedAt: new Date().toISOString(),
      });
    } catch (sinkErr) {
      console.error("[TELEMETRY]", "sink error:", sinkErr);
    }

    return NextResponse.json({
      ok: true,
      received: {
        name,
        value,
        rating: typeof body?.rating === "string" ? body.rating : "unknown",
      },
    });
  } catch (err) {
    // Keep the tagged console.error pattern used by every other API route;
    // malformed JSON bodies are still rejected with 400 (client contract).
    console.error("[TELEMETRY]", err);
    return NextResponse.json(
      { ok: false, error: "unparseable body" },
      { status: 400 }
    );
  }
}
