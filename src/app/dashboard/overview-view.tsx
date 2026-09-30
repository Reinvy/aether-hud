"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ActionError } from "@/components/ui/action-error";
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
import type { GenshinIconKey } from "@/lib/ui-icons";
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
              <div className="mt-1 h-2 w-2 rotate-45 bg-leather-caramel/20 codex-shimmer" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 rounded-full bg-leather-caramel/15 codex-shimmer" />
                <div className="h-2 w-1/2 rounded-full bg-leather-caramel/15 codex-shimmer" />
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

  // Skeleton on first paint only — a refetch after a sync keeps the current
  // cards, feed and archive on screen instead of flashing the placeholder.
  if (
    (statsLoading && stats === null) ||
    (projectsLoading && projects === null) ||
    (activityLoading && activityData === null)
  ) {
    return <DashboardPageSkeleton />;
  }

  const statCards: {
    label: string;
    value: string;
    icon: GenshinIconKey;
    tone: "gold" | "jade";
  }[] = [
    {
      label: "Active domains",
      value: String(stats?.projectCount ?? 0).padStart(2, "0"),
      icon: "domain",
      tone: "gold",
    },
    {
      label: "Talents mastered",
      value: String(stats?.skillCount ?? 0).padStart(2, "0"),
      icon: "talents",
      tone: "jade",
    },
    {
      label: "Quests logged",
      value: String(stats?.experienceCount ?? 0).padStart(2, "0"),
      icon: "quests",
      tone: "gold",
    },
    {
      label: "Allies bound",
      value: String(stats?.testimonialCount ?? 0).padStart(2, "0"),
      icon: "friends",
      tone: "jade",
    },
  ];

  const projectList = projects ?? [];
  const activities = activityData?.activities ?? [];
  const loadError = statsError ?? projectsError ?? activityError;

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon="paimonMenu"
        eyebrow="ADVENTURER HANDBOOK"
        title="Codex Overview"
        titleHighlight="Overview"
      />

      {/* A failed read is surfaced as an action banner; each widget below
          keeps its own retry so one dead feed never hides the others. */}
      {loadError !== null && <ActionError message={loadError} className="mb-6" />}

      {/* Stats Grid — Stagger Animation */}
      <ErrorBoundary section="stats" fallback={<WidgetError label="Codex stats" />}>
        {statsError ? (
          <WidgetError label="Codex stats" message={statsError} onRetry={refetchStats} />
        ) : (
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {statCards.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUpItem}>
                <StatCard label={stat.label} value={stat.value} icon={stat.icon} tone={stat.tone} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </ErrorBoundary>

      {/* Main Content Area */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Domains Quick Overview — reusable archive panel */}
        <ErrorBoundary section="projects" fallback={<WidgetError label="Domain archive" className="h-full" />}>
          {projectsError ? (
            <WidgetError
              label="Domain archive"
              message={projectsError}
              onRetry={refetchProjects}
              className="h-full lg:col-span-2"
            />
          ) : (
            <motion.div className="lg:col-span-2" {...fadeInUp}>
              <ProjectArchivePanel projects={projectList} />
            </motion.div>
          )}
        </ErrorBoundary>

        {/* Activity Feed — lazy-loaded & dynamic */}
        <ErrorBoundary section="activity" fallback={<WidgetError label="Activity log" className="h-full" />}>
          {activityError ? (
            <WidgetError
              label="Activity log"
              message={activityError}
              onRetry={refetchActivity}
              className="h-full"
            />
          ) : (
            <motion.div {...fadeInUp}>
              <ActivityFeed items={activities} />
            </motion.div>
          )}
        </ErrorBoundary>
      </div>

      {/* Quick Actions — reusable shortcut panel */}
      <ErrorBoundary section="quick-actions" fallback={<WidgetError label="Quick actions" className="mt-4 sm:mt-6" />}>
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
