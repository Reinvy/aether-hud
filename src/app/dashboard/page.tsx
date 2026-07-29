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
import { portfolioData } from "@/data/portfolio";
import type { Project } from "@/lib/constants";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

const stats = [
  { label: "ACTIVE PROJECTS", value: portfolioData.projects.length.toString().padStart(2, "0"), icon: Boxes, color: "gold" },
  { label: "SKILL MODULES", value: portfolioData.skills.length.toString().padStart(2, "0"), icon: Cpu, color: "stellar" },
  { label: "TOTAL VIEWS", value: "1,247", icon: Eye, color: "gold" },
  { label: "UPTIME", value: "99.9%", icon: TrendingUp, color: "stellar" },
];

const recentActivity = [
  { action: "Portfolio deployed", detail: "AETHER-HUD v2.4.1", time: "2m ago", type: "deploy" },
  { action: "Project updated", detail: "AniVerse — performance optimization", time: "1h ago", type: "update" },
  { action: "Skill recalibrated", detail: "TypeScript → 92% proficiency", time: "3h ago", type: "calibrate" },
];

export default function DashboardOverview() {
  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">DASHBOARD // CONTROL PANEL</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              SYSTEM <span className="text-gradient-gold">OVERVIEW</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="led-active" />
            <span className="sys-label-active text-[10px]">ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card variant="glass" hover="sweep">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="sys-label text-[9px]">{stat.label}</span>
                      <p className={`mt-2 font-display text-3xl font-bold tracking-wider ${
                        stat.color === "gold" ? "text-gold-400" : "text-stellar-400"
                      }`}>
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${
                      stat.color === "gold" ? "text-gold-400/30" : "text-stellar-400/30"
                    }`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Projects Quick Overview */}
        <motion.div className="lg:col-span-2" {...fadeInUp}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-gold-400" />
                  <CardTitle>Deployed Archives</CardTitle>
                </div>
                <Badge variant="gold" size="sm">
                  {portfolioData.projects.length} ACTIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioData.projects.map((project: Project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded border border-border-subtle px-4 py-3 transition-all hover:border-border-glass hover:bg-glass-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-8 h-8 rounded border border-border-glass bg-deep-space/50">
                        <span className="font-mono text-[9px] text-gold-400">{project.complexity.slice(-1)}</span>
                      </div>
                      <div>
                        <p className="font-mono text-xs font-medium tracking-wider text-text-main">
                          {project.title}
                        </p>
                        <p className="font-mono text-[9px] text-text-muted tracking-wider">
                          {project.category} // {project.tags.slice(0, 2).join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="sys-label text-[8px]">PERF: {project.performance}</span>
                      {project.links.live && (
                        <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 text-text-muted group-hover:text-gold-400 transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div {...fadeInUp}>
          <Card variant="glass" hover="none" className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gold-400" />
                  <CardTitle>Activity Log</CardTitle>
                </div>
                <RefreshCw className="h-3.5 w-3.5 text-text-muted cursor-pointer hover:text-gold-400 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full ${
                      activity.type === "deploy" ? "bg-hud-active" :
                      activity.type === "update" ? "bg-gold-400" : "bg-stellar-400"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] font-medium tracking-wider text-text-main truncate">
                        {activity.action}
                      </p>
                      <p className="font-mono text-[9px] text-text-muted mt-0.5">
                        {activity.detail}
                      </p>
                      <p className="sys-label text-[8px] mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div className="mt-6" {...fadeInUp}>
        <Card variant="glass" hover="none">
          <CardContent className="p-5">
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
