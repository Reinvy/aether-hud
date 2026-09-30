"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { Button } from "@/components/ui/button";
import { ActionError } from "@/components/ui/action-error";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { CodexLoader } from "@/components/ui/codex-loader";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { Pagination } from "@/components/ui/pagination";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { useData } from "@/lib/use-data";
import { useListControls } from "@/lib/use-list-controls";
import { ApiError, apiRequest } from "@/lib/api-client";
import { planReorder } from "@/lib/reorder";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { SectionRow } from "@/components/features/section-row";
import type { SectionDto } from "@/lib/dto";

// The create/edit form is deferred — it is only fetched when the operator
// opens it, never shipped in the page-control bundle. A codex loader
// overlay is shown during the chunk fetch.
const SectionFormModal = dynamic(
  () =>
    import("@/components/features/section-form-modal").then((m) => ({
      default: m.SectionFormModal,
    })),
  {
    loading: () => (
      <div className="codex-scrim fixed inset-0 z-50 flex items-center justify-center">
        <CodexLoader label="Loading page form" size="md" />
      </div>
    ),
  }
);

// Deferred confirm dialog — the chunk is only fetched when the operator
// clicks a delete action (mirrors the form-modal split above).
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

const SORT_OPTIONS = [
  { value: "order", label: "Display order" },
  { value: "title", label: "Title" },
];

interface DeleteRequest {
  ids: string[];
  label: string;
}

/**
 * DashboardSections — the landing page registry.
 *
 * Each table row renders through the reusable <SectionRow />; this view owns
 * data fetching, the list controls (search, sort, pagination, selection), the
 * bulk actions and the create/edit/delete modals.
 */
export default function DashboardSections() {
  const { data: sections, loading, error: loadError, refetch } = useData<SectionDto[]>("/api/sections");
  const list = useMemo(() => sections ?? [], [sections]);

  const controls = useListControls<SectionDto>({
    items: list,
    getId: (s) => s.id,
    searchFields: ["title", "key"],
    sorters: {
      order: (a, b) => a.order - b.order,
      title: (a, b) => a.title.localeCompare(b.title),
    },
    defaultSort: "order",
  });

  const {
    query,
    setQuery,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
    pageItems,
    total,
    filteredCount,
    selected,
    toggleSelected,
    clearSelection,
  } = controls;

  const [formOpen, setFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionDto | null>(null);
  const [deleteRequest, setDeleteRequest] = useState<DeleteRequest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // useListControls hands back fresh callbacks each render; route the
  // selection handler through a ref so the memoized rows keep their
  // identity and only re-render when their own row state changes.
  const selectRef = useRef(toggleSelected);
  selectRef.current = toggleSelected;
  const handleSelect = useCallback((id: string) => selectRef.current(id), []);

  // Display order boundaries — the reorder controls disable at either end.
  const orderedIds = useMemo(
    () => [...list].sort((a, b) => a.order - b.order).map((s) => s.id),
    [list]
  );
  const firstId = orderedIds[0] ?? null;
  const lastId = orderedIds[orderedIds.length - 1] ?? null;

  const openEdit = useCallback((section: SectionDto) => {
    setEditingSection(section);
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingSection(null);
  }, []);

  const handleToggle = useCallback(
    async (section: SectionDto) => {
      setActionError(null);
      try {
        await apiRequest("/api/sections", {
          method: "PUT",
          body: { id: section.id, enabled: !section.enabled },
        });
        await refetch();
      } catch (e) {
        setActionError(e instanceof ApiError ? e.message : "Failed to update the page");
      }
    },
    [refetch]
  );

  // `planReorder` returns only the rows whose stored order changes (or null
  // at either end); the updates are written together, then the list is
  // refetched once. `movingId` disables the row's controls while in flight.
  const handleMove = useCallback(
    async (section: SectionDto, direction: -1 | 1) => {
      setActionError(null);
      const updates = planReorder(list, section.id, direction === -1 ? "up" : "down");
      if (!updates) return;
      setMovingId(section.id);
      try {
        await Promise.all(
          updates.map((update) =>
            apiRequest<unknown>("/api/sections", {
              method: "PUT",
              body: { id: update.id, order: update.order },
            })
          )
        );
        await refetch();
      } catch (e) {
        setActionError(e instanceof ApiError ? e.message : "Failed to reorder the page");
        await refetch();
      } finally {
        setMovingId(null);
      }
    },
    [list, refetch]
  );

  // Bulk visibility: every selected page is written, then the registry is
  // refetched once.
  const applyEnabled = useCallback(
    async (enabled: boolean) => {
      const ids = [...selected];
      if (ids.length === 0) return;
      setActionError(null);
      try {
        await Promise.all(
          ids.map((id) =>
            apiRequest("/api/sections", { method: "PUT", body: { id, enabled } })
          )
        );
        clearSelection();
        await refetch();
      } catch (e) {
        setActionError(
          e instanceof ApiError
            ? e.message
            : `Failed to ${enabled ? "enable" : "disable"} the selected pages`
        );
      }
    },
    [selected, clearSelection, refetch]
  );

  const requestDelete = useCallback((section: SectionDto) => {
    setDeleteRequest({ ids: [section.id], label: section.title });
  }, []);

  const requestBulkDelete = useCallback(() => {
    setDeleteRequest({
      ids: [...selected],
      label: `${selected.size} selected pages`,
    });
  }, [selected]);

  // One delete implementation — allSettled so a partial failure still counts
  // and still closes the dialog / refetches.
  const handleDelete = useCallback(async () => {
    if (!deleteRequest) return;
    const ids = deleteRequest.ids;
    setDeleting(true);
    setActionError(null);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => apiRequest(`/api/sections/${id}`, { method: "DELETE" }))
      );
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        const firstApiError = failed.find((r) => r.reason instanceof ApiError)?.reason;
        setActionError(
          firstApiError instanceof ApiError
            ? firstApiError.message
            : `${failed.length} of ${ids.length} routes could not be removed`
        );
      }
    } finally {
      setDeleteRequest(null);
      clearSelection();
      await refetch();
      setDeleting(false);
    }
  }, [deleteRequest, clearSelection, refetch]);

  if (loading && sections === null) {
    return <DashboardListSkeleton rows={5} />;
  }

  const emptyRegistry = total === 0;

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        icon="deckList"
        eyebrow="PAGE CONTROL"
        title="Manage codex pages"
        titleHighlight="codex pages"
      />

      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search pages by title or key…"
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        filteredCount={filteredCount}
        total={total}
        selectionCount={selected.size}
        bulkActions={
          <>
            <Button variant="secondary" size="sm" onClick={() => applyEnabled(true)}>
              Enable
            </Button>
            <Button variant="secondary" size="sm" onClick={() => applyEnabled(false)}>
              Disable
            </Button>
            <Button variant="danger" size="sm" onClick={requestBulkDelete}>
              <AssetIcon icon="pinDelete" tone="ink" size="sm" />
              Delete selected
            </Button>
          </>
        }
      />

      {actionError && <ActionError message={actionError} className="mb-4" />}

      {/* Info banner + sections table — widget-level error boundary */}
      <ErrorBoundary section="sections-table" fallback={<WidgetError label="Section control" />}>
        <motion.div className="mb-6" {...fadeInUp}>
          <div className="codex-card codex-radius-card p-4">
            <p className="text-sm leading-relaxed text-leather-muted">
              Control which pages appear on your landing screen. Hidden pages stay in the
              registry but are not rendered for visitors. Order determines the display
              sequence.
            </p>
          </div>
        </motion.div>

        {loadError !== null ? (
          <WidgetError label="Section control" message={loadError} onRetry={refetch} />
        ) : pageItems.length === 0 ? (
          <motion.div {...fadeInUp}>
            <EmptyState
              icon="deckList"
              title={emptyRegistry ? "No pages yet" : "No matches"}
              message={
                emptyRegistry
                  ? "No pages are registered yet."
                  : "No pages match this search."
              }
            />
          </motion.div>
        ) : (
          <motion.div {...fadeInUp}>
            <Card variant="glass" hover="none">
              <div className="overflow-x-auto">
                <table className="w-full" aria-label="Codex sections">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="px-4 py-3 text-left">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="codex-label text-[9px]">Order</span>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <span className="codex-label text-[9px]">Page</span>
                      </th>
                      <th className="hidden px-4 py-3 text-left md:table-cell">
                        <span className="codex-label text-[9px]">Key</span>
                      </th>
                      <th className="hidden px-4 py-3 text-left sm:table-cell">
                        <span className="codex-label text-[9px]">Subtitle</span>
                      </th>
                      <th className="px-4 py-3 text-center">
                        <span className="codex-label text-[9px]">Visibility</span>
                      </th>
                      <th className="px-4 py-3 text-right">
                        <span className="codex-label text-[9px]">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((section, i) => (
                      <SectionRow
                        key={section.id}
                        section={section}
                        index={i}
                        selectable
                        selected={selected.has(section.id)}
                        onSelect={handleSelect}
                        onMove={handleMove}
                        canMoveUp={section.id !== firstId}
                        canMoveDown={section.id !== lastId}
                        moving={movingId === section.id}
                        onToggle={handleToggle}
                        onEdit={openEdit}
                        onDelete={requestDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </ErrorBoundary>

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />

      {formOpen && (
        <SectionFormModal
          open
          onClose={closeForm}
          section={editingSection}
          onSaved={() => {
            closeForm();
            refetch();
          }}
        />
      )}

      {deleteRequest && (
        <ConfirmDialog
          open
          onClose={() => setDeleteRequest(null)}
          title="Remove page"
          message={
            <>
              Remove <span className="text-gold-ink">{deleteRequest.label}</span> from the
              landing registry?
            </>
          }
          onConfirm={handleDelete}
          saving={deleting}
        />
      )}
    </div>
  );
}
