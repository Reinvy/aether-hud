"use client";

import { useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormModal } from "@/components/ui/form-modal";
import { SKILL_CATEGORIES } from "@/lib/constants";

/**
 * SkillFormModal — create/edit module modal for the dashboard talent matrix.
 *
 * Extracted from dashboard/skills page so the whole form (fields + save
 * logic) can be lazy-loaded as its own chunk via next/dynamic — it only
 * renders when the operator opens the modal, keeping the matrix list's
 * initial bundle small. Writes go through `apiRequest`, so a failed save
 * reports the server's message inside the modal.
 */

export interface SkillFormRecord {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  order: number;
}

type FormData = {
  name: string;
  level: string;
  category: string;
  icon: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  level: "85",
  category: "",
  icon: "Zap",
};

const ICON_OPTIONS = [
  { value: "Zap", label: "Zap — Energy & Speed" },
  { value: "Globe", label: "Globe — Web & Frontend" },
  { value: "FileCode", label: "FileCode — Languages" },
  { value: "Palette", label: "Palette — Styling & CSS" },
  { value: "Server", label: "Server — Backend & APIs" },
  { value: "Database", label: "Database — Data & SQL" },
  { value: "Brain", label: "Brain — AI & Machine Learning" },
  { value: "Bot", label: "Bot — AI Agents & LLMs" },
  { value: "Terminal", label: "Terminal — Systems & CLI" },
  { value: "Radio", label: "Radio — Realtime & WebSockets" },
  { value: "Network", label: "Network — Architecture" },
  { value: "Container", label: "Container — Docker & K8s" },
  { value: "Rocket", label: "Rocket — DevOps & Cloud" },
  { value: "PenTool", label: "PenTool — Design & Figma" },
  { value: "Code", label: "Code — General Development" },
  { value: "Cpu", label: "Cpu — Compute Core" },
];

function toForm(skill: SkillFormRecord | null): FormData {
  if (!skill) return EMPTY_FORM;
  return {
    name: skill.name,
    level: String(skill.level),
    category: skill.category,
    icon: skill.icon,
  };
}

interface SkillFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Skill being edited, or null for a new module. */
  skill: SkillFormRecord | null;
  /** Called after a successful save so the parent can refetch + close. */
  onSaved: () => void;
}

export function SkillFormModal({
  open,
  onClose,
  skill,
  onSaved,
}: SkillFormModalProps) {
  const [form, setForm] = useState<FormData>(() => toForm(skill));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Re-sync the form whenever the modal opens with a (different) skill.
  useEffect(() => {
    if (open) {
      setForm(toForm(skill));
      setError(null);
      setFieldErrors({});
    }
  }, [open, skill]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({});
  }

  async function handleSave() {
    const level = Number(form.level);
    if (!Number.isInteger(level) || level < 1 || level > 100) {
      setFieldErrors({
        level: "Level must be a whole number between 1 and 100.",
      });
      return;
    }

    setSaving(true);
    setError(null);

    const body = {
      name: form.name,
      level,
      category: form.category,
      icon: form.icon,
    };

    try {
      if (skill) {
        await apiRequest<unknown>("/api/skills", {
          method: "PUT",
          body: { id: skill.id, ...body },
        });
      } else {
        await apiRequest<unknown>("/api/skills", { method: "POST", body });
      }

      onSaved();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        setFieldErrors(e.fields);
      } else {
        setError("Failed to save the talent");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={skill ? "Edit talent" : "New talent"}
      saveLabel="Save talent"
      error={Object.keys(fieldErrors).length === 0 ? error : null}
      onSave={handleSave}
      saving={saving}
    >
      <Input
        label="Name"
        placeholder="e.g., React Native"
        value={form.name}
        required
        error={fieldErrors.name}
        onChange={(e) => updateField("name", e.target.value)}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Category"
          value={form.category}
          required
          error={fieldErrors.category}
          onChange={(e) => updateField("category", e.target.value)}
          options={[
            { value: "", label: "Select a discipline…" },
            ...SKILL_CATEGORIES.map((category) => ({
              value: category,
              label: category,
            })),
          ]}
        />
        <Input
          label="Level (1-100)"
          type="number"
          min={1}
          max={100}
          required
          error={fieldErrors.level}
          placeholder="85"
          value={form.level}
          onChange={(e) => updateField("level", e.target.value)}
        />
      </div>
      <Select
        label="Icon"
        value={form.icon}
        onChange={(e) => updateField("icon", e.target.value)}
        options={ICON_OPTIONS}
      />
    </FormModal>
  );
}
