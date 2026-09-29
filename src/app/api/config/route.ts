import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CACHE_HEADERS,
  fail,
  failNoDb,
  failValidation,
  ok,
  requireSession,
  revalidateContent,
} from "@/lib/api-helpers";
import { hasDatabase, getConfig } from "@/lib/portfolio-repo";
import { parseConfigPatch } from "@/lib/api-validation";
import type { ConfigDto } from "@/lib/dto";

export const dynamic = "force-dynamic";

/**
 * GET is public: the landing page's motion preference, the console wordmark and
 * the site identity all read it before a session exists.
 */
export async function GET() {
  try {
    return ok(await getConfig(), { headers: CACHE_HEADERS });
  } catch (e) {
    console.error("[CONFIG_GET]", e instanceof Error ? e.message : e);
    return fail("Failed to fetch config", "CONFIG_GET");
  }
}

export async function PUT(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) return denied;
  if (!hasDatabase()) return failNoDb("CONFIG_PUT");

  try {
    const parsed = parseConfigPatch(await req.json());
    if ("error" in parsed) {
      return failValidation(parsed.error, parsed.fields, "CONFIG_PUT");
    }
    if (Object.keys(parsed.data).length === 0) {
      return failValidation("No configurable field was sent", undefined, "CONFIG_PUT");
    }

    const defaults = await getConfig();
    const row = await prisma.portfolioConfig.upsert({
      where: { id: "main" },
      update: parsed.data,
      create: { ...defaults, ...parsed.data, id: "main" },
    });

    revalidateContent();
    const config: ConfigDto = {
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      bio: row.bio,
      email: row.email,
      location: row.location,
      avatar: row.avatar,
      status: row.status,
      edition: row.edition,
      siteName: row.siteName,
      siteDescription: row.siteDescription,
      animationsEnabled: row.animationsEnabled,
    };
    return ok(config);
  } catch (e) {
    console.error("[CONFIG_PUT]", e instanceof Error ? e.message : e);
    return fail("Failed to update config", "CONFIG_PUT");
  }
}
