import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-helpers";
import { hasDatabase } from "@/lib/portfolio-repo";
import type { ActivityItem } from "@/lib/dto";

export const dynamic = "force-dynamic";

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

/**
 * GET /api/dashboard/activity — the console activity stream.
 *
 * Operator data: it names the archive's records and their edit times, so the
 * read is session-gated and `no-store` (it used to be public AND CDN-cached).
 * Without a database there is nothing to report, so the stream is empty rather
 * than invented — the fallback entries previously claimed work (encryption,
 * telemetry ingestion) that no code performs.
 */
export async function GET(req: NextRequest) {
  const denied = requireSession(req);
  if (denied) {
    denied.headers.set("Cache-Control", "no-store");
    return denied;
  }

  try {
    if (!hasDatabase()) {
      return NextResponse.json(
        { activities: [] },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const activities: ActivityItem[] = [];

    const [recentProjects, recentSkills, recentExperiences, recentTelemetry, config] = await Promise.all([
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 3,
        select: { id: true, title: true, updatedAt: true, createdAt: true, complexity: true },
      }),
      prisma.skill.findMany({
        orderBy: { updatedAt: "desc" },
        take: 3,
        select: { id: true, name: true, level: true, updatedAt: true },
      }),
      prisma.experience.findMany({
        orderBy: { updatedAt: "desc" },
        take: 2,
        select: { id: true, role: true, company: true, updatedAt: true },
      }),
      prisma.telemetryEvent.findMany({
        orderBy: { recordedAt: "desc" },
        take: 3,
        select: { id: true, name: true, value: true, rating: true, recordedAt: true },
      }),
      prisma.portfolioConfig.findUnique({
        where: { id: "main" },
        select: { siteName: true, edition: true, updatedAt: true, status: true },
      }),
    ]);

    if (config) {
      activities.push({
        id: `cfg-${config.updatedAt.getTime()}`,
        action: "Codex settings saved",
        detail: `${config.siteName} · ${config.edition} · ${config.status}`,
        time: formatRelativeTime(config.updatedAt),
        type: "deploy",
        timestamp: config.updatedAt.toISOString(),
      });
    }

    for (const p of recentProjects) {
      activities.push({
        id: `proj-${p.id}`,
        action:
          p.createdAt.getTime() === p.updatedAt.getTime()
            ? "Domain published"
            : "Domain updated",
        detail: `${p.title} · grade ${p.complexity}`,
        time: formatRelativeTime(p.updatedAt),
        type: "update",
        timestamp: p.updatedAt.toISOString(),
      });
    }

    for (const s of recentSkills) {
      activities.push({
        id: `skill-${s.id}`,
        action: "Talent calibrated",
        detail: `${s.name} set to ${s.level}%`,
        time: formatRelativeTime(s.updatedAt),
        type: "calibrate",
        timestamp: s.updatedAt.toISOString(),
      });
    }

    for (const e of recentExperiences) {
      activities.push({
        id: `exp-${e.id}`,
        action: "Quest log updated",
        detail: `${e.role} — ${e.company}`,
        time: formatRelativeTime(e.updatedAt),
        type: "update",
        timestamp: e.updatedAt.toISOString(),
      });
    }

    for (const t of recentTelemetry) {
      activities.push({
        id: `telem-${t.id}`,
        action: "Telemetry beacon received",
        detail: `${t.name} ${Math.round(t.value)}ms (${t.rating.toUpperCase()})`,
        time: formatRelativeTime(t.recordedAt),
        type: "sync",
        timestamp: t.recordedAt.toISOString(),
      });
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return NextResponse.json(
      { activities: activities.slice(0, 8) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[ACTIVITY_GET]", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Failed to fetch activity stream" }, { status: 500 });
  }
}
