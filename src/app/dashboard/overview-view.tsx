"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Activity,
  Boxes,
  Cpu,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import {
  ProjectArchivePanel,
  type ArchiveProject,
} from "@/components/features/overview/project-archive-panel";
import { QuickActionsPanel } from "@/components/features/overview/quick-actions-panel";
import { useData } from "@/lib/use-data";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardPageSkeleton } from "@/components/ui/skeleton";
import { fadeInUp, fadeInUpItem, staggerContainer } from "@/lib/motion-variants";
import type { ActivityItem } from "@/components/features/activity-feed";

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
      <Card variant="glass" hover="none" diamond className="h-full">
        <CardContent className="space-y-4 p-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="mt-1 h-2 w-2 rotate-45 bg-glass-300 skeleton-hud" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 bg-glass-200 rounded-none skeleton-hud" />
                <div className="h-2 w-1/2 bg-glass-200 rounded-none skeleton-hud" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    ),
  }
);

interface DashboardStats {
  projectCount: number;
  skillCount: number;
  experienceCount: number;
  testimonialCount: number;
  uptime: string;
}

interface ActivityResponse {
  activities: ActivityItem[];
}

export default function DashboardOverview() {
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useData<DashboardStats>("/api/dashboard/stats");
  const { data: projects, loading: projectsLoading, refetch: refetchProjects } = useData<ArchiveProject[]>("/api/projects");
  const { data: activityData, loading: activityLoading, refetch: refetchActivity } = useData<ActivityResponse>("/api/dashboard/activity");

  if (statsLoading || projectsLoading || activityLoading) {
    return <DashboardPageSkeleton />;
  }

  const statCards = [
    {
      label: "ACTIVE PROJECTS",
      value: String(stats?.projectCount ?? 0).padStart(2, "0"),
      icon: Boxes,
      color: "gold" as const,
    },
    {
      label: "SKILL MODULES",
      value: String(stats?.skillCount ?? 0).padStart(2, "0"),
      icon: Cpu,
      color: "stellar" as const,
    },
    {
      label: "EXPERIENCES",
      value: String(stats?.experienceCount ?? 0).padStart(2, "0"),
      icon: Eye,
      color: "gold" as const,
    },
    {
      label: "UPTIME",
      value: stats?.uptime ?? "99.9%",
      icon: TrendingUp,
      color: "stellar" as const,
    },
  ];

  const projectList = projects ?? [];
  const activities = activityData?.activities ?? [];

  return (
    <div className="dashboard-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Activity}
        label="DASHBOARD // CONTROL PANEL"
        title="SYSTEM OVERVIEW"
        titleHighlight="OVERVIEW"
      />

      {/* Stats Grid — Stagger Animation */}
      <ErrorBoundary section="stats" fallback={<WidgetError label="STATS GRID" />}>
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
      </ErrorBoundary>

      {/* Main Content Area */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Projects Quick Overview — reusable archive panel */}
        <ErrorBoundary section="projects" fallback={<WidgetError label="PROJECT ARCHIVE" className="h-full" />}>
          <motion.div className="lg:col-span-2" {...fadeInUp}>
            <ProjectArchivePanel projects={projectList} />
          </motion.div>
        </ErrorBoundary>

        {/* Activity Feed — lazy-loaded & dynamic */}
        <ErrorBoundary section="activity" fallback={<WidgetError label="ACTIVITY FEED" className="h-full" />}>
          <motion.div {...fadeInUp}>
            <ActivityFeed items={activities} />
          </motion.div>
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
