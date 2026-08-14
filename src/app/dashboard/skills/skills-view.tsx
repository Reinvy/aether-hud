"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  Cpu,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { CategoryFilter } from "@/components/features/category-filter";
import { HudLoader } from "@/components/ui/hud-loader";
import { SkillCard, type SkillCardData } from "@/components/features/skills/skill-card";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import type { SkillFormRecord } from "@/components/features/skill-form-modal";

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

// Deferred purge dialog — the confirm-dialog chunk is only fetched when
// the operator clicks a delete action, keeping it out of the initial
// matrix bundle (mirrors the form-modal split above).
const ConfirmDialog = dynamic(
  () =>
    import("@/components/ui/confirm-dialog").then((m) => ({
      default: m.ConfirmDialog,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <HudLoader label="LOADING PURGE MODULE" size="md" />
      </div>
    ),
  }
);

export default function DashboardSkills() {
  const { data: skills, loading, refetch } = useData<SkillCardData[]>("/api/skills");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillFormRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SkillCardData | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Handlers are referentially stable (useCallback) so the memoized
  // SkillCard rows skip re-rendering when the view re-renders for
  // unrelated state (modal open/close, category filter).
  const openNew = useCallback(() => {
    setEditingSkill(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((skill: SkillCardData) => {
    setEditingSkill(skill);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
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
  }, [deleteTarget, refetch]);

  const skillList = skills ?? [];
  const categories = [...new Set(skillList.map((s) => s.category))];
  const filtered = activeCategory
    ? skillList.filter((s) => s.category === activeCategory)
    : skillList;

  if (loading) {
    return <DashboardListSkeleton rows={6} />;
  }

  return (
    <div className="dashboard-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
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

      {/* Category Filters + Skills Grid — widget-level error boundary */}
      <ErrorBoundary section="skills-grid" fallback={<WidgetError label="SKILL MATRIX" />}>
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

      {/* Skills Grid — each module is a reusable SkillCard */}
      <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" {...fadeInUp}>
        {filtered.map((skill, i) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            index={i}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        ))}
      </motion.div>
      </ErrorBoundary>

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

      {/* Purge confirmation — deferred chunk, mounted only on delete */}
      {deleteTarget && (
        <ConfirmDialog
          open
          onClose={() => setDeleteTarget(null)}
          title="PURGE SKILL MODULE"
          sysId={`DASH//SKL // ${deleteTarget.id}`}
          message={
            <>
              Target: <span className="text-gold-400">{deleteTarget.name}</span>
              <br />
              This proficiency module and its segment data will be permanently removed.
            </>
          }
          confirmLabel="PURGE"
          onConfirm={handleDelete}
          saving={deleting}
        />
      )}
    </div>
  );
}
