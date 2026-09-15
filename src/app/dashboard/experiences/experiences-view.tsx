"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Briefcase, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { ApiError, apiRequest } from "@/lib/api-client";
import { fadeInUp } from "@/lib/motion-variants";
import { swapOrder } from "@/lib/reorder";
import { useData } from "@/lib/use-data";
import { useListControls } from "@/lib/use-list-controls";
import { Button } from "@/components/ui/button";
import { CodexLoader } from "@/components/ui/codex-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { IconButton } from "@/components/ui/icon-button";
import { ListTableHeader } from "@/components/ui/list-table-header";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { Pagination } from "@/components/ui/pagination";
import { WidgetError } from "@/components/ui/widget-error";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import {
  ExperienceCard,
  type ExperienceCardData,
} from "@/components/features/experience-card";
import type { ExperienceFormRecord } from "@/components/features/experience-form-modal";

// The create/edit quest form is lazy-loaded as its own chunk — it only
// renders when the operator opens the modal, keeping the log list's initial
// bundle small. A loader overlay is shown during the chunk fetch.
const ExperienceFormModal = dynamic(
  () =>
    import("@/components/features/experience-form-modal").then((m) => ({
      default: m.ExperienceFormModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment-base/80 backdrop-blur-sm dark:bg-deep-space/80">
        <CodexLoader label="Loading quest form" size="md" />
      </div>
    ),
  }
);

// Deferred removal dialog — the confirm-dialog chunk is only fetched when the
// operator clicks a delete action, keeping it out of the initial log bundle
// (mirrors the form-modal split above).
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
const EXPERIENCE_SORTERS: Record<
  string,
  (a: ExperienceCardData, b: ExperienceCardData) => number
> = {
  order: (a, b) => a.order - b.order,
  company: (a, b) => a.company.localeCompare(b.company),
};

const EXPERIENCE_SORT_OPTIONS = [
  { value: "order", label: "Display order" },
  { value: "company", label: "Company (A–Z)" },
];

export default function DashboardExperiences() {
  const { data: experiences, loading, refetch } =
    useData<ExperienceCardData[]>("/api/experiences");
  const rows = useMemo(() => experiences ?? [], [experiences]);

  const list = useListControls<ExperienceCardData>({
    items: rows,
    getId: (experience) => experience.id,
    searchFields: ["company", "role", "description"],
    sorters: EXPERIENCE_SORTERS,
    defaultSort: "order",
  });

  // Reordering walks the whole log in stored order — not just the visible
  // page — so a move at a page boundary still lands on the adjacent row. It is
  // only offered while the log is unfiltered and sorted by that same order,
  // when "up" really is the row above.
  const ordered = useMemo(() => [...rows].sort((a, b) => a.order - b.order), [rows]);
  const reorderable = list.sort === "order" && list.query.trim() === "";

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceFormRecord | null>(null);
  const [deleteIds, setDeleteIds] = useState<string[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openNew = useCallback(() => {
    setEditingExperience(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((exp: ExperienceCardData) => {
    setEditingExperience(exp);
    setModalOpen(true);
  }, []);

  const requestDelete = useCallback((exp: ExperienceCardData) => {
    setDeleteError(null);
    setDeleteIds([exp.id]);
  }, []);

  const handleMove = useCallback(
    async (id: string, direction: -1 | 1) => {
      setActionError(null);
      const updates = swapOrder(ordered, id, direction);
      if (updates.length === 0) return;

      try {
        await Promise.all(
          updates.map((row) =>
            apiRequest<unknown>("/api/experiences", {
              method: "PUT",
              body: { id: row.id, order: row.order },
            })
          )
        );
        refetch();
      } catch (e) {
        setActionError(
          e instanceof ApiError ? e.message : "Failed to reorder the quest log"
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
      ids.map((id) => apiRequest<unknown>(`/api/experiences/${id}`, { method: "DELETE" }))
    );
    let removed = 0;
    let failureMessage: string | null = null;
    for (const result of results) {
      if (result.status === "fulfilled") removed += 1;
      else if (failureMessage === null) {
        failureMessage =
          result.reason instanceof ApiError
            ? result.reason.message
            : "Failed to remove the selected quests";
      }
    }

    if (failureMessage === null) {
      setDeleteIds(null);
      refetch();
    } else {
      // Part of the selection may have been removed — refresh so the list
      // matches the server, but keep the dialog open with the server message.
      if (removed > 0) refetch();
      setDeleteError(failureMessage);
    }
    setDeleting(false);
  }, [deleteIds, refetch]);

  if (loading) {
    return <DashboardListSkeleton rows={4} />;
  }

  const targets = deleteIds
    ? rows.filter((experience) => deleteIds.includes(experience.id))
    : [];

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        icon={Briefcase}
        eyebrow="COMMISSION LOG"
        title="Manage quests"
        titleHighlight="quests"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            New quest
          </Button>
        }
      />

      {/* Quest log — widget-level error boundary keeps a failing log from
          blanking the whole dashboard view. Rows render via the reusable
          ExperienceCard; the view owns filtering, order and state. */}
      <ErrorBoundary section="experiences-list" fallback={<WidgetError label="Commission log" />}>
        <motion.div {...fadeInUp}>
          <ListToolbar
            query={list.query}
            onQueryChange={list.setQuery}
            searchPlaceholder="Search quests by company, role or description…"
            sort={list.sort}
            onSortChange={list.setSort}
            sortOptions={EXPERIENCE_SORT_OPTIONS}
            pageSize={list.pageSize}
            onPageSizeChange={list.setPageSize}
            filteredCount={list.filteredCount}
            total={list.total}
            selectionCount={0}
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
              { label: "Role / company", className: "flex-1" },
              { label: "Type", className: "hidden w-24 sm:block" },
              { label: "Period", className: "hidden w-40 md:block" },
              { label: "Actions", className: "w-20", align: "right" },
            ]}
          />

          {list.filteredCount === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-5 w-5" />}
              title={list.query ? "No matching quests" : "No quests yet"}
              message={
                list.query
                  ? `Nothing in the log matches “${list.query}”.`
                  : "The commission log is empty — add the first quest to get started."
              }
              action={
                !list.query ? (
                  <Button variant="primary" size="sm" onClick={openNew}>
                    <Plus className="h-4 w-4" />
                    New quest
                  </Button>
                ) : undefined
              }
            />
          ) : (
            list.pageItems.map((exp, i) => {
              const position = ordered.findIndex((row) => row.id === exp.id);
              return (
                <div key={exp.id} className="flex items-center gap-1.5">
                  {/* Move controls sit beside the card: the quest row itself is
                      a shared feature card, so its reorder affordance is
                      composed here by the view that owns the ordering. */}
                  {reorderable && (
                    <div className="flex shrink-0 flex-col">
                      <IconButton
                        label={`Move ${exp.role} up`}
                        onClick={() => dispatchMove(exp.id, -1)}
                        disabled={position <= 0}
                        className="p-0.5 disabled:cursor-not-allowed disabled:opacity-30 sm:p-1"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton
                        label={`Move ${exp.role} down`}
                        onClick={() => dispatchMove(exp.id, 1)}
                        disabled={position < 0 || position >= ordered.length - 1}
                        className="p-0.5 disabled:cursor-not-allowed disabled:opacity-30 sm:p-1"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </IconButton>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <ExperienceCard
                      experience={exp}
                      index={i}
                      onEdit={openEdit}
                      onDelete={requestDelete}
                    />
                  </div>
                </div>
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

      {/* New / edit quest modal — lazy-loaded chunk */}
      <ExperienceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        experience={editingExperience}
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
          title="Remove quest"
          message={
            <>
              Target: <span className="text-gold-400">{targets[0]?.role ?? "…"}</span>
              {` at ${targets[0]?.company ?? "…"}`}
              <br />
              This quest leaves the commission log permanently.
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
