import { NextResponse } from "next/server";

/**
 * POST /api/telemetry — Web Vitals collector endpoint.
 *
 * Receives fire-and-forget beacons from the client WebVitalsReporter.
 * Validates the payload shape and acknowledges; the accepted metric can be
 * forwarded to an external analytics sink (Vercel Analytics, Grafana,
 * PostHog, ...) later without changing the client contract.
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

    // Collector hook — forward `body` to an external sink here when one is
    // configured (e.g. stream to a metrics database or analytics API).

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
