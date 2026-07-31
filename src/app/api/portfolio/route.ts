import { NextResponse } from "next/server";
import { portfolioData } from "../../../data/portfolio";

export const dynamic = "force-static";

const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" };

const SECTION_KEYS = ["projects", "skills", "socials"] as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section && SECTION_KEYS.includes(section as (typeof SECTION_KEYS)[number])) {
      return NextResponse.json(
        { [section]: portfolioData[section as (typeof SECTION_KEYS)[number]] },
        { headers: CACHE_HEADERS }
      );
    }

    return NextResponse.json(portfolioData, { headers: CACHE_HEADERS });
  } catch (e) {
    console.error("[PORTFOLIO_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}
