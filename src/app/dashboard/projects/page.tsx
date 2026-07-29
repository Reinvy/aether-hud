"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Plus,
  ExternalLink,
  GitBranch,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { portfolioData } from "@/data/portfolio";
import type { Project } from "@/lib/constants";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

export default function DashboardProjects() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filtered = portfolioData.projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Boxes className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">DASHBOARD // PROJECT ARCHIVE</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              Manage <span className="text-gradient-gold">Projects</span>
            </h1>
          </div>
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            NEW DOSSIER
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div className="mb-6 max-w-md" {...fadeInUp}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
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
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border-subtle">
          <span className="sys-label w-8 text-center">#</span>
          <span className="sys-label flex-1">PROJECT NAME</span>
          <span className="sys-label hidden sm:block w-24">CATEGORY</span>
          <span className="sys-label hidden md:block w-20">STATUS</span>
          <span className="sys-label w-20 text-center">ACTIONS</span>
        </div>

        {filtered.length === 0 ? (
          <Card variant="glass" hover="none">
            <CardContent className="p-8 text-center">
              <p className="font-mono text-sm text-text-muted">
                [EMPTY] // No projects match your search criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="glass" hover="sweep">
                <div className="flex items-center gap-4 px-4 py-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded border border-border-glass bg-deep-space/50 shrink-0">
                    <span className="font-mono text-[10px] text-gold-400">
                      {project.complexity.slice(-1)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-medium tracking-wider text-text-main truncate">
                      {project.title}
                    </p>
                    <p className="font-mono text-[9px] text-text-muted mt-0.5 truncate">
                      {project.description.slice(0, 80)}...
                    </p>
                  </div>

                  <div className="hidden sm:block w-24">
                    <Badge variant="default" size="sm">{project.category}</Badge>
                  </div>

                  <div className="hidden md:flex items-center gap-2 w-20">
                    <span className="led-active" />
                    <span className="sys-label-active text-[8px]">DEPLOYED</span>
                  </div>

                  <div className="flex items-center gap-1 w-20 justify-end">
                    {project.links.live && (
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" glow="none" className="p-1.5">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    )}
                    <Button variant="ghost" size="sm" glow="none" className="p-1.5" onClick={() => openEdit(project)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" glow="none" className="p-1.5 text-hud-danger hover:text-hud-danger">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Edit / New Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? "EDIT DOSSIER" : "NEW DOSSIER"}
        sysId={editingProject ? `DASH//01 // ${editingProject.id}` : "DASH//01 // NEW"}
      >
        <div className="space-y-4">
          <Input
            label="FIELD_01 // PROJECT TITLE"
            defaultValue={editingProject?.title || ""}
            placeholder="Enter project designation..."
          />
          <div>
            <label className="sys-label mb-2 block text-text-muted">FIELD_02 // DESCRIPTION</label>
            <textarea
              className="input-recessed w-full px-4 py-2.5 text-sm font-body resize-none"
              rows={3}
              defaultValue={editingProject?.description || ""}
              placeholder="Mission briefing..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="FIELD_03 // COMPLEXITY"
              defaultValue={editingProject?.complexity || "CLASS-B"}
            />
            <Input
              label="FIELD_04 // CATEGORY"
              defaultValue={editingProject?.category || ""}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="primary" size="sm">
              SAVE DOSSIER
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
