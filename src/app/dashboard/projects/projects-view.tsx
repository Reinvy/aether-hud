"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Boxes, Plus, Trash2 } from "lucide-react";
import { ApiError, apiRequest } from "@/lib/api-client";
import { fadeInUp } from "@/lib/motion-variants";
import { swapOrder } from "@/lib/reorder";
import { useData } from "@/lib/use-data";
import { useListControls } from "@/lib/use-list-controls";
import { Button } from "@/components/ui/button";
import { CodexLoader } from "@/components/ui/codex-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ListTableHeader } from "@/components/ui/list-table-header";
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment-base/80 backdrop-blur-sm dark:bg-deep-space/80">
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment-base/80 backdrop-blur-sm dark:bg-deep-space/80">
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
  const { data: projects, loading, refetch } = useData<ProjectFormRecord[]>("/api/projects");
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
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openNew = useCallback(() => {
    setEditingProject(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((project: ProjectFormRecord) => {
    setEditingProject(project);
    setModalOpen(true);
  }, []);

  const requestDelete = useCallback((project: ProjectFormRecord) => {
    setDeleteError(null);
    setDeleteIds([project.id]);
  }, []);

  const requestBulkDelete = useCallback(() => {
    setDeleteError(null);
    setDeleteIds([...list.selected]);
  }, [list.selected]);

  // The archive rows are memoized, so the callbacks they receive must keep
  // their identity across the re-renders every keystroke in the toolbar
  // causes. These dispatchers read the latest handler through a ref.
  const selectRef = useRef(list.toggleSelected);
  selectRef.current = list.toggleSelected;
  const handleSelect = useCallback((id: string) => selectRef.current(id), []);

  const handleMove = useCallback(
    async (id: string, direction: -1 | 1) => {
      setActionError(null);
      const updates = swapOrder(ordered, id, direction);
      if (updates.length === 0) return;

      const tagsById = new Map(ordered.map((project) => [project.id, project.tags]));
      try {
        await Promise.all(
          updates.map((row) =>
            apiRequest<unknown>("/api/projects", {
              method: "PUT",
              // The projects PUT always rewrites `tags`, so each row's tag list
              // travels with the order swap instead of being blanked.
              body: { id: row.id, order: row.order, tags: tagsById.get(row.id) ?? [] },
            })
          )
        );
        refetch();
      } catch (e) {
        setActionError(
          e instanceof ApiError ? e.message : "Failed to reorder the archive"
        );
      }
    },
    [ordered, refetch]
  );

  const moveRef = useRef(handleMove);
  moveRef.current = handleMove;
  const dispatchMove = useCallback((id: string, direction: -1 | 1) => {
    void moveRef.current(id, direction);
  }, []);

  const runDelete = useCallback(async () => {
    if (!deleteIds) return;
    const ids = deleteIds;
    setDeleting(true);
    setDeleteError(null);

    const results = await Promise.allSettled(
      ids.map((id) => apiRequest<unknown>(`/api/projects/${id}`, { method: "DELETE" }))
    );
    let removed = 0;
    let failureMessage: string | null = null;
    for (const result of results) {
      if (result.status === "fulfilled") removed += 1;
      else if (failureMessage === null) {
        failureMessage =
          result.reason instanceof ApiError
            ? result.reason.message
            : "Failed to remove the selected domains";
      }
    }

    if (failureMessage === null) {
      if (ids.length > 1) list.clearSelection();
      else if (list.selected.has(ids[0])) list.toggleSelected(ids[0]);
      setDeleteIds(null);
      refetch();
    } else {
      // Part of the selection may have been removed — refresh so the list
      // matches the server, but keep the dialog open with the server message.
      if (removed > 0) refetch();
      setDeleteError(failureMessage);
    }
    setDeleting(false);
  }, [deleteIds, refetch, list.clearSelection, list.selected, list.toggleSelected]);

  if (loading) {
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

        {actionError && (
          <p
            role="alert"
            className="mb-4 codex-radius-sm border border-hud-danger/30 bg-hud-danger/5 px-4 py-2.5 text-xs text-hud-danger"
          >
            {actionError}
          </p>
        )}

        <motion.div className="space-y-3" {...fadeInUp}>
          <ListTableHeader
            columns={[
              { label: "Domain", className: "flex-1" },
              { label: "Category", className: "hidden w-24 sm:block" },
              { label: "Status", className: "hidden w-20 md:block" },
              { label: "Actions", className: "w-28", align: "right" },
            ]}
          />

          {list.filteredCount === 0 ? (
            <EmptyState
              icon={<Boxes className="h-5 w-5" />}
              title={list.query ? "No matching domains" : "No domains yet"}
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
                />
              );
            })
          )}
        </motion.div>

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
                  Target: <span className="text-gold-400">{targets[0]?.title ?? "…"}</span>
                  <br />
                </>
              ) : (
                <>
                  {deleteIds.length} selected domains will be removed.
                  <br />
                </>
              )}
              {deleteIds.length === 1
                ? "This domain leaves the archive permanently."
                : "They leave the archive permanently."}
              {deleteError && (
                <p role="alert" className="mt-2 text-hud-danger">
                  {deleteError}
                </p>
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
