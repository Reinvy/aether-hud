"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { RowActions } from "@/components/ui/row-actions";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";


interface ApiProject {
  id: string;
  title: string;
  description: string;
  tags: string; // JSON array string
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string | null;
  githubUrl: string | null;
}

type FormData = {
  title: string;
  description: string;
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string;
  githubUrl: string;
  tags: string; // comma-separated for the input
};

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  category: "",
  complexity: "CLASS-B",
  performance: "95%",
  year: new Date().getFullYear().toString(),
  liveUrl: "",
  githubUrl: "",
  tags: "",
};

export default function DashboardProjects() {
  const { data: projects, loading, refetch } = useData<ApiProject[]>("/api/projects");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(project: ApiProject) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      complexity: project.complexity,
      performance: project.performance,
      year: project.year,
      liveUrl: project.liveUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      tags: parseTagsDisplay(project.tags),
    });
    setModalOpen(true);
  }

  function parseTagsDisplay(tags: string): string {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed.join(", ") : tags;
    } catch {
      return tags;
    }
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        category: form.category,
        complexity: form.complexity,
        performance: form.performance,
        year: form.year,
        liveUrl: form.liveUrl || null,
        githubUrl: form.githubUrl || null,
        tags: JSON.stringify(
          form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        ),
      };

      if (editingId) {
        await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...body }),
        });
      } else {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setModalOpen(false);
      refetch();
    } catch (e) {
      console.error("Failed to save project", e);
    } finally {
      setSaving(false);
    }
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

      {/* Edit / New Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "EDIT DOSSIER" : "NEW DOSSIER"}
        sysId={editingId ? `DASH//01 // ${editingId.slice(0, 8)}` : "DASH//01 // NEW"}
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              CANCEL
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              SAVE DOSSIER
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="FIELD_01 // PROJECT TITLE"
            placeholder="Enter project designation..."
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
          <Textarea
            label="FIELD_02 // DESCRIPTION"
            placeholder="Mission briefing..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="FIELD_03 // COMPLEXITY"
              placeholder="CLASS-B"
              value={form.complexity}
              onChange={(e) => updateField("complexity", e.target.value)}
            />
            <Input
              label="FIELD_04 // CATEGORY"
              placeholder="AI Platform"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="FIELD_05 // PERFORMANCE"
              placeholder="95%"
              value={form.performance}
              onChange={(e) => updateField("performance", e.target.value)}
            />
            <Input
              label="FIELD_06 // YEAR"
              placeholder="2026"
              value={form.year}
              onChange={(e) => updateField("year", e.target.value)}
            />
          </div>
          <Input
            label="FIELD_07 // TAGS (comma-separated)"
            placeholder="Next.js, TypeScript, Prisma"
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="FIELD_08 // LIVE URL"
              placeholder="https://..."
              value={form.liveUrl}
              onChange={(e) => updateField("liveUrl", e.target.value)}
            />
            <Input
              label="FIELD_09 // GITHUB URL"
              placeholder="https://github.com/..."
              value={form.githubUrl}
              onChange={(e) => updateField("githubUrl", e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
