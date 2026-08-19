"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";

/**
 * ProjectFormModal — create/edit dossier modal for the dashboard project
 * archive.
 *
 * Extracted from dashboard/projects page so the whole form (fields + save
 * logic) can be lazy-loaded as its own chunk via next/dynamic — it only
 * renders when the operator opens the modal, keeping the archive list's
 * initial bundle small.
 *
 * Data still comes from the API (POST /api/projects for new, PUT for
 * edits) — nothing is hardcoded.
 */

export interface ProjectFormRecord {
  id: string;
  title: string;
  description: string;
  tags: string; // JSON array stored as string (API format)
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string | null;
  githubUrl: string | null;
}

type FormData = {
  title: string;
  description: string;
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string;
  githubUrl: string;
  tags: string; // comma-separated for the input
};

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  category: "",
  complexity: "CLASS-B",
  performance: "95%",
  year: new Date().getFullYear().toString(),
  liveUrl: "",
  githubUrl: "",
  tags: "",
};

function parseTagsDisplay(tags: string): string {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.join(", ") : tags;
  } catch {
    return tags;
  }
}

function toForm(project: ProjectFormRecord | null): FormData {
  if (!project) return EMPTY_FORM;
  return {
    title: project.title,
    description: project.description,
    category: project.category,
    complexity: project.complexity,
    performance: project.performance,
    year: project.year,
    liveUrl: project.liveUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    tags: parseTagsDisplay(project.tags),
  };
}

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Project being edited, or null for a new dossier. */
  project: ProjectFormRecord | null;
  /** Called after a successful save so the parent can refetch + close. */
  onSaved: () => void;
}

export function ProjectFormModal({
  open,
  onClose,
  project,
  onSaved,
}: ProjectFormModalProps) {
  const [form, setForm] = useState<FormData>(() => toForm(project));
  const [saving, setSaving] = useState(false);

  // Re-sync the form whenever the modal opens with a (different) project.
  useEffect(() => {
    if (open) setForm(toForm(project));
  }, [open, project]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        category: form.category,
        complexity: form.complexity,
        performance: form.performance,
        year: form.year,
        liveUrl: form.liveUrl || null,
        githubUrl: form.githubUrl || null,
        tags: JSON.stringify(
          form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        ),
      };

      if (project) {
        await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: project.id, ...body }),
        });
      } else {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      onSaved();
    } catch (e) {
      console.error("Failed to save project", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? "EDIT DOSSIER" : "NEW DOSSIER"}
      sysId={project ? `DASH//01 // ${project.id.slice(0, 8)}` : "DASH//01 // NEW"}
      size="lg"
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={saving}
          >
            CANCEL
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            SAVE DOSSIER
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="FIELD_01 // PROJECT TITLE"
          placeholder="Enter project designation..."
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
        <Textarea
          label="FIELD_02 // DESCRIPTION"
          placeholder="Mission briefing..."
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={3}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="FIELD_03 // COMPLEXITY"
            value={form.complexity}
            onChange={(e) => updateField("complexity", e.target.value)}
            options={[
              { value: "CLASS-S", label: "CLASS-S // APEX" },
              { value: "CLASS-A", label: "CLASS-A // HIGH" },
              { value: "CLASS-B", label: "CLASS-B // STANDARD" },
              { value: "CLASS-C", label: "CLASS-C // BASIC" },
            ]}
          />
          <Input
            label="FIELD_04 // CATEGORY"
            placeholder="AI Platform"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="FIELD_05 // PERFORMANCE"
            placeholder="95%"
            value={form.performance}
            onChange={(e) => updateField("performance", e.target.value)}
          />
          <Input
            label="FIELD_06 // YEAR"
            placeholder="2026"
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
          />
        </div>
        <Input
          label="FIELD_07 // TAGS (comma-separated)"
          placeholder="Next.js, TypeScript, Prisma"
          value={form.tags}
          onChange={(e) => updateField("tags", e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="FIELD_08 // LIVE URL"
            placeholder="https://..."
            value={form.liveUrl}
            onChange={(e) => updateField("liveUrl", e.target.value)}
          />
          <Input
            label="FIELD_09 // GITHUB URL"
            placeholder="https://github.com/..."
            value={form.githubUrl}
            onChange={(e) => updateField("githubUrl", e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
