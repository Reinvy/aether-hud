"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Boxes,
  Cpu,
  Eye,
  TrendingUp,
  Users,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardPageSkeleton } from "@/components/ui/skeleton";

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const fadeInUpItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

interface DashboardStats {
  projectCount: number;
  skillCount: number;
  experienceCount: number;
  testimonialCount: number;
  uptime: string;
}

interface ApiProject {
  id: string;
  title: string;
  description: string;
  tags: string;
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string | null;
  githubUrl: string | null;
}

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tags ? tags.split(",").map((t) => t.trim()) : [];
  }
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
      <motion.div
        className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={fadeInUpItem}>
              <Card variant="glass" hover="lift" diamond>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <span className="sys-label text-[9px]">{stat.label}</span>
                      <p
                        className={`mt-2 font-display text-2xl sm:text-3xl font-bold tracking-wider ${
                          stat.color === "gold" ? "text-gold-400" : "text-stellar-400"
                        }`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <Icon
                      className={`h-6 w-6 sm:h-8 sm:w-8 shrink-0 ${
                        stat.color === "gold" ? "text-gold-400/30" : "text-stellar-400/30"
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Area */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Projects Quick Overview */}
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
                  projectList.map((project: ApiProject) => {
                    const tags = parseTags(project.tags);
                    return (
                      <div
                        key={project.id}
                        className="group flex items-center justify-between rounded-sm border border-border-subtle px-3 sm:px-4 py-3 transition-all duration-200 hover:border-border-glass hover:bg-glass-200 hover-scale-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border-glass bg-deep-space/50">
                            <span className="font-mono text-[9px] text-gold-400">
                              {project.complexity.slice(-1)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-mono text-xs font-medium tracking-wider text-text-main group-hover:text-gold-400 transition-colors duration-200">
                              {project.title}
                            </p>
                            <p className="truncate font-mono text-[9px] tracking-wider text-text-muted">
                              {project.category} // {tags.slice(0, 2).join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                          <span className="sys-label text-[8px] hidden sm:inline">PERF: {project.performance}</span>
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover-scale-sm block p-1">
                              <ExternalLink className="h-3.5 w-3.5 text-text-muted transition-colors hover:text-gold-400" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div {...fadeInUp}>
          <Card variant="glass" hover="none" diamond className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gold-400" />
                  <CardTitle>Activity Log</CardTitle>
                </div>
                <RefreshCw className="h-3.5 w-3.5 cursor-pointer text-text-muted transition-all duration-200 hover:text-gold-400 hover-scale-sm" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-3 group">
                    <div
                      className={`mt-0.5 h-2 w-2 rounded-full transition-transform duration-200 group-hover:scale-125 ${
                        activity.type === "deploy"
                          ? "bg-hud-active"
                          : activity.type === "update"
                            ? "bg-gold-400"
                            : "bg-stellar-400"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[11px] font-medium tracking-wider text-text-main group-hover:text-gold-400 transition-colors duration-200">
                        {activity.action}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] text-text-muted">
                        {activity.detail}
                      </p>
                      <p className="sys-label mt-0.5 text-[8px]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
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
    </div>
  );
}
