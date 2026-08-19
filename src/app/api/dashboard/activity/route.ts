import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" };

export type ActivityItem = {
  id: string;
  action: string;
  detail: string;
  time: string;
  type: "deploy" | "update" | "calibrate" | "sync";
  timestamp: string;
};

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

export async function GET() {
  try {
    const activities: ActivityItem[] = [];

    try {
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
          select: { siteName: true, sysVersion: true, updatedAt: true, status: true },
        }),
      ]);

      if (config) {
        activities.push({
          id: `cfg-${config.updatedAt.getTime()}`,
          action: "System configured",
          detail: `${config.siteName} ${config.sysVersion} // ${config.status}`,
          time: formatRelativeTime(config.updatedAt),
          type: "deploy",
          timestamp: config.updatedAt.toISOString(),
        });
      }

      for (const p of recentProjects) {
        activities.push({
          id: `proj-${p.id}`,
          action: p.createdAt.getTime() === p.updatedAt.getTime() ? "Dossier initialized" : "Project updated",
          detail: `${p.title} // ${p.complexity}`,
          time: formatRelativeTime(p.updatedAt),
          type: "update",
          timestamp: p.updatedAt.toISOString(),
        });
      }

      for (const s of recentSkills) {
        activities.push({
          id: `skill-${s.id}`,
          action: "Proficiency calibrated",
          detail: `${s.name} set to ${s.level}%`,
          time: formatRelativeTime(s.updatedAt),
          type: "calibrate",
          timestamp: s.updatedAt.toISOString(),
        });
      }

      for (const e of recentExperiences) {
        activities.push({
          id: `exp-${e.id}`,
          action: "Mission log updated",
          detail: `${e.role} @ ${e.company}`,
          time: formatRelativeTime(e.updatedAt),
          type: "update",
          timestamp: e.updatedAt.toISOString(),
        });
      }

      for (const t of recentTelemetry) {
        activities.push({
          id: `telem-${t.id}`,
          action: "Telemetry beacon ingested",
          detail: `${t.name}: ${Math.round(t.value)}ms (${t.rating.toUpperCase()})`,
          time: formatRelativeTime(t.recordedAt),
          type: "sync",
          timestamp: t.recordedAt.toISOString(),
        });
      }

      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (dbErr) {
      console.warn("[ACTIVITY_DB_FALLBACK]", dbErr instanceof Error ? dbErr.message : dbErr);
    }

    // If database is empty or down, supply realistic system fallback events
    if (activities.length === 0) {
      activities.push(
        {
          id: "fallback-1",
          action: "System online",
          detail: "AETHER-HUD Core v2.4.1 operational",
          time: "just now",
          type: "deploy",
          timestamp: new Date().toISOString(),
        },
        {
          id: "fallback-2",
          action: "Telemetry node active",
          detail: "Web Vitals beacon sink ready",
          time: "10m ago",
          type: "sync",
          timestamp: new Date(Date.now() - 600000).toISOString(),
        },
        {
          id: "fallback-3",
          action: "Security protocols active",
          detail: "AES-256 transmission encryption enabled",
          time: "1h ago",
          type: "calibrate",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        }
      );
    }

    return NextResponse.json({ activities: activities.slice(0, 8) }, { headers: CACHE_HEADERS });
  } catch (err) {
    console.error("[ACTIVITY_GET]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Failed to fetch activity stream" }, { status: 500 });
  }
}
