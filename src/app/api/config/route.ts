import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, CACHE_HEADERS } from "@/lib/api-helpers";
import { PORTFOLIO_CONFIG } from "@/lib/constants";
import { portfolioData } from "@/data/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.portfolioConfig.findUnique({ where: { id: "main" } });
    if (!config) {
      return ok(PORTFOLIO_CONFIG, { headers: CACHE_HEADERS });
    }
    return ok(config, { headers: CACHE_HEADERS });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Failed to fetch config", "CONFIG_GET");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const config = await prisma.portfolioConfig.upsert({
      where: { id: "main" },
      update: body,
      create: {
        id: "main",
        name: PORTFOLIO_CONFIG.name,
        tagline: PORTFOLIO_CONFIG.tagline,
        bio: portfolioData.bio,
        email: PORTFOLIO_CONFIG.email,
        location: PORTFOLIO_CONFIG.location,
        avatar: portfolioData.avatar,
        status: PORTFOLIO_CONFIG.status,
        sysVersion: PORTFOLIO_CONFIG.sysVersion,
        ...body,
      },
    });
    return ok(config);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Failed to update config", "CONFIG_PUT");
  }
}

