"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Activity,
  Boxes,
  Cpu,
  Eye,
  TrendingUp,
  Users,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { ProjectRow, type ProjectRowData } from "@/components/features/project-row";
import { useData } from "@/lib/use-data";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardPageSkeleton } from "@/components/ui/skeleton";
import { fadeInUp, fadeInUpItem, staggerContainer } from "@/lib/motion-variants";

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

interface ApiProject extends ProjectRowData {
  id: string;
  description: string;
  year: string;
  githubUrl: string | null;
}

export default function DashboardOverview() {
  const { data: stats, loading: statsLoading } = useData<DashboardStats>("/api/dashboard/stats");
  const { data: projects, loading: projectsLoading } = useData<ApiProject[]>("/api/projects");

  if (statsLoading || projectsLoading) {
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

  const recentActivity = [
    { action: "Portfolio deployed", detail: "AETHER-HUD v2.4.1", time: "2m ago", type: "deploy" as const },
    { action: "System online", detail: "All modules operational", time: "1h ago", type: "update" as const },
    { action: "Data synchronized", detail: `${projectList.length} projects indexed`, time: "3h ago", type: "calibrate" as const },
  ];

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
        {/* Projects Quick Overview */}
        <ErrorBoundary section="projects" fallback={<WidgetError label="PROJECT ARCHIVE" className="h-full" />}>
          <motion.div className="lg:col-span-2" {...fadeInUp}>
            <Card variant="glass" hover="none" diamond>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-gold-400" />
                    <CardTitle>Deployed Archives</CardTitle>
                  </div>
                  <Badge variant="gold" size="sm">
                    {projectList.length} ACTIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectList.length === 0 ? (
                    <p className="py-4 text-center font-mono text-xs text-text-muted">
                      [EMPTY] // No projects deployed
                    </p>
                  ) : (
                    projectList.map((project: ApiProject) => (
                      <ProjectRow key={project.id} project={project} />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ErrorBoundary>

        {/* Activity Feed — lazy-loaded */}
        <ErrorBoundary section="activity" fallback={<WidgetError label="ACTIVITY FEED" className="h-full" />}>
          <motion.div {...fadeInUp}>
            <ActivityFeed items={recentActivity} />
          </motion.div>
        </ErrorBoundary>
      </div>

      {/* Quick Actions */}
      <ErrorBoundary section="quick-actions" fallback={<WidgetError label="QUICK ACTIONS" className="mt-4 sm:mt-6" />}>
        <motion.div className="mt-4 sm:mt-6" {...fadeInUp}>
          <Card variant="glass" hover="none" diamond>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="sys-label-gold text-[9px]">QUICK ACTIONS //</span>
                <Button variant="secondary" size="sm">
                  <RefreshCw className="h-3.5 w-3.5" />
                  SYNC DATA
                </Button>
                <Button variant="secondary" size="sm">
                  <Users className="h-3.5 w-3.5" />
                  VIEW ANALYTICS
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ErrorBoundary>
    </div>
  );
}
