"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { FormModal } from "@/components/ui/form-modal";
import { ApiError, apiRequest } from "@/lib/api-client";
import type { SectionDto } from "@/lib/dto";

/**
 * SectionFormModal — create/edit modal for the landing page registry.
 *
 * Create mode POSTs a new page (the API assigns its display order); edit mode
 * PUTs the existing row and keeps its order. The key is the landing anchor
 * (`#hero`, `#projects`, …) and is immutable once created, so it is validated
 * against the same rule the API enforces and rendered read-only afterwards.
 */

/** Mirrors the server-side section-key rule in src/app/api/sections/route.ts. */
const SECTION_KEY = /^[a-z][a-z0-9-]{1,31}$/;

type FormData = {
  key: string;
  title: string;
  subtitle: string;
  enabled: boolean;
};

const EMPTY_FORM: FormData = {
  key: "",
  title: "",
  subtitle: "",
  enabled: true,
};

function toForm(section: SectionDto | null): FormData {
  if (!section) return EMPTY_FORM;
  return {
    key: section.key,
    title: section.title,
    subtitle: section.subtitle ?? "",
    enabled: section.enabled,
  };
}

interface SectionFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Page being edited, or null to create one. */
  section: SectionDto | null;
  /** Called after a successful save so the parent can refetch + close. */
  onSaved: () => void;
}

export function SectionFormModal({
  open,
  onClose,
  section,
  onSaved,
}: SectionFormModalProps) {
  const [form, setForm] = useState<FormData>(() => toForm(section));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-sync the form whenever the modal opens with a (different) page.
  useEffect(() => {
    if (open) {
      setForm(toForm(section));
      setError(null);
    }
  }, [open, section]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const key = form.key.trim();
    if (!section && !SECTION_KEY.test(key)) {
      setError(
        "Key must be 2–32 characters: lowercase letters, digits or dashes, starting with a letter."
      );
      return;
    }

    const body = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      enabled: form.enabled,
    };
    const failed = section ? "Failed to update page" : "Failed to create page";

    setSaving(true);
    setError(null);
    try {
      if (section) {
        await apiRequest("/api/sections", {
          method: "PUT",
          body: { id: section.id, ...body, order: section.order },
        });
      } else {
        await apiRequest("/api/sections", { method: "POST", body: { key, ...body } });
      }
      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : failed);
    } finally {
      setSaving(false);
    }
  }

  const editing = section !== null;

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={editing ? "Edit codex page" : "New codex page"}
      saveLabel={editing ? "Save page" : "Create page"}
      error={error}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Key"
          placeholder="e.g. projects"
          value={form.key}
          disabled={editing}
          onChange={(e) => updateField("key", e.target.value)}
        />
        <Input
          label="Title"
          placeholder="e.g. Featured Projects"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      <p className="text-xs text-text-muted">
        {editing
          ? "The key is the page anchor on the landing screen and cannot be changed once the page exists."
          : "The key becomes the page anchor on the landing screen. Use lowercase letters, digits and dashes."}
      </p>

      <Input
        label="Subtitle"
        placeholder="Shown under the heading on the landing page"
        value={form.subtitle}
        onChange={(e) => updateField("subtitle", e.target.value)}
      />

      <div className="flex items-center gap-3 codex-radius-sm border border-border-subtle px-4 py-3">
        <Toggle
          id="section-enabled"
          checked={form.enabled}
          onChange={(enabled) => updateField("enabled", enabled)}
          label="Visible on the landing page"
        />
      </div>
    </FormModal>
  );
}
