import { NextResponse } from "next/server";
import { telemetrySummary } from "@/lib/telemetry-store";

/**
 * GET /api/telemetry/summary — Web Vitals sink inspection endpoint.
 *
 * Returns the aggregated real-user performance metrics recorded by the
 * in-memory sink (count/min/max/avg/p95 per metric + the latest sample).
 * no-store: the summary is live operational data, never CDN-cached.
 *
 * ⚠️ Per-instance ring buffer on serverless — counts reset when the
 * instance is recycled. Durable aggregation requires an external sink.
 */
export async function GET() {
  return NextResponse.json(telemetrySummary(), {
    headers: { "Cache-Control": "no-store" },
  });
}
