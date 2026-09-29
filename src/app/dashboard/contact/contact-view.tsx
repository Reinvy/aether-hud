"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { CodexLoader } from "@/components/ui/codex-loader";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { Pagination } from "@/components/ui/pagination";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { useData } from "@/lib/use-data";
import { useListControls } from "@/lib/use-list-controls";
import { ApiError, apiRequest } from "@/lib/api-client";
import { swapOrder } from "@/lib/reorder";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { SocialLinksCard } from "@/components/features/contact/social-links-card";
import { ContactConfigCard } from "@/components/features/contact/contact-config-card";
import type { ConfigDto, SocialDto } from "@/lib/dto";

// Lazy-loaded social link form modal — own chunk, only loads on demand.
// The loader overlay is fixed + z-50 so it sits above the modal backdrop
// while the chunk streams in.
const SocialFormModal = dynamic(
  () =>
    import("@/components/features/social-form-modal").then((m) => ({
      default: m.SocialFormModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <CodexLoader label="Loading link form" size="lg" />
      </div>
    ),
  }
);

// Deferred confirm dialog — the chunk is only fetched when the operator
// clicks a delete action, keeping it out of the initial controls bundle
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
  { value: "platform", label: "Platform" },
];

interface DeleteRequest {
  ids: string[];
  label: string;
}

/**
 * DashboardContact — the contact control page.
 *
 * The social link list is driven by the shared list controls (search, sort,
 * pagination, selection); the config panel owns the email field. Both panels
 * live in reusable sub-components under src/components/features/contact/,
 * so this view only owns fetching, handlers and layout.
 */
export default function DashboardContact() {
  const { data: socials, loading: socialsLoading, refetch: refetchSocials } = useData<SocialDto[]>("/api/socials");
  const { data: config, loading: configLoading, refetch: refetchConfig } = useData<ConfigDto>("/api/config");
  const list = useMemo(() => socials ?? [], [socials]);

  const controls = useListControls<SocialDto>({
    items: list,
    getId: (s) => s.id,
    searchFields: ["platform", "url"],
    sorters: {
      order: (a, b) => a.order - b.order,
      platform: (a, b) => a.platform.localeCompare(b.platform),
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

  // Social Links state — record is null when creating a new link
  const [formOpen, setFormOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialDto | null>(null);

  // Delete confirmation state
  const [deleteRequest, setDeleteRequest] = useState<DeleteRequest | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Config state
  const [editEmail, setEditEmail] = useState("");
  const [editEmailDirty, setEditEmailDirty] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  // Sync config email when loaded
  useEffect(() => {
    if (config && !editEmailDirty) {
      setEditEmail(config.email || "");
    }
  }, [config, editEmailDirty]);

  // useListControls hands back fresh callbacks each render; route the
  // selection handler through a ref so the memoized list rows keep their
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

  // A new link appends after the last position rather than colliding with
  // the existing order values at zero.
  const nextOrder = useMemo(
    () => list.reduce((max, s) => Math.max(max, s.order), -1) + 1,
    [list]
  );

  const openNewSocial = useCallback(() => {
    setEditingSocial(null);
    setFormOpen(true);
  }, []);

  const openEditSocial = useCallback((s: SocialDto) => {
    setEditingSocial(s);
    setFormOpen(true);
  }, []);

  const closeSocialForm = useCallback(() => {
    setFormOpen(false);
    setEditingSocial(null);
  }, []);

  // `swapOrder` returns both rows of the exchange (or nothing at an end);
  // the two updates are written together, then the list is refetched once.
  const handleMove = useCallback(
    async (social: SocialDto, direction: -1 | 1) => {
      const updates = swapOrder(list, social.id, direction);
      if (updates.length === 0) return;
      setError(null);
      try {
        await Promise.all(
          updates.map((update) =>
            apiRequest("/api/socials", { method: "PUT", body: update })
          )
        );
        refetchSocials();
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Failed to reorder social link");
      }
    },
    [list, refetchSocials]
  );

  const requestDeleteSocial = useCallback((s: SocialDto) => {
    setDeleteError(null);
    setDeleteRequest({ ids: [s.id], label: s.platform });
  }, []);

  const requestBulkDelete = useCallback(() => {
    setDeleteError(null);
    setDeleteRequest({
      ids: [...selected],
      label: `${selected.size} selected links`,
    });
  }, [selected]);

  const handleDeleteSocial = useCallback(async () => {
    if (!deleteRequest) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await Promise.all(
        deleteRequest.ids.map((id) =>
          apiRequest(`/api/socials/${id}`, { method: "DELETE" })
        )
      );
      setDeleteRequest(null);
      clearSelection();
      refetchSocials();
    } catch (e) {
      setDeleteError(e instanceof ApiError ? e.message : "Failed to delete social link");
    } finally {
      setDeleting(false);
    }
  }, [deleteRequest, clearSelection, refetchSocials]);

  const handleSaveConfig = useCallback(async () => {
    setSavingConfig(true);
    setConfigError(null);
    try {
      await apiRequest("/api/config", { method: "PUT", body: { email: editEmail } });
      refetchConfig();
    } catch (e) {
      setConfigError(e instanceof ApiError ? e.message : "Failed to update contact email");
    } finally {
      setSavingConfig(false);
    }
  }, [editEmail, refetchConfig]);

  const handleEmailChange = useCallback((value: string) => {
    setEditEmail(value);
    setEditEmailDirty(true);
  }, []);

  if (socialsLoading || configLoading) {
    return <DashboardListSkeleton rows={4} />;
  }

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      <DashboardPageHeader
        icon={User}
        eyebrow="DISPATCH PORTAL"
        title="Manage social links"
        titleHighlight="social links"
      />

      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search links by platform or URL…"
        sort={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
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

      {/* Social + config panels — widget-level error boundary keeps a
          failing panel from blanking the whole view. */}
      <ErrorBoundary section="contact-panels" fallback={<WidgetError label="CONTACT CONFIG" />}>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* === SOCIAL LINKS === */}
          <motion.div {...fadeInUp}>
            <SocialLinksCard
              socials={pageItems}
              selectable
              selectedIds={selected}
              onSelect={handleSelect}
              emptyMessage={
                filteredCount === 0 && total > 0
                  ? "No links match this search."
                  : "Add a link to publish it on your landing page."
              }
              onMove={handleMove}
              firstId={firstId}
              lastId={lastId}
              onAdd={openNewSocial}
              onEdit={openEditSocial}
              onDelete={requestDeleteSocial}
            />
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </motion.div>

          {/* === CONTACT CONFIG === */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <ContactConfigCard
              config={config}
              email={editEmail}
              onEmailChange={handleEmailChange}
              onSave={handleSaveConfig}
              saving={savingConfig}
              error={configError}
            />
          </motion.div>
        </div>
      </ErrorBoundary>

      {/* Social Link Modal — lazy-loaded chunk (own bundle) */}
      {formOpen && (
        <SocialFormModal
          open
          onClose={closeSocialForm}
          social={editingSocial}
          nextOrder={nextOrder}
          onSaved={() => {
            closeSocialForm();
            refetchSocials();
          }}
        />
      )}

      {deleteRequest && (
        <ConfirmDialog
          open
          onClose={() => setDeleteRequest(null)}
          title="Remove social link"
          message={
            <>
              Remove <span className="text-gold-400">{deleteRequest.label}</span> from the
              contact list? This cannot be undone.
              {deleteError && (
                <span role="alert" className="mt-2 block text-hud-danger">
                  {deleteError}
                </span>
              )}
            </>
          }
          onConfirm={handleDeleteSocial}
          saving={deleting}
        />
      )}
    </div>
  );
}
