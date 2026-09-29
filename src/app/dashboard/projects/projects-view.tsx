"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Boxes, Plus, Trash2 } from "lucide-react";
import { ApiError, apiRequest } from "@/lib/api-client";
import { fadeInUp } from "@/lib/motion-variants";
import { planReorder } from "@/lib/reorder";
import { useData } from "@/lib/use-data";
import { useListControls } from "@/lib/use-list-controls";
import { ActionError } from "@/components/ui/action-error";
import { Button } from "@/components/ui/button";
import { CodexLoader } from "@/components/ui/codex-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { Pagination } from "@/components/ui/pagination";
import { WidgetError } from "@/components/ui/widget-error";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { ProjectArchiveRow } from "@/components/features/projects/project-archive-row";
import type { ProjectFormRecord } from "@/components/features/project-form-modal";

// The create/edit domain form is heavy (9 fields + modal chrome). It only
// renders when the operator opens the modal, so it is lazy-loaded as its
// own chunk — the archive list's initial bundle stays small. A loader
// overlay is shown during the (usually cached) chunk fetch.
const ProjectFormModal = dynamic(
  () =>
    import("@/components/features/project-form-modal").then((m) => ({
      default: m.ProjectFormModal,
    })),
  {
    loading: () => (
      <div className="codex-scrim fixed inset-0 z-50 flex items-center justify-center">
        <CodexLoader label="Loading domain form" size="md" />
      </div>
    ),
  }
);

// The removal confirmation dialog is only needed once the operator clicks a
// delete action, so it is deferred: the chunk is fetched on the first click
// and unmounted on close — the delete flow never ships in the view's initial
// bundle.
const ConfirmDialog = dynamic(
  () =>
    import("@/components/ui/confirm-dialog").then((m) => ({
      default: m.ConfirmDialog,
    })),
  {
    loading: () => (
      <div className="codex-scrim fixed inset-0 z-50 flex items-center justify-center">
        <CodexLoader label="Loading confirmation" size="md" />
      </div>
    ),
  }
);

/** Named comparators driving the toolbar's sort select. */
const PROJECT_SORTERS: Record<
  string,
  (a: ProjectFormRecord, b: ProjectFormRecord) => number
> = {
  order: (a, b) => a.order - b.order,
  title: (a, b) => a.title.localeCompare(b.title),
  year: (a, b) => Number(b.year) - Number(a.year),
};

const PROJECT_SORT_OPTIONS = [
  { value: "order", label: "Display order" },
  { value: "title", label: "Title (A–Z)" },
  { value: "year", label: "Year (newest first)" },
];

export default function DashboardProjects() {
  const {
    data: projects,
    loading,
    error,
    refetch,
  } = useData<ProjectFormRecord[]>("/api/projects");
  const rows = useMemo(() => projects ?? [], [projects]);

  const list = useListControls<ProjectFormRecord>({
    items: rows,
    getId: (project) => project.id,
    searchFields: ["title", "category", "description"],
    sorters: PROJECT_SORTERS,
    defaultSort: "order",
  });

  // Reordering walks the whole archive in stored order — not just the visible
  // page — so a move at a page boundary still lands on the adjacent row. It is
  // only offered while the archive is unfiltered and sorted by that same
  // order, when "up" really is the row above.
  const ordered = useMemo(() => [...rows].sort((a, b) => a.order - b.order), [rows]);
  const reorderable = list.sort === "order" && list.query.trim() === "";

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFormRecord | null>(null);
  const [deleteIds, setDeleteIds] = useState<string[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const openNew = useCallback(() => {
    setEditingProject(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((project: ProjectFormRecord) => {
    setEditingProject(project);
    setModalOpen(true);
  }, []);

  const requestDelete = useCallback((project: ProjectFormRecord) => {
    setDeleteIds([project.id]);
  }, []);

  const requestBulkDelete = useCallback(() => {
    setDeleteIds([...list.selected]);
  }, [list.selected]);

  // The archive rows are memoized, so the callbacks they receive must keep
  // their identity across the re-renders every keystroke in the toolbar
  // causes. These dispatchers read the latest handler through a ref.
  const selectRef = useRef(list.toggleSelected);
  selectRef.current = list.toggleSelected;
  const handleSelect = useCallback((id: string) => selectRef.current(id), []);

  const handleMove = useCallback(
    async (id: string, direction: "up" | "down") => {
      setActionError(null);
      const updates = planReorder(ordered, id, direction);
      if (!updates) return;

      setMovingId(id);
      try {
        await Promise.all(
          updates.map((row) =>
            apiRequest<unknown>("/api/projects", {
              method: "PUT",
              // Reorder only sends the new order — the server leaves every
              // unspecified field (including `tags`) untouched.
              body: { id: row.id, order: row.order },
            })
          )
        );
        await refetch();
      } catch (e) {
        setActionError(
          e instanceof ApiError ? e.message : "Failed to reorder the archive"
        );
        await refetch();
      } finally {
        setMovingId(null);
      }
    },
    [ordered, refetch]
  );

  const moveRef = useRef(handleMove);
  moveRef.current = handleMove;
  const dispatchMove = useCallback((id: string, direction: -1 | 1) => {
    void moveRef.current(id, direction === -1 ? "up" : "down");
  }, []);

  const runDelete = useCallback(async () => {
    if (!deleteIds) return;
    const ids = deleteIds;
    setDeleting(true);

    const results = await Promise.allSettled(
      ids.map((id) => apiRequest<unknown>(`/api/projects/${id}`, { method: "DELETE" }))
    );
    const failure = results.find(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    );
    if (failure) {
      setActionError(
        failure.reason instanceof ApiError
          ? failure.reason.message
          : `${results.filter((r) => r.status === "rejected").length} of ${ids.length} domains could not be removed`
      );
    }

    list.clearSelection();
    setDeleteIds(null);
    setDeleting(false);
    await refetch();
  }, [deleteIds, list, refetch]);

  if (loading && projects === null) {
    return <DashboardListSkeleton rows={5} />;
  }

  const targets = deleteIds ? rows.filter((project) => deleteIds.includes(project.id)) : [];

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        icon={Boxes}
        eyebrow="DOMAIN ARCHIVE // ARTIFACTS"
        title="Manage domains"
        titleHighlight="domains"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            New domain
          </Button>
        }
      />

      {/* Search + archive — widget-level error boundary keeps a failing list
          from blanking the whole dashboard view. */}
      <ErrorBoundary section="projects-list" fallback={<WidgetError label="Domain archive" />}>
        <motion.div {...fadeInUp}>
          <ListToolbar
            query={list.query}
            onQueryChange={list.setQuery}
            searchPlaceholder="Search domains by title, category or description…"
            sort={list.sort}
            onSortChange={list.setSort}
            sortOptions={PROJECT_SORT_OPTIONS}
            pageSize={list.pageSize}
            onPageSizeChange={list.setPageSize}
            filteredCount={list.filteredCount}
            total={list.total}
            selectionCount={list.selected.size}
            bulkActions={
              <Button variant="danger" size="sm" onClick={requestBulkDelete}>
                <Trash2 className="h-3.5 w-3.5" />
                Delete selected
              </Button>
            }
          />
        </motion.div>

        {actionError && <ActionError message={actionError} className="mb-4" />}

        {error !== null ? (
          <WidgetError label="Domain archive" message={error} onRetry={refetch} />
        ) : (
          <motion.div className="space-y-3" aria-label="Domain registry" {...fadeInUp}>
            <div
              aria-hidden="true"
              className="flex items-center gap-4 border-b border-border-subtle px-4 py-2"
            >
              <span className="codex-label flex-1">Domain</span>
              <span className="codex-label hidden w-24 sm:block">Category</span>
              <span className="codex-label hidden w-20 md:block">Status</span>
              <span className="codex-label w-28 text-right">Actions</span>
            </div>

          {list.filteredCount === 0 ? (
            <EmptyState
              icon={<Boxes className="h-5 w-5" />}
              title={list.query ? "No domains matches this search" : "No domains yet"}
              message={
                list.query
                  ? `Nothing in the archive matches “${list.query}”.`
                  : "The archive is empty — add the first domain to get started."
              }
              action={
                !list.query ? (
                  <Button variant="primary" size="sm" onClick={openNew}>
                    <Plus className="h-4 w-4" />
                    New domain
                  </Button>
                ) : undefined
              }
            />
          ) : (
            list.pageItems.map((project, i) => {
              const position = ordered.findIndex((row) => row.id === project.id);
              return (
                <ProjectArchiveRow
                  key={project.id}
                  project={project}
                  index={i}
                  selectable
                  selected={list.selected.has(project.id)}
                  onSelect={handleSelect}
                  onMove={reorderable ? dispatchMove : undefined}
                  canMoveUp={reorderable && position > 0}
                  canMoveDown={reorderable && position >= 0 && position < ordered.length - 1}
                  onEdit={openEdit}
                  onDelete={requestDelete}
                  moving={movingId === project.id}
                />
              );
            })
          )}
          </motion.div>
        )}

        <Pagination
          page={list.page}
          pageCount={list.pageCount}
          onPageChange={list.setPage}
        />
      </ErrorBoundary>

      {/* Edit / New modal — lazy-loaded chunk */}
      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        project={editingProject}
        onSaved={() => {
          setModalOpen(false);
          refetch();
        }}
      />

      {/* Removal confirmation — deferred chunk, mounted only on delete */}
      {deleteIds && (
        <ConfirmDialog
          open
          onClose={() => setDeleteIds(null)}
          title={deleteIds.length > 1 ? "Remove domains" : "Remove domain"}
          message={
            <>
              {deleteIds.length === 1 ? (
                <>
                  Target: <span className="text-gold-ink">{targets[0]?.title ?? "…"}</span>
                  <br />
                </>
              ) : (
                <>
                  {deleteIds.length} selected domains will be removed.
                </>
              )}
            </>
          }
          confirmLabel="Remove"
          onConfirm={runDelete}
          saving={deleting}
        />
      )}
    </div>
  );
}
