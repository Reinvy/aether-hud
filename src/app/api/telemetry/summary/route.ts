import { NextResponse } from "next/server";
import { durableTelemetrySummary } from "@/lib/telemetry-store";

/**
 * GET /api/telemetry/summary — Web Vitals sink inspection endpoint.
 *
 * Returns the aggregated real-user performance metrics (count/min/max/
 * avg/p95 per metric + the latest sample). Reads from the durable
 * PostgreSQL sink (source: "database") and falls back to the per-instance
 * in-memory ring buffer (source: "memory") when the DB is unreachable.
 * no-store: the summary is live operational data, never CDN-cached.
 */
export async function GET() {
  const summary = await durableTelemetrySummary();
  return NextResponse.json(summary, {
    headers: { "Cache-Control": "no-store" },
  });
}
