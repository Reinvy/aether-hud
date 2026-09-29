"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Activity,
  Boxes,
  Briefcase,
  Cpu,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { ProjectArchivePanel } from "@/components/features/overview/project-archive-panel";
import { QuickActionsPanel } from "@/components/features/overview/quick-actions-panel";
import { useData } from "@/lib/use-data";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardPageSkeleton } from "@/components/ui/skeleton";
import { fadeInUp, fadeInUpItem, staggerContainer } from "@/lib/motion-variants";
import type { ActivityItem } from "@/components/features/activity-feed";
import type { ProjectDto, StatsDto } from "@/lib/dto";

// Lazy-load the ActivityFeed widget — it is below-the-fold on the overview
// and only renders after stats/projects resolve, so deferring its chunk
// keeps the initial dashboard payload smaller.
const ActivityFeed = dynamic(
  () =>
    import("@/components/features/activity-feed").then((m) => ({
      default: m.ActivityFeed,
    })),
  {
    loading: () => (
      <Card variant="glass" hover="none" className="h-full">
        <CardContent className="space-y-4 p-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="mt-1 h-2 w-2 rotate-45 bg-leather-caramel/20 codex-shimmer dark:bg-glass-300" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 rounded-full bg-leather-caramel/15 codex-shimmer dark:bg-glass-200" />
                <div className="h-2 w-1/2 rounded-full bg-leather-caramel/15 codex-shimmer dark:bg-glass-200" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    ),
  }
);

/** Shape of `/api/dashboard/activity` — a rendered feed, not a wire record. */
interface ActivityResponse {
  activities: ActivityItem[];
}

export default function DashboardOverview() {
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useData<StatsDto>("/api/dashboard/stats");
  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useData<ProjectDto[]>("/api/projects");
  const {
    data: activityData,
    loading: activityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useData<ActivityResponse>("/api/dashboard/activity");

  if (statsLoading || projectsLoading || activityLoading) {
    return <DashboardPageSkeleton />;
  }

  const statCards = [
    {
      label: "Active domains",
      value: String(stats?.projectCount ?? 0).padStart(2, "0"),
      icon: Boxes,
      color: "gold" as const,
    },
    {
      label: "Talents mastered",
      value: String(stats?.skillCount ?? 0).padStart(2, "0"),
      icon: Cpu,
      color: "jade" as const,
    },
    {
      label: "Quests logged",
      value: String(stats?.experienceCount ?? 0).padStart(2, "0"),
      icon: Briefcase,
      color: "gold" as const,
    },
    {
      label: "Uptime",
      value: stats?.uptime ?? "99.9%",
      icon: TrendingUp,
      color: "jade" as const,
    },
  ];

  const projectList = projects ?? [];
  const activities = activityData?.activities ?? [];

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Activity}
        eyebrow="ADVENTURER HANDBOOK"
        title="Codex Overview"
        titleHighlight="Overview"
      />

      {/* Stats Grid — Stagger Animation */}
      <ErrorBoundary section="stats" fallback={<WidgetError label="CODEX STATS" />}>
        {statsError ? (
          <WidgetError label="CODEX STATS" />
        ) : (
          <motion.div
            className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {statCards.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUpItem}>
                <StatCard label={stat.label} value={stat.value} icon={stat.icon} tone={stat.color} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </ErrorBoundary>

      {/* Main Content Area */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Domains Quick Overview — reusable archive panel */}
        <ErrorBoundary section="projects" fallback={<WidgetError label="DOMAIN ARCHIVE" className="h-full" />}>
          {projectsError ? (
            <WidgetError label="DOMAIN ARCHIVE" className="h-full lg:col-span-2" />
          ) : (
            <motion.div className="lg:col-span-2" {...fadeInUp}>
              <ProjectArchivePanel projects={projectList} />
            </motion.div>
          )}
        </ErrorBoundary>

        {/* Activity Feed — lazy-loaded & dynamic */}
        <ErrorBoundary section="activity" fallback={<WidgetError label="ACTIVITY LOG" className="h-full" />}>
          {activityError ? (
            <WidgetError label="ACTIVITY LOG" className="h-full" />
          ) : (
            <motion.div {...fadeInUp}>
              <ActivityFeed items={activities} />
            </motion.div>
          )}
        </ErrorBoundary>
      </div>

      {/* Quick Actions — reusable shortcut panel */}
      <ErrorBoundary section="quick-actions" fallback={<WidgetError label="QUICK ACTIONS" className="mt-4 sm:mt-6" />}>
        <motion.div className="mt-4 sm:mt-6" {...fadeInUp}>
          <QuickActionsPanel
            onSync={async () => {
              await Promise.all([refetchStats(), refetchProjects(), refetchActivity()]);
            }}
          />
        </motion.div>
      </ErrorBoundary>
    </div>
  );
}
