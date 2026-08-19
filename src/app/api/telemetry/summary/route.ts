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
  try {
    const summary = await durableTelemetrySummary();
    return NextResponse.json(summary, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    // durableTelemetrySummary already falls back to memory internally, but a
    // top-level guard keeps this route consistent with every other API route:
    // a thrown error returns a structured JSON 500, never an HTML error page.
    console.error("[TELEMETRY_SUMMARY]", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { error: "Failed to fetch telemetry summary" },
      { status: 500 }
    );
  }
}
