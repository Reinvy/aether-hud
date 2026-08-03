"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  Boxes,
  Plus,
  ExternalLink,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBox } from "@/components/ui/icon-box";
import { RowActions } from "@/components/ui/row-actions";
import { HudLoader } from "@/components/ui/hud-loader";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import type { ProjectFormRecord } from "@/components/features/project-form-modal";

// The create/edit dossier form is heavy (9 fields + modal chrome). It only
// renders when the operator opens the modal, so it is lazy-loaded as its
// own chunk — the archive list's initial bundle stays small. A HUD loader
// overlay is shown during the (usually cached) chunk fetch.
const ProjectFormModal = dynamic(
  () =>
    import("@/components/features/project-form-modal").then((m) => ({
      default: m.ProjectFormModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <HudLoader label="LOADING DOSSIER MODULE" size="md" />
      </div>
    ),
  }
);

export default function DashboardProjects() {
  const { data: projects, loading, refetch } = useData<ProjectFormRecord[]>("/api/projects");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFormRecord | null>(null);

  function openNew() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEdit(project: ProjectFormRecord) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("PURGE DOSSIER? This action cannot be undone.")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      refetch();
    } catch (e) {
      console.error("Failed to delete project", e);
    }
  }

  const filtered = projects
    ? projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  if (loading) {
    return <DashboardListSkeleton rows={5} />;
  }

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Boxes}
        label="DASHBOARD // PROJECT ARCHIVE"
        title="Manage Projects"
        titleHighlight="Projects"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            NEW DOSSIER
          </Button>
        }
      />

      {/* Search */}
      <motion.div className="mb-6 max-w-md" {...fadeInUp}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            className="input-recessed w-full pl-10 pr-4 py-2.5 text-sm font-body"
            placeholder="Search project archives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Projects Table/Card List */}
      <motion.div className="space-y-3" {...fadeInUp}>
        <div className="flex items-center gap-4 border-b border-border-subtle px-4 py-2">
          <span className="sys-label w-8 text-center">#</span>
          <span className="sys-label flex-1">PROJECT NAME</span>
          <span className="sys-label hidden w-24 sm:block">CATEGORY</span>
          <span className="sys-label hidden w-20 md:block">STATUS</span>
          <span className="sys-label w-20 text-center">ACTIONS</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No projects match your search criteria" />
        ) : (
          filtered.map((project, i) => {
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card variant="glass" hover="sweep" diamond>
                  <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4">
                    <IconBox>
                      <span className="font-mono text-[10px] text-gold-400">
                        {project.complexity.slice(-1)}
                      </span>
                    </IconBox>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-medium tracking-wider text-text-main group-hover:text-gold-400 transition-colors duration-200">
                        {project.title}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[9px] text-text-muted">
                        {project.description.slice(0, 80)}...
                      </p>
                    </div>

                    <div className="hidden w-24 sm:block">
                      <Badge variant="default" size="sm">
                        {project.category}
                      </Badge>
                    </div>

                    <div className="hidden w-20 items-center gap-2 md:flex">
                      <span className="led-active" />
                      <span className="sys-label-active text-[8px]">DEPLOYED</span>
                    </div>

                    <div className="flex w-20 items-center justify-end">
                      <RowActions
                        onEdit={() => openEdit(project)}
                        onDelete={() => handleDelete(project.id)}
                        leading={
                          project.liveUrl ? (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" glow="none" className="p-1.5 sm:p-2">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                          ) : undefined
                        }
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Edit / New Modal — lazy-loaded chunk */}
      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        project={editingProject}
        onSaved={() => {
          setModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
