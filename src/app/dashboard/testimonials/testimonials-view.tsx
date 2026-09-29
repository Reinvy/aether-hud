"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { MessageCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { CodexLoader } from "@/components/ui/codex-loader";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { Pagination } from "@/components/ui/pagination";
import { useData } from "@/lib/use-data";
import { useListControls } from "@/lib/use-list-controls";
import { ApiError, apiRequest } from "@/lib/api-client";
import { swapOrder } from "@/lib/reorder";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { TestimonialCard } from "@/components/features/testimonials/testimonial-card";
import type { TestimonialDto } from "@/lib/dto";

// The create/edit form module is lazy-loaded as its own chunk — it only
// renders when the operator opens the modal, keeping the archive grid's
// initial bundle small. A codex loader overlay is shown during the chunk
// fetch.
const TestimonialFormModal = dynamic(
  () =>
    import("@/components/features/testimonial-form-modal").then((m) => ({
      default: m.TestimonialFormModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <CodexLoader label="Loading testimonial form" size="md" />
      </div>
    ),
  }
);

// Deferred confirm dialog — the chunk is only fetched when the operator
// clicks a delete action, keeping it out of the initial archive bundle
// (mirrors the form-modal split above).
const ConfirmDialog = dynamic(
  () =>
    import("@/components/ui/confirm-dialog").then((m) => ({
      default: m.ConfirmDialog,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <CodexLoader label="Loading confirmation" size="md" />
      </div>
    ),
  }
);

const SORT_OPTIONS = [
  { value: "order", label: "Display order" },
  { value: "name", label: "Name" },
];

interface DeleteRequest {
  ids: string[];
  label: string;
}

export default function DashboardTestimonials() {
  const { data: testimonials, loading, refetch } = useData<TestimonialDto[]>("/api/testimonials");
  const list = useMemo(() => testimonials ?? [], [testimonials]);

  const controls = useListControls<TestimonialDto>({
    items: list,
    getId: (t) => t.id,
    searchFields: ["name", "role", "content"],
    sorters: {
      order: (a, b) => a.order - b.order,
      name: (a, b) => a.name.localeCompare(b.name),
    },
    defaultSort: "order",
    defaultPageSize: 12,
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
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialDto | null>(null);
  const [deleteRequest, setDeleteRequest] = useState<DeleteRequest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // useListControls hands back fresh callbacks each render; route the
  // selection handler through a ref so the memoized cards keep their
  // identity and only re-render when their own row state changes.
  const selectRef = useRef(toggleSelected);
  selectRef.current = toggleSelected;
  const handleSelect = useCallback((id: string) => selectRef.current(id), []);

  // Display order boundaries — the reorder controls disable at either end.
  const orderedIds = useMemo(
    () => [...list].sort((a, b) => a.order - b.order).map((t) => t.id),
    [list]
  );
  const firstId = orderedIds[0] ?? null;
  const lastId = orderedIds[orderedIds.length - 1] ?? null;

  // A new entry appends after the last position rather than colliding with
  // the existing order values at zero.
  const nextOrder = useMemo(
    () => list.reduce((max, t) => Math.max(max, t.order), -1) + 1,
    [list]
  );

  const openNew = useCallback(() => {
    setEditingTestimonial(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((t: TestimonialDto) => {
    setEditingTestimonial(t);
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingTestimonial(null);
  }, []);

  // `swapOrder` returns both rows of the exchange (or nothing at an end);
  // the two updates are written together, then the list is refetched once.
  const handleMove = useCallback(
    async (t: TestimonialDto, direction: -1 | 1) => {
      const updates = swapOrder(list, t.id, direction);
      if (updates.length === 0) return;
      setError(null);
      try {
        await Promise.all(
          updates.map((update) =>
            apiRequest("/api/testimonials", { method: "PUT", body: update })
          )
        );
        refetch();
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Failed to reorder testimonial");
      }
    },
    [list, refetch]
  );

  const requestDelete = useCallback((t: TestimonialDto) => {
    setDeleteError(null);
    setDeleteRequest({ ids: [t.id], label: t.name });
  }, []);

  const requestBulkDelete = useCallback(() => {
    setDeleteError(null);
    setDeleteRequest({
      ids: [...selected],
      label: `${selected.size} selected testimonials`,
    });
  }, [selected]);

  const handleDelete = useCallback(async () => {
    if (!deleteRequest) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await Promise.all(
        deleteRequest.ids.map((id) =>
          apiRequest(`/api/testimonials/${id}`, { method: "DELETE" })
        )
      );
      setDeleteRequest(null);
      clearSelection();
      refetch();
    } catch (e) {
      setDeleteError(e instanceof ApiError ? e.message : "Failed to delete testimonial");
    } finally {
      setDeleting(false);
    }
  }, [deleteRequest, clearSelection, refetch]);

  if (loading) {
    return <DashboardListSkeleton rows={4} />;
  }

  const emptyArchive = total === 0;

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        icon={MessageCircle}
        eyebrow="COMPANION LETTERS"
        title="Manage allies"
        titleHighlight="allies"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            New testimonial
          </Button>
        }
      />

      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search allies by name, role or quote…"
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[12, 24, 48]}
        filteredCount={filteredCount}
        total={total}
        selectionCount={selected.size}
        bulkActions={
          <Button variant="danger" size="sm" onClick={requestBulkDelete}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete selected
          </Button>
        }
      />

      {error && (
        <p
          role="alert"
          className="mb-4 codex-radius-sm border border-hud-danger/30 bg-hud-danger/10 px-4 py-2.5 text-sm text-hud-danger"
        >
          {error}
        </p>
      )}

      {/* Testimonials grid — widget-level error boundary keeps a failing
          archive from blanking the whole dashboard view. */}
      <ErrorBoundary section="testimonials-grid" fallback={<WidgetError label="TESTIMONIAL ARCHIVE" />}>
        <motion.div className="grid gap-4 sm:grid-cols-2" {...fadeInUp}>
          {pageItems.length === 0 ? (
            <EmptyState
              icon={<MessageCircle className="h-5 w-5" />}
              title={emptyArchive ? "No testimonials yet" : "No matches"}
              message={
                emptyArchive
                  ? "Add a testimonial to show it on the landing page."
                  : "No testimonials match this search."
              }
              className="sm:col-span-2"
              action={
                emptyArchive ? (
                  <Button variant="primary" size="sm" onClick={openNew}>
                    <Plus className="h-4 w-4" />
                    New testimonial
                  </Button>
                ) : undefined
              }
            />
          ) : (
            pageItems.map((t, i) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                index={i}
                selectable
                selected={selected.has(t.id)}
                onSelect={handleSelect}
                onMove={handleMove}
                canMoveUp={t.id !== firstId}
                canMoveDown={t.id !== lastId}
                onEdit={openEdit}
                onDelete={requestDelete}
              />
            ))
          )}
        </motion.div>
      </ErrorBoundary>

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />

      {formOpen && (
        <TestimonialFormModal
          open
          onClose={closeForm}
          testimonial={editingTestimonial}
          nextOrder={nextOrder}
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
          title="Remove testimonial"
          message={
            <>
              Remove <span className="text-gold-400">{deleteRequest.label}</span> from the
              archive? This cannot be undone.
              {deleteError && (
                <span role="alert" className="mt-2 block text-hud-danger">
                  {deleteError}
                </span>
              )}
            </>
          }
          onConfirm={handleDelete}
          saving={deleting}
        />
      )}
    </div>
  );
}
