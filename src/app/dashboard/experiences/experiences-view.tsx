"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { ListTableHeader } from "@/components/ui/list-table-header";
import { HudLoader } from "@/components/ui/hud-loader";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import {
  ExperienceCard,
  type ExperienceCardData,
} from "@/components/features/experience-card";
import type { ExperienceFormRecord } from "@/components/features/experience-form-modal";


// The create/edit form module is lazy-loaded as its own chunk — it only
// renders when the operator opens the modal, keeping the log list's
// initial bundle small. A HUD loader overlay is shown during the chunk
// fetch.
const ExperienceFormModal = dynamic(
  () =>
    import("@/components/features/experience-form-modal").then((m) => ({
      default: m.ExperienceFormModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <HudLoader label="LOADING EXPERIENCE MODULE" size="md" />
      </div>
    ),
  }
);

// Deferred purge dialog — the confirm-dialog chunk is only fetched when
// the operator clicks a delete action, keeping it out of the initial
// log bundle (mirrors the form-modal split above).
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

export default function DashboardExperiences() {
  const { data: experiences, loading, refetch } = useData<ExperienceCardData[]>("/api/experiences");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceFormRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceCardData | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Handlers are referentially stable (useCallback) so the memoized
  // ExperienceCard rows skip re-rendering on unrelated view state changes.
  const openNew = useCallback(() => {
    setEditingExperience(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((exp: ExperienceCardData) => {
    setEditingExperience(exp);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/experiences/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      console.error("Failed to delete experience", e);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, refetch]);

  if (loading) {
    return <DashboardListSkeleton rows={4} />;
  }

  const list = experiences ?? [];

  return (
    <div className="dashboard-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Briefcase}
        label="DASHBOARD // EXPERIENCE LOG"
        title="Manage Experience Record"
        titleHighlight="Experience Record"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            NEW EXPERIENCE
          </Button>
        }
      />

      {/* Experience List — widget-level error boundary keeps a failing
          log from blanking the whole dashboard view. Rows render via the
          reusable ExperienceCard; the view maps the data + owns state. */}
      <ErrorBoundary section="experiences-list" fallback={<WidgetError label="EXPERIENCE LOG" />}>
      <motion.div className="space-y-3" {...fadeInUp}>
        <ListTableHeader
          columns={[
            { label: "#", className: "w-8", align: "center" },
            { label: "COMPANY / ROLE", className: "flex-1" },
            { label: "TYPE", className: "hidden w-24 sm:block" },
            { label: "PERIOD", className: "hidden w-40 md:block" },
            { label: "ACTIONS", className: "w-20", align: "center" },
          ]}
        />

        {list.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title="LOG EMPTY"
            message="No experience records — initialize the first log entry"
          />
        ) : (
          list.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              index={i}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </motion.div>
      </ErrorBoundary>

      {/* New / Edit Modal — lazy-loaded chunk */}
      <ExperienceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        experience={editingExperience}
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
          title="PURGE EXPERIENCE RECORD"
          sysId={`DASH//EXP // ${deleteTarget.id}`}
          message={
            <>
              Target: <span className="text-gold-400">{deleteTarget.role}</span> @{" "}
              {deleteTarget.company}
              <br />
              This experience log entry will be permanently removed.
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
