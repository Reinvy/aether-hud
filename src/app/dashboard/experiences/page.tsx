"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Plus,
  GraduationCap,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBox } from "@/components/ui/icon-box";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { RowActions } from "@/components/ui/row-actions";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton, DashboardFormSkeleton } from "@/components/ui/skeleton";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

interface ApiExperience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  type: "work" | "education" | "freelance";
  order: number;
}

type FormData = {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  type: "work" | "education" | "freelance";
  order: string;
};

const EMPTY_FORM: FormData = {
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  type: "work",
  order: "0",
};

const typeColors: Record<string, string> = {
  work: "border-gold-400/40 text-gold-400",
  education: "border-stellar-400/40 text-stellar-400",
  freelance: "border-[#38EF7D]/40 text-[#38EF7D]",
};

const typeIcons: Record<string, React.ElementType> = {
  work: Briefcase,
  education: GraduationCap,
  freelance: Globe,
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export default function DashboardExperiences() {
  const { data: experiences, loading, refetch } = useData<ApiExperience[]>("/api/experiences");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(exp: ApiExperience) {
    setEditingId(exp.id);
    setForm({
      company: exp.company,
      role: exp.role,
      description: exp.description,
      startDate: exp.startDate ? exp.startDate.slice(0, 10) : "",
      endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
      type: exp.type,
      order: String(exp.order),
    });
    setModalOpen(true);
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        company: form.company,
        role: form.role,
        description: form.description,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        type: form.type,
        order: parseInt(form.order, 10) || 0,
      };

      if (editingId) {
        await fetch("/api/experiences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...body }),
        });
      } else {
        await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setModalOpen(false);
      refetch();
    } catch (e) {
      console.error("Failed to save experience", e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("PURGE EXPERIENCE RECORD? This action cannot be undone.")) return;
    try {
      await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      refetch();
    } catch (e) {
      console.error("Failed to delete experience", e);
    }
  }

  if (loading) {
    return <DashboardListSkeleton rows={4} />;
  }

  const list = experiences ?? [];

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Briefcase}
        label="DASHBOARD // EXPERIENCE LOG"
        title="Manage Experience Record"
        titleHighlight="Experience Record"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            NEW EXPERIENCE
          </Button>
        }
      />

      {/* Experience List */}
      <motion.div className="space-y-3" {...fadeInUp}>
        <div className="flex items-center gap-4 border-b border-border-subtle px-4 py-2">
          <span className="sys-label w-8 text-center">#</span>
          <span className="sys-label flex-1">COMPANY / ROLE</span>
          <span className="sys-label hidden w-24 sm:block">TYPE</span>
          <span className="sys-label hidden w-40 md:block">PERIOD</span>
          <span className="sys-label w-20 text-center">ACTIONS</span>
        </div>

        {list.length === 0 ? (
          <EmptyState message="No experience records found" />
        ) : (
          list.map((exp, i) => {
            const TypeIcon = typeIcons[exp.type] || Briefcase;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card variant="glass" hover="sweep" diamond>
                  <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4">
                    <IconBox>
                      <TypeIcon className="h-4 w-4 text-gold-400/60" />
                    </IconBox>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-medium tracking-wider text-text-main group-hover:text-gold-400 transition-colors duration-200">
                        {exp.role}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[9px] text-text-muted">
                        {exp.company}
                      </p>
                    </div>

                    <div className="hidden w-24 sm:block">
                      <Badge
                        variant="default"
                        size="sm"
                        className={typeColors[exp.type] || ""}
                      >
                        {exp.type.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="hidden w-40 items-center gap-2 md:flex">
                      <span className="font-mono text-[10px] text-text-muted">
                        {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "PRESENT"}
                      </span>
                    </div>

                    <div className="flex w-20 items-center justify-end">
                      <RowActions
                        onEdit={() => openEdit(exp)}
                        onDelete={() => handleDelete(exp.id)}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* New / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "EDIT EXPERIENCE RECORD" : "NEW EXPERIENCE RECORD"}
        sysId={editingId ? `DASH//04 // ${editingId.slice(0, 8)}` : "DASH//04 // NEW"}
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              CANCEL
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              SAVE RECORD
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="FIELD_01 // COMPANY"
            placeholder="Enter company name..."
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
          />
          <Input
            label="FIELD_02 // ROLE"
            placeholder="e.g., Senior Full-Stack Developer"
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
          />
          <Textarea
            label="FIELD_03 // DESCRIPTION"
            placeholder="Describe your responsibilities and achievements..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="FIELD_04 // START DATE"
              type="date"
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
            />
            <Input
              label="FIELD_05 // END DATE"
              type="date"
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              placeholder="Leave empty for present"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="sys-label mb-2 block text-text-muted">
                FIELD_06 // TYPE
              </label>
              <select
                className="input-recessed w-full px-4 py-2.5 text-sm font-body"
                value={form.type}
                onChange={(e) => updateField("type", e.target.value as FormData["type"])}
              >
                <option value="work">WORK</option>
                <option value="education">EDUCATION</option>
                <option value="freelance">FREELANCE</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Input
                label="FIELD_07 // ORDER"
                type="number"
                placeholder="0"
                value={form.order}
                onChange={(e) => updateField("order", e.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
