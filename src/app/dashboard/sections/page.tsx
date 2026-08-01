"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  Blocks,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  enabled: boolean;
  order: number;
}


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
        <Card variant="glass" hover="none">
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
                  <motion.tr
                    key={section.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      "border-b border-border-subtle/50 transition-colors hover:bg-glass-200/40",
                      !section.enabled && "opacity-60"
                    )}
                  >
                    {/* Order */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-3.5 w-3.5 text-text-muted/30" />
                        <span className="font-mono text-[11px] text-text-muted">
                          {String(section.order).padStart(2, "0")}
                        </span>
                      </div>
                    </td>
                    {/* Title */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <IconBox>
                          <span className="font-mono text-[10px] text-gold-400">
                            {String(section.order + 1).padStart(2, "0")}
                          </span>
                        </IconBox>
                        <div>
                          <p className="font-mono text-xs font-medium tracking-wider text-text-main">
                            {section.title}
                          </p>
                          <p className="font-mono text-[9px] tracking-wider text-text-muted/60">
                            sec-{section.key}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Key */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <Badge variant="default" size="sm">
                        {section.key}
                      </Badge>
                    </td>
                    {/* Subtitle */}
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="font-mono text-[10px] text-text-muted">
                        {section.subtitle || "—"}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggle(section)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-mono tracking-wider transition-all",
                          section.enabled
                            ? "bg-[rgba(56,239,125,0.1)] text-stellar-400 hover:bg-[rgba(56,239,125,0.15)]"
                            : "bg-[rgba(239,68,68,0.1)] text-hud-danger hover:bg-[rgba(239,68,68,0.15)]"
                        )}
                      >
                        {section.enabled ? (
                          <>
                            <Eye className="h-3 w-3" />
                            ACTIVE
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            HIDDEN
                          </>
                        )}
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        glow="none"
                        className="p-1.5"
                        onClick={() => openEdit(section)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </motion.tr>
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

      {/* Edit Section Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="EDIT SECTION"
        sysId={`DASH//SECT // ${editingSection?.key ?? "N/A"}`}
      >
        <div className="space-y-4">
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
            <div className="flex items-center gap-3 rounded border border-border-subtle bg-deep-space/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    editingSection.enabled ? "bg-hud-active" : "bg-hud-danger"
                  )}
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

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={closeModal} disabled={saving}>
              CANCEL
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              SAVE CHANGES
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
