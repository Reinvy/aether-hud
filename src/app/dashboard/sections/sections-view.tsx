"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { Blocks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { Input } from "@/components/ui/input";
import { StatusDot } from "@/components/ui/status-dot";
import { HudLoader } from "@/components/ui/hud-loader";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import {
  SectionRow,
  type Section,
} from "@/components/features/section-row";

// The edit form is a generic field-builder modal (title/subtitle inputs).
// It only renders when the operator opens it, so the chunk is deferred —
// fetched on the first EDIT click, never shipped in the section-control
// bundle. A HUD loader overlay is shown during the chunk fetch.
const FormModal = dynamic(
  () =>
    import("@/components/ui/form-modal").then((m) => ({
      default: m.FormModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <HudLoader label="LOADING SECTION MODULE" size="md" />
      </div>
    ),
  }
);

/**
 * DashboardSections — thin orchestrator for the section control page.
 *
 * Each table row renders through the reusable <SectionRow /> sub-component
 * (src/components/features/section-row.tsx); this view owns data fetching,
 * the toggle/save handlers and the deferred edit modal.
 */
export default function DashboardSections() {
  const { data: sections, loading, refetch } = useData<Section[]>("/api/sections");
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", subtitle: "" });

  function openEdit(section: Section) {
    setEditingSection(section);
    setEditForm({
      title: section.title,
      subtitle: section.subtitle ?? "",
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingSection(null);
  }

  function updateField(key: "title" | "subtitle", value: string) {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleToggle(section: Section) {
    try {
      await fetch("/api/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: section.id, enabled: !section.enabled }),
      });
      refetch();
    } catch (e) {
      console.error("Failed to toggle section", e);
    }
  }

  async function handleSave() {
    if (!editingSection) return;
    setSaving(true);
    try {
      await fetch("/api/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSection.id,
          title: editForm.title,
          subtitle: editForm.subtitle || null,
        }),
      });
      closeModal();
      refetch();
    } catch (e) {
      console.error("Failed to update section", e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <DashboardListSkeleton rows={5} />;
  }

  const sectionList = sections ?? [];

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Blocks}
        label="DASHBOARD // SECTION CONTROL"
        title="Manage Sections"
        titleHighlight="Sections"
        statusLabel={`${sectionList.length} SECTIONS`}
        statusActive={sectionList.length > 0}
      />

      {/* Info Banner + Sections Table — widget-level error boundary */}
      <ErrorBoundary section="sections-table" fallback={<WidgetError label="SECTION CONTROL" />}>
      {/* Info Banner */}
      <motion.div className="mb-6" {...fadeInUp}>
        <Card variant="bordered" hover="none">
          <CardContent className="p-4">
            <p className="font-mono text-[11px] leading-relaxed text-text-muted">
              Control which sections appear on your landing page. Disabled sections are hidden
              from visitors but remain in the database. Order determines display sequence.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sections Table */}
      <motion.div {...fadeInUp}>
        <Card variant="glass" hover="none" diamond>
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="px-4 py-3 text-left">
                    <span className="sys-label text-[9px]">ORDER</span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="sys-label text-[9px]">SECTION</span>
                  </th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">
                    <span className="sys-label text-[9px]">KEY</span>
                  </th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">
                    <span className="sys-label text-[9px]">SUBTITLE</span>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <span className="sys-label text-[9px]">STATUS</span>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <span className="sys-label text-[9px]">ACTIONS</span>
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {sectionList.map((section, i) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    index={i}
                    onToggle={handleToggle}
                    onEdit={openEdit}
                  />
                ))}

                {sectionList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <p className="font-mono text-xs text-text-muted">
                        [EMPTY] // No sections configured
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
      </ErrorBoundary>

      {/* Edit Section Modal — deferred chunk, mounted only on edit */}
      {modalOpen && (
      <FormModal
        open
        onClose={closeModal}
        title="EDIT SECTION"
        sysId={`DASH//SECT // ${editingSection?.key ?? "N/A"}`}
        saveLabel="SAVE CHANGES"
        onSave={handleSave}
        saving={saving}
      >
        <Input
          label="FIELD_01 // TITLE"
          placeholder="e.g., Hero"
          value={editForm.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
        <Input
          label="FIELD_02 // SUBTITLE"
          placeholder="e.g., Main introduction with terminal display"
          value={editForm.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
        />

        {editingSection && (
          <div className="flex flex-wrap items-center gap-3 chamfered-sm border border-border-subtle bg-deep-space/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <StatusDot
                tone={editingSection.enabled ? "active" : "danger"}
                pulse={editingSection.enabled}
                label={editingSection.enabled ? "Enabled" : "Disabled"}
              />
              <span className="font-mono text-[10px] text-text-muted">
                {editingSection.enabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>
            <span className="text-text-muted/30">|</span>
            <span className="font-mono text-[10px] text-text-muted">
              ORDER: {editingSection.order}
            </span>
            <span className="text-text-muted/30">|</span>
            <span className="font-mono text-[10px] text-text-muted">
              KEY: {editingSection.key}
            </span>
          </div>
        )}
      </FormModal>
      )}
    </div>
  );
}
