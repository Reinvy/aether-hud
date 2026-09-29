"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Cpu, Plus, Trash2 } from "lucide-react";
import { ApiError, apiRequest } from "@/lib/api-client";
import { fadeInUp } from "@/lib/motion-variants";
import { swapOrder } from "@/lib/reorder";
import { useData } from "@/lib/use-data";
import { useListControls } from "@/lib/use-list-controls";
import { Button } from "@/components/ui/button";
import { CodexLoader } from "@/components/ui/codex-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FormModal } from "@/components/ui/form-modal";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { WidgetError } from "@/components/ui/widget-error";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { SkillCard, type SkillCardData } from "@/components/features/skills/skill-card";
import type { SkillFormRecord } from "@/components/features/skill-form-modal";

// The create/edit talent form is lazy-loaded as its own chunk — it only
// renders when the operator opens the modal, keeping the matrix list's
// initial bundle small. A loader overlay is shown during the chunk fetch.
const SkillFormModal = dynamic(
  () =>
    import("@/components/features/skill-form-modal").then((m) => ({
      default: m.SkillFormModal,
    })),
  {
    loading: () => (
      <div className="codex-scrim fixed inset-0 z-50 flex items-center justify-center">
        <CodexLoader label="Loading talent form" size="md" />
      </div>
    ),
  }
);

// Deferred removal dialog — the confirm-dialog chunk is only fetched when the
// operator clicks a delete action, keeping it out of the initial matrix
// bundle (mirrors the form-modal split above).
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
const SKILL_SORTERS: Record<string, (a: SkillCardData, b: SkillCardData) => number> = {
  order: (a, b) => a.order - b.order,
  name: (a, b) => a.name.localeCompare(b.name),
  level: (a, b) => b.level - a.level,
};

const SKILL_SORT_OPTIONS = [
  { value: "order", label: "Display order" },
  { value: "name", label: "Name (A–Z)" },
  { value: "level", label: "Level (highest first)" },
];

export default function DashboardSkills() {
  const { data: skills, loading, refetch } = useData<SkillCardData[]>("/api/skills");
  const rows = useMemo(() => skills ?? [], [skills]);

  const list = useListControls<SkillCardData>({
    items: rows,
    getId: (skill) => skill.id,
    searchFields: ["name", "category"],
    sorters: SKILL_SORTERS,
    defaultSort: "order",
  });

  // Reordering walks the whole matrix in stored order — not just the visible
  // page — so a move at a page boundary still lands on the adjacent card. It
  // is only offered while the matrix is unfiltered and sorted by that same
  // order, when "up" really is the card above.
  const ordered = useMemo(() => [...rows].sort((a, b) => a.order - b.order), [rows]);
  const reorderable = list.sort === "order" && list.query.trim() === "";

  const categoryOptions = useMemo(
    () =>
      [...new Set(rows.map((skill) => skill.category))].sort().map((category) => ({
        value: category,
        label: category,
      })),
    [rows]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillFormRecord | null>(null);
  const [deleteIds, setDeleteIds] = useState<string[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const openNew = useCallback(() => {
    setEditingSkill(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((skill: SkillCardData) => {
    setEditingSkill(skill);
    setModalOpen(true);
  }, []);

  const requestDelete = useCallback((skill: SkillCardData) => {
    setDeleteError(null);
    setDeleteIds([skill.id]);
  }, []);

  const requestBulkDelete = useCallback(() => {
    setDeleteError(null);
    setDeleteIds([...list.selected]);
  }, [list.selected]);

  const openBulkCategory = useCallback(() => {
    setBulkError(null);
    setBulkCategory(categoryOptions[0]?.value ?? "");
    setCategoryOpen(true);
  }, [categoryOptions]);

  // The talent cards are memoized, so the callbacks they receive must keep
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

      try {
        await Promise.all(
          updates.map((row) =>
            apiRequest<unknown>("/api/skills", {
              method: "PUT",
              body: { id: row.id, order: row.order },
            })
          )
        );
        refetch();
      } catch (e) {
        setActionError(
          e instanceof ApiError ? e.message : "Failed to reorder the talents"
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
      ids.map((id) => apiRequest<unknown>(`/api/skills/${id}`, { method: "DELETE" }))
    );
    let removed = 0;
    let failureMessage: string | null = null;
    for (const result of results) {
      if (result.status === "fulfilled") removed += 1;
      else if (failureMessage === null) {
        failureMessage =
          result.reason instanceof ApiError
            ? result.reason.message
            : "Failed to remove the selected talents";
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

  const applyCategory = useCallback(async () => {
    const ids = [...list.selected];
    if (ids.length === 0 || bulkCategory === "") {
      setBulkError("Choose a category before applying");
      return;
    }

    setBulkSaving(true);
    setBulkError(null);
    try {
      await Promise.all(
        ids.map((id) =>
          apiRequest<unknown>("/api/skills", {
            method: "PUT",
            body: { id, category: bulkCategory },
          })
        )
      );
      setCategoryOpen(false);
      list.clearSelection();
      refetch();
    } catch (e) {
      setBulkError(
        e instanceof ApiError ? e.message : "Failed to update the selected talents"
      );
    } finally {
      setBulkSaving(false);
    }
  }, [bulkCategory, refetch, list.clearSelection, list.selected]);

  if (loading) {
    return <DashboardListSkeleton rows={6} />;
  }

  const targets = deleteIds ? rows.filter((skill) => deleteIds.includes(skill.id)) : [];

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        icon={Cpu}
        eyebrow="TALENT TREE // CONSTELLATIONS"
        title="Manage talents"
        titleHighlight="talents"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            New talent
          </Button>
        }
      />

      {/* Search + matrix — widget-level error boundary */}
      <ErrorBoundary section="skills-grid" fallback={<WidgetError label="Talent tree" />}>
        <motion.div {...fadeInUp}>
          <ListToolbar
            query={list.query}
            onQueryChange={list.setQuery}
            searchPlaceholder="Search talents by name or category…"
            sort={list.sort}
            onSortChange={list.setSort}
            sortOptions={SKILL_SORT_OPTIONS}
            pageSize={list.pageSize}
            onPageSizeChange={list.setPageSize}
            filteredCount={list.filteredCount}
            total={list.total}
            selectionCount={list.selected.size}
            bulkActions={
              <>
                <Button variant="secondary" size="sm" onClick={openBulkCategory}>
                  Set category
                </Button>
                <Button variant="danger" size="sm" onClick={requestBulkDelete}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete selected
                </Button>
              </>
            }
          />
        </motion.div>

        {actionError && (
          <p
            role="alert"
            className="mb-4 codex-radius-sm border border-crimson-600/30 bg-crimson-600/8 px-4 py-2.5 text-xs text-crimson-600"
          >
            {actionError}
          </p>
        )}

        {list.filteredCount === 0 ? (
          <motion.div {...fadeInUp}>
            <EmptyState
              icon={<Cpu className="h-5 w-5" />}
              title={list.query ? "No matching talents" : "No talents yet"}
              message={
                list.query
                  ? `Nothing in the tree matches “${list.query}”.`
                  : "The talent tree is empty — add the first proficiency to get started."
              }
              action={
                !list.query ? (
                  <Button variant="primary" size="sm" onClick={openNew}>
                    <Plus className="h-4 w-4" />
                    New talent
                  </Button>
                ) : undefined
              }
            />
          </motion.div>
        ) : (
          <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" {...fadeInUp}>
            {list.pageItems.map((skill, i) => {
              const position = ordered.findIndex((row) => row.id === skill.id);
              return (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  index={i}
                  selectable
                  selected={list.selected.has(skill.id)}
                  onSelect={handleSelect}
                  onMove={reorderable ? dispatchMove : undefined}
                  canMoveUp={reorderable && position > 0}
                  canMoveDown={reorderable && position >= 0 && position < ordered.length - 1}
                  onEdit={openEdit}
                  onDelete={requestDelete}
                />
              );
            })}
          </motion.div>
        )}

        <Pagination
          page={list.page}
          pageCount={list.pageCount}
          onPageChange={list.setPage}
        />
      </ErrorBoundary>

      {/* Add / edit talent modal — lazy-loaded chunk */}
      <SkillFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        skill={editingSkill}
        onSaved={() => {
          setModalOpen(false);
          refetch();
        }}
      />

      {/* Bulk category — the selection's new category, applied to every pick */}
      {categoryOpen && (
        <FormModal
          open
          onClose={() => setCategoryOpen(false)}
          title="Set category"
          size="sm"
          saveLabel="Apply"
          error={bulkError}
          onSave={applyCategory}
          saving={bulkSaving}
        >
          <p className="text-xs text-leather-muted">
            {list.selected.size} selected talents will move to the chosen category.
          </p>
          <Select
            id="bulk-category"
            label="Category"
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            options={categoryOptions}
          />
        </FormModal>
      )}

      {/* Removal confirmation — deferred chunk, mounted only on delete */}
      {deleteIds && (
        <ConfirmDialog
          open
          onClose={() => setDeleteIds(null)}
          title={deleteIds.length > 1 ? "Remove talents" : "Remove talent"}
          message={
            <>
              {deleteIds.length === 1 ? (
                <>
                  Target: <span className="text-gold-ink">{targets[0]?.name ?? "…"}</span>
                  <br />
                </>
              ) : (
                <>
                  {deleteIds.length} selected talents will be removed.
                  <br />
                </>
              )}
              This proficiency and its level data leave the tree permanently.
              {deleteError && (
                <p role="alert" className="mt-2 text-crimson-600">
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
