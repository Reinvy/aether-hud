"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  Cpu,
  Plus,
  Globe,
  FileCode,
  Server,
  Database,
  Brain,
  Zap,
  Container,
  PenTool,
  Rocket,
  Palette,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { IconBox } from "@/components/ui/icon-box";
import { RowActions } from "@/components/ui/row-actions";
import { SegmentBar } from "@/components/ui/segment-bar";
import { CategoryFilter } from "@/components/features/category-filter";
import { HudLoader } from "@/components/ui/hud-loader";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import type { SkillFormRecord } from "@/components/features/skill-form-modal";

const iconMap: Record<string, React.ElementType> = {
  Globe, FileCode, Palette, Server, Database, Brain, Zap, Container, PenTool, Rocket,
};


interface ApiSkill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
}

// The create/edit form module is lazy-loaded as its own chunk — it only
// renders when the operator opens the modal, keeping the matrix list's
// initial bundle small. A HUD loader overlay is shown during the chunk
// fetch.
const SkillFormModal = dynamic(
  () =>
    import("@/components/features/skill-form-modal").then((m) => ({
      default: m.SkillFormModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <HudLoader label="LOADING SKILL MODULE" size="md" />
      </div>
    ),
  }
);

export default function DashboardSkills() {
  const { data: skills, loading, refetch } = useData<ApiSkill[]>("/api/skills");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillFormRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiSkill | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openNew() {
    setEditingSkill(null);
    setModalOpen(true);
  }

  function openEdit(skill: ApiSkill) {
    setEditingSkill(skill);
    setModalOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/skills/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      console.error("Failed to delete skill", e);
    } finally {
      setDeleting(false);
    }
  }

  const skillList = skills ?? [];
  const categories = [...new Set(skillList.map((s) => s.category))];
  const filtered = activeCategory
    ? skillList.filter((s) => s.category === activeCategory)
    : skillList;

  if (loading) {
    return <DashboardListSkeleton rows={6} />;
  }

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Cpu}
        label="DASHBOARD // SKILL MATRIX"
        title="Manage Proficiencies"
        titleHighlight="Proficiencies"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            ADD SKILL
          </Button>
        }
      />

      {/* Category Filters */}
      <motion.div className="mb-6" {...fadeInUp}>
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
          total={skillList.length}
          counts={Object.fromEntries(
            categories.map((cat) => [cat, skillList.filter((s) => s.category === cat).length])
          )}
        />
      </motion.div>

      {/* Skills Grid */}
      <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" {...fadeInUp}>
        {filtered.map((skill, i) => {
          const Icon = iconMap[skill.icon] || Cpu;
          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="glass" hover="sweep" diamond className="skillbar-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <IconBox size="md">
                        <Icon className="h-5 w-5 text-gold-400/60 transition-colors duration-300 group-hover:text-gold-400" />
                      </IconBox>
                      <div>
                        <p className="font-mono text-xs font-medium tracking-wider text-text-main">
                          {skill.name}
                        </p>
                        <Badge variant="default" size="sm" className="mt-1">
                          {skill.category}
                        </Badge>
                      </div>
                    </div>
                    <span className="font-display text-xl font-bold tabular-nums text-gold-400">
                      {skill.level}%
                    </span>
                  </div>

                  {/* Segment bar */}
                  <SegmentBar value={skill.level} className="mt-4" />

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-end border-t border-border-subtle pt-3">
                    <RowActions
                      onEdit={() => openEdit(skill)}
                      onDelete={() => setDeleteTarget(skill)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add / Edit Skill Modal — lazy-loaded chunk */}
      <SkillFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        skill={editingSkill}
        onSaved={() => {
          setModalOpen(false);
          refetch();
        }}
      />

      {/* Purge confirmation — HUD danger modal replaces native confirm() */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="PURGE SKILL MODULE"
        sysId={`DASH//SKL // ${deleteTarget?.id ?? "N/A"}`}
        message={
          <>
            Target: <span className="text-gold-400">{deleteTarget?.name ?? "—"}</span>
            <br />
            This proficiency module and its segment data will be permanently removed.
          </>
        }
        confirmLabel="PURGE"
        onConfirm={handleDelete}
        saving={deleting}
      />
    </div>
  );
}
