"use client";

import { useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/ui/form-modal";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { resolveRarity } from "@/lib/project-meta";

/**
 * ProjectFormModal — create/edit modal for the dashboard domain archive.
 *
 * Extracted from dashboard/projects page so the whole form (fields + save
 * logic) can be lazy-loaded as its own chunk via next/dynamic — it only
 * renders when the operator opens the modal, keeping the archive list's
 * initial bundle small.
 *
 * Data comes from the API (POST /api/projects for new, PUT for edits) and
 * every write goes through `apiRequest`, so a refused or failed save shows
 * the server's message inside the modal instead of closing silently.
 */

export interface ProjectFormRecord {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string | null;
  githubUrl: string | null;
  order: number;
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
  tags: string; // comma-separated in the field, sent as an array
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
    tags: project.tags.join(", "),
  };
}

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Project being edited, or null for a new domain. */
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
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Re-sync the form whenever the modal opens with a (different) project.
  useEffect(() => {
    if (open) {
      setForm(toForm(project));
      setError(null);
      setFieldErrors({});
    }
  }, [open, project]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({});
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const body = {
      title: form.title,
      description: form.description,
      category: form.category,
      complexity: form.complexity,
      performance: form.performance,
      year: form.year,
      liveUrl: form.liveUrl || null,
      githubUrl: form.githubUrl || null,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (project) {
        await apiRequest<unknown>("/api/projects", {
          method: "PUT",
          body: { id: project.id, ...body },
        });
      } else {
        await apiRequest<unknown>("/api/projects", { method: "POST", body });
      }

      onSaved();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        setFieldErrors(e.fields);
      } else {
        setError("Failed to save the domain");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={project ? "Edit domain" : "New domain"}
      size="lg"
      saveLabel="Save domain"
      error={Object.keys(fieldErrors).length === 0 ? error : null}
      onSave={handleSave}
      saving={saving}
    >
      <Input
        label="Title"
        placeholder="Enter the domain title…"
        value={form.title}
        required
        error={fieldErrors.title}
        onChange={(e) => updateField("title", e.target.value)}
      />
      <Textarea
        label="Description"
        placeholder="What this domain delivers…"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
        rows={3}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-end gap-3">
          <Select
            label="Complexity"
            value={form.complexity}
            onChange={(e) => updateField("complexity", e.target.value)}
            options={[
              { value: "CLASS-S", label: "Class S — Apex" },
              { value: "CLASS-A", label: "Class A — High" },
              { value: "CLASS-B", label: "Class B — Standard" },
              { value: "CLASS-C", label: "Class C — Basic" },
            ]}
          />
          <span
            aria-label={`Rarity ${resolveRarity(form.complexity)} of 5`}
            className="codex-label-gold pb-3 text-sm tracking-widest"
          >
            {"★".repeat(resolveRarity(form.complexity))}
          </span>
        </div>
        <Select
          label="Category"
          value={form.category}
          required
          error={fieldErrors.category}
          onChange={(e) => updateField("category", e.target.value)}
          options={[
            { value: "", label: "Select a discipline…" },
            ...PROJECT_CATEGORIES.map((category) => ({
              value: category,
              label: category,
            })),
          ]}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Performance"
          placeholder="95%"
          value={form.performance}
          onChange={(e) => updateField("performance", e.target.value)}
        />
        <Input
          label="Year"
          placeholder="2026"
          value={form.year}
          onChange={(e) => updateField("year", e.target.value)}
        />
      </div>
      <Input
        label="Tags (comma-separated)"
        placeholder="Next.js, TypeScript, Prisma"
        value={form.tags}
        onChange={(e) => updateField("tags", e.target.value)}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Live URL"
          placeholder="https://…"
          value={form.liveUrl}
          onChange={(e) => updateField("liveUrl", e.target.value)}
        />
        <Input
          label="GitHub URL"
          placeholder="https://github.com/…"
          value={form.githubUrl}
          onChange={(e) => updateField("githubUrl", e.target.value)}
        />
      </div>
    </FormModal>
  );
}
