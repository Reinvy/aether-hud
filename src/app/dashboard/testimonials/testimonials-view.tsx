"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  MessageCircle,
  Plus,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { RowActions } from "@/components/ui/row-actions";
import { HudLoader } from "@/components/ui/hud-loader";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import type { TestimonialFormRecord } from "@/components/features/testimonial-form-modal";


interface ApiTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  order: number;
}

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
  const { data: testimonials, loading, refetch } = useData<ApiTestimonial[]>("/api/testimonials");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialFormRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiTestimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openNew() {
    setEditingTestimonial(null);
    setModalOpen(true);
  }

  function openEdit(t: ApiTestimonial) {
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
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
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
          archive from blanking the whole dashboard view. */}
      <ErrorBoundary section="testimonials-grid" fallback={<WidgetError label="TESTIMONIAL ARCHIVE" />}>
      <motion.div className="grid gap-4 sm:grid-cols-2" {...fadeInUp}>
        {list.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="h-5 w-5" />}
            title="ARCHIVE EMPTY"
            message="No testimonials recorded — add the first transmission"
          />
        ) : (
          list.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="glass" hover="sweep" diamond>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center chamfered-sm overflow-hidden border border-border-glass bg-deep-space/50">
                      {t.avatar ? (
                        // Raw img (not next/image): avatar URLs come from the
                        // Prisma DB and may be arbitrary remote hosts, which
                        // the image optimizer would reject. Native lazy loading
                        // + async decoding still defer off-screen avatars.
                        <img
                          src={t.avatar}
                          alt={t.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Quote className="h-5 w-5 text-gold-400/60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs font-medium tracking-wider text-text-main">
                        {t.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] text-text-muted">
                        {t.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 chamfered-sm border border-border-subtle bg-deep-space/30 p-3">
                    <p className="font-mono text-[11px] leading-relaxed text-text-muted italic line-clamp-3">
                      &ldquo;{t.content}&rdquo;
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="sys-label text-[8px]">ORDER: {t.order}</span>
                    <RowActions
                      onEdit={() => openEdit(t)}
                      onDelete={() => setDeleteTarget(t)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
