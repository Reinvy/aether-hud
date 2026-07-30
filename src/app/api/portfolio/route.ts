import { NextResponse } from "next/server";
import { portfolioData } from "../../../data/portfolio";

export async function GET() {
  try {
    return NextResponse.json(portfolioData);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}
