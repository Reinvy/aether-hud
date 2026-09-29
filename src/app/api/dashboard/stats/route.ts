import { CACHE_HEADERS, fail, ok } from "@/lib/api-helpers";
import { getStats } from "@/lib/portfolio-repo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getStats(), { headers: CACHE_HEADERS });
  } catch (e) {
    return fail(
      e instanceof Error ? e.message : "Failed to fetch dashboard stats",
      "DASHBOARD_STATS_GET"
    );
  }
}
