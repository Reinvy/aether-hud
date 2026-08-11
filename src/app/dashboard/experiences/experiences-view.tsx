"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  Briefcase,
  Plus,
  GraduationCap,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { IconBox } from "@/components/ui/icon-box";
import { ListTableHeader } from "@/components/ui/list-table-header";
import { RowActions } from "@/components/ui/row-actions";
import { HudLoader } from "@/components/ui/hud-loader";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import type { ExperienceFormRecord } from "@/components/features/experience-form-modal";


interface ApiExperience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  type: "work" | "education" | "freelance";
  order: number;
}

const typeColors: Record<string, string> = {
  work: "border-gold-400/40 text-gold-400",
  education: "border-stellar-400/40 text-stellar-400",
  freelance: "border-[#38EF7D]/40 text-[#38EF7D]",
};

const typeIcons: Record<string, React.ElementType> = {
  work: Briefcase,
  education: GraduationCap,
  freelance: Globe,
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

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
  const { data: experiences, loading, refetch } = useData<ApiExperience[]>("/api/experiences");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceFormRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiExperience | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openNew() {
    setEditingExperience(null);
    setModalOpen(true);
  }

  function openEdit(exp: ApiExperience) {
    setEditingExperience(exp);
    setModalOpen(true);
  }

  async function handleDelete() {
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
  }

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
          log from blanking the whole dashboard view. */}
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
          list.map((exp, i) => {
            const TypeIcon = typeIcons[exp.type] || Briefcase;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card variant="glass" hover="sweep" diamond>
                  <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4">
                    <IconBox>
                      <TypeIcon className="h-4 w-4 text-gold-400/60" />
                    </IconBox>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-medium tracking-wider text-text-main group-hover:text-gold-400 transition-colors duration-200">
                        {exp.role}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[9px] text-text-muted">
                        {exp.company}
                      </p>
                    </div>

                    <div className="hidden w-24 sm:block">
                      <Badge
                        variant="default"
                        size="sm"
                        className={typeColors[exp.type] || ""}
                      >
                        {exp.type.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="hidden w-40 items-center gap-2 md:flex">
                      <span className="font-mono text-[10px] text-text-muted">
                        {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "PRESENT"}
                      </span>
                    </div>

                    <div className="flex w-20 items-center justify-end">
                      <RowActions
                        onEdit={() => openEdit(exp)}
                        onDelete={() => setDeleteTarget(exp)}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
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
