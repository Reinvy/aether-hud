"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  Boxes,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { ArchiveSearch } from "@/components/features/archive-search";
import { ListTableHeader } from "@/components/ui/list-table-header";
import { HudLoader } from "@/components/ui/hud-loader";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import {
  ProjectArchiveRow,
} from "@/components/features/projects/project-archive-row";
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

// The purge confirmation dialog is only needed once the operator clicks a
// delete action, so it is deferred: unlike the always-mounted form modal,
// this chunk is fetched on the first PURGE click and unmounted on close —
// the delete flow never ships in the view's initial bundle.
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

export default function DashboardProjects() {
  const { data: projects, loading, refetch } = useData<ProjectFormRecord[]>("/api/projects");
  // Raw query drives immediate UI copy (empty-state message); the deferred
  // query (fed by ArchiveSearch's useDeferredValue) drives the actual
  // filtering so typing stays responsive as the archive grows.
  const [search, setSearch] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFormRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectFormRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openNew = useCallback(() => {
    setEditingProject(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((project: ProjectFormRecord) => {
    setEditingProject(project);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/projects/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      console.error("Failed to delete project", e);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, refetch]);

  const filtered = projects
    ? projects.filter((p) =>
        p.title.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : [];

  if (loading) {
    return <DashboardListSkeleton rows={5} />;
  }

  return (
    <div className="dashboard-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
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

      {/* Search + Archive — widget-level error boundary keeps a failing
          list from blanking the whole dashboard view (shell boundary is
          the last line of defense). */}
      <ErrorBoundary section="projects-list" fallback={<WidgetError label="PROJECT ARCHIVE" />}>
        {/* Search — reusable deferred archive search (raw query for the
            empty-state copy, deferred query for filtering, live counter) */}
        <motion.div className="mb-6 max-w-xl" {...fadeInUp}>
          <ArchiveSearch
            placeholder="Search project archives..."
            ariaLabel="Search project archives"
            onQueryChange={setFilterQuery}
            onRawQueryChange={setSearch}
            resultCount={filtered.length}
          />
        </motion.div>

      {/* Projects Table/Card List */}
      <motion.div className="space-y-3" {...fadeInUp}>
        <ListTableHeader
          columns={[
            { label: "#", className: "w-8", align: "center" },
            { label: "PROJECT NAME", className: "flex-1" },
            { label: "CATEGORY", className: "hidden w-24 sm:block" },
            { label: "STATUS", className: "hidden w-20 md:block" },
            { label: "ACTIONS", className: "w-20", align: "center" },
          ]}
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Boxes className="h-5 w-5" />}
            title={search ? "NO MATCH" : "ARCHIVE EMPTY"}
            message={
              search
                ? `No projects match "${search}"`
                : "No projects deployed — initialize the first dossier"
            }
            action={
              !search ? (
                <Button variant="primary" size="sm" onClick={openNew}>
                  <Plus className="h-4 w-4" />
                  NEW DOSSIER
                </Button>
              ) : undefined
            }
          />
        ) : (
          filtered.map((project, i) => (
            <ProjectArchiveRow
              key={project.id}
              project={project}
              index={i}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </motion.div>
      </ErrorBoundary>

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

      {/* Purge confirmation — deferred chunk, mounted only on delete */}
      {deleteTarget && (
        <ConfirmDialog
          open
          onClose={() => setDeleteTarget(null)}
          title="PURGE DOSSIER"
          sysId={`DASH//PRJ // ${deleteTarget.id}`}
          message={
            <>
              Target: <span className="text-gold-400">{deleteTarget.title}</span>
              <br />
              This project dossier will be permanently removed from the archive.
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
