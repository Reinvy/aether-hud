"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { HudLoader } from "@/components/ui/hud-loader";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import {
  TestimonialCard,
  type TestimonialCardData,
} from "@/components/features/testimonials/testimonial-card";
import type { TestimonialFormRecord } from "@/components/features/testimonial-form-modal";


// The create/edit form module is lazy-loaded as its own chunk — it only
// renders when the operator opens the modal, keeping the archive grid's
// initial bundle small. A HUD loader overlay is shown during the chunk
// fetch.
const TestimonialFormModal = dynamic(
  () =>
    import("@/components/features/testimonial-form-modal").then((m) => ({
      default: m.TestimonialFormModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <HudLoader label="LOADING TESTIMONIAL MODULE" size="md" />
      </div>
    ),
  }
);

// Deferred purge dialog — the confirm-dialog chunk is only fetched when
// the operator clicks a delete action, keeping it out of the initial
// archive bundle (mirrors the form-modal split above).
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

export default function DashboardTestimonials() {
  const { data: testimonials, loading, refetch } = useData<TestimonialCardData[]>("/api/testimonials");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialFormRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialCardData | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openNew() {
    setEditingTestimonial(null);
    setModalOpen(true);
  }

  function openEdit(t: TestimonialCardData) {
    setEditingTestimonial(t);
    setModalOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/testimonials/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      refetch();
    } catch (e) {
      console.error("Failed to delete testimonial", e);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <DashboardListSkeleton rows={4} />;
  }

  const list = testimonials ?? [];

  return (
    <div className="dashboard-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={MessageCircle}
        label="DASHBOARD // TESTIMONIAL ARCHIVE"
        title="Manage Testimonials"
        titleHighlight="Testimonials"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            NEW TESTIMONIAL
          </Button>
        }
      />

      {/* Testimonials Grid — widget-level error boundary keeps a failing
          archive from blanking the whole dashboard view. Entries render
          via the reusable TestimonialCard; the view maps data + state. */}
      <ErrorBoundary section="testimonials-grid" fallback={<WidgetError label="TESTIMONIAL ARCHIVE" />}>
      <motion.div className="grid gap-4 sm:grid-cols-2" {...fadeInUp}>
        {list.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="h-5 w-5" />}
            title="ARCHIVE EMPTY"
            message="No testimonials recorded — add the first transmission"
            className="sm:col-span-2"
          />
        ) : (
          list.map((t, i) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              index={i}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </motion.div>
      </ErrorBoundary>

      {/* New / Edit Modal — lazy-loaded chunk */}
      <TestimonialFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        testimonial={editingTestimonial}
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
          title="PURGE TESTIMONIAL"
          sysId={`DASH//TST // ${deleteTarget.id}`}
          message={
            <>
              Target: <span className="text-gold-400">{deleteTarget.name}</span>
              <br />
              This testimonial record will be permanently removed from the archive.
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
