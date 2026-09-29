"use client";

import { useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FormModal } from "@/components/ui/form-modal";

/**
 * ExperienceFormModal — create/edit quest modal for the dashboard quest log.
 *
 * Extracted from dashboard/experiences page so the whole form (fields + save
 * logic) can be lazy-loaded as its own chunk via next/dynamic — it only
 * renders when the operator opens the modal, keeping the log list's initial
 * bundle small. List position is owned by the view's move controls, so the
 * form never sends `order`. Writes go through `apiRequest`, so a failed save
 * reports the server's message inside the modal.
 */

export interface ExperienceFormRecord {
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
};

const EMPTY_FORM: FormData = {
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  type: "work",
};

function toForm(exp: ExperienceFormRecord | null): FormData {
  if (!exp) return EMPTY_FORM;
  return {
    company: exp.company,
    role: exp.role,
    description: exp.description,
    startDate: exp.startDate ?? "",
    endDate: exp.endDate ?? "",
    type: exp.type,
  };
}

interface ExperienceFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Experience being edited, or null for a new record. */
  experience: ExperienceFormRecord | null;
  /** Called after a successful save so the parent can refetch + close. */
  onSaved: () => void;
}

export function ExperienceFormModal({
  open,
  onClose,
  experience,
  onSaved,
}: ExperienceFormModalProps) {
  const [form, setForm] = useState<FormData>(() => toForm(experience));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Re-sync the form whenever the modal opens with a (different) record.
  useEffect(() => {
    if (open) {
      setForm(toForm(experience));
      setError(null);
      setFieldErrors({});
    }
  }, [open, experience]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({});
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const body = {
      company: form.company,
      role: form.role,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate || null,
      type: form.type,
    };

    try {
      if (experience) {
        await apiRequest<unknown>("/api/experiences", {
          method: "PUT",
          body: { id: experience.id, ...body },
        });
      } else {
        await apiRequest<unknown>("/api/experiences", { method: "POST", body });
      }

      onSaved();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        setFieldErrors(e.fields);
      } else {
        setError("Failed to save the quest");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={experience ? "Edit quest" : "New quest"}
      size="lg"
      saveLabel="Save quest"
      error={Object.keys(fieldErrors).length === 0 ? error : null}
      onSave={handleSave}
      saving={saving}
    >
      <Input
        label="Company"
        placeholder="Enter company name…"
        value={form.company}
        required
        error={fieldErrors.company}
        onChange={(e) => updateField("company", e.target.value)}
      />
      <Input
        label="Role"
        placeholder="e.g., Senior Full-Stack Developer"
        value={form.role}
        required
        error={fieldErrors.role}
        onChange={(e) => updateField("role", e.target.value)}
      />
      <Textarea
        label="Description"
        placeholder="Responsibilities and achievements…"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
        rows={3}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Start date"
          type="month"
          value={form.startDate}
          required
          error={fieldErrors.startDate}
          onChange={(e) => updateField("startDate", e.target.value)}
        />
        <Input
          label="End date"
          type="month"
          value={form.endDate}
          error={fieldErrors.endDate}
          onChange={(e) => updateField("endDate", e.target.value)}
          placeholder="Leave empty for present"
        />
      </div>
      <Select
        label="Type"
        value={form.type}
        onChange={(e) => updateField("type", e.target.value as FormData["type"])}
        options={[
          { value: "work", label: "Work" },
          { value: "education", label: "Education" },
          { value: "freelance", label: "Freelance" },
        ]}
      />
    </FormModal>
  );
}
