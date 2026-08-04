"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FormModal } from "@/components/ui/form-modal";

/**
 * ExperienceFormModal — create/edit experience record modal for the
 * dashboard experience log.
 *
 * Extracted from dashboard/experiences page so the whole form (fields +
 * save logic) can be lazy-loaded as its own chunk via next/dynamic — it
 * only renders when the operator opens the modal, keeping the log list's
 * initial bundle small. Data comes from the API (POST/PUT /api/experiences).
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

function toForm(exp: ExperienceFormRecord | null): FormData {
  if (!exp) return EMPTY_FORM;
  return {
    company: exp.company,
    role: exp.role,
    description: exp.description,
    startDate: exp.startDate ? exp.startDate.slice(0, 10) : "",
    endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
    type: exp.type,
    order: String(exp.order),
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

  // Re-sync the form whenever the modal opens with a (different) record.
  useEffect(() => {
    if (open) setForm(toForm(experience));
  }, [open, experience]);

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

      if (experience) {
        await fetch("/api/experiences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: experience.id, ...body }),
        });
      } else {
        await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      onSaved();
    } catch (e) {
      console.error("Failed to save experience", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={experience ? "EDIT EXPERIENCE RECORD" : "NEW EXPERIENCE RECORD"}
      sysId={
        experience
          ? `DASH//04 // ${experience.id.slice(0, 8)}`
          : "DASH//04 // NEW"
      }
      size="lg"
      saveLabel="SAVE RECORD"
      onSave={handleSave}
      saving={saving}
    >
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
        <Select
          label="FIELD_06 // TYPE"
          value={form.type}
          onChange={(e) => updateField("type", e.target.value as FormData["type"])}
          options={[
            { value: "work", label: "WORK" },
            { value: "education", label: "EDUCATION" },
            { value: "freelance", label: "FREELANCE" },
          ]}
        />
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
    </FormModal>
  );
}
