import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CACHE_HEADERS, fail, failNoDb, ok, requireSession } from "@/lib/api-helpers";
import { hasDatabase, getConfig } from "@/lib/portfolio-repo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getConfig(), { headers: CACHE_HEADERS });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Failed to fetch config", "CONFIG_GET");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("CONFIG_PUT");

  try {
    const body = await req.json();
    const defaults = await getConfig();
    const config = await prisma.portfolioConfig.upsert({
      where: { id: "main" },
      update: body,
      create: { ...defaults, ...body, id: "main" },
    });
    return ok(config);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Failed to update config", "CONFIG_PUT");
  }
}
