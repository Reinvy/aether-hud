import { NextRequest } from "next/server";
import { fail, ok, requireSession } from "@/lib/api-helpers";
import { getStats } from "@/lib/portfolio-repo";

export const dynamic = "force-dynamic";

/**
 * Console statistics. Operator data: the counts describe the private archive,
 * so the read is session-gated and never cached by a CDN.
 */
export async function GET(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) {
    denied.headers.set("Cache-Control", "no-store");
    return denied;
  }

  try {
    return ok(await getStats(), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[DASHBOARD_STATS_GET]", e instanceof Error ? e.message : e);
    return fail("Failed to fetch dashboard stats", "DASHBOARD_STATS_GET");
  }
}
