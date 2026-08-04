"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/ui/form-modal";

/**
 * TestimonialFormModal — create/edit testimonial modal for the dashboard
 * testimonial archive.
 *
 * Extracted from dashboard/testimonials page so the whole form (fields +
 * save logic) can be lazy-loaded as its own chunk via next/dynamic — it
 * only renders when the operator opens the modal, keeping the archive
 * grid's initial bundle small. Data comes from the API (POST/PUT
 * /api/testimonials).
 */

export interface TestimonialFormRecord {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  order: number;
}

type FormData = {
  name: string;
  role: string;
  content: string;
  avatar: string;
  order: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  role: "",
  content: "",
  avatar: "",
  order: "0",
};

function toForm(t: TestimonialFormRecord | null): FormData {
  if (!t) return EMPTY_FORM;
  return {
    name: t.name,
    role: t.role,
    content: t.content,
    avatar: t.avatar,
    order: String(t.order),
  };
}

interface TestimonialFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Testimonial being edited, or null for a new one. */
  testimonial: TestimonialFormRecord | null;
  /** Called after a successful save so the parent can refetch + close. */
  onSaved: () => void;
}

export function TestimonialFormModal({
  open,
  onClose,
  testimonial,
  onSaved,
}: TestimonialFormModalProps) {
  const [form, setForm] = useState<FormData>(() => toForm(testimonial));
  const [saving, setSaving] = useState(false);

  // Re-sync the form whenever the modal opens with a (different) record.
  useEffect(() => {
    if (open) setForm(toForm(testimonial));
  }, [open, testimonial]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        role: form.role,
        content: form.content,
        avatar: form.avatar,
        order: parseInt(form.order, 10) || 0,
      };

      if (testimonial) {
        await fetch("/api/testimonials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: testimonial.id, ...body }),
        });
      } else {
        await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      onSaved();
    } catch (e) {
      console.error("Failed to save testimonial", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={testimonial ? "EDIT TESTIMONIAL" : "NEW TESTIMONIAL"}
      sysId={
        testimonial
          ? `DASH//05 // ${testimonial.id.slice(0, 8)}`
          : "DASH//05 // NEW"
      }
      saveLabel="SAVE TESTIMONIAL"
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="FIELD_01 // NAME"
          placeholder="Client or colleague name..."
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <Input
          label="FIELD_02 // ROLE"
          placeholder="e.g., CTO at Company"
          value={form.role}
          onChange={(e) => updateField("role", e.target.value)}
        />
      </div>
      <Textarea
        label="FIELD_03 // TESTIMONIAL CONTENT"
        placeholder="What did they say about your work?..."
        value={form.content}
        onChange={(e) => updateField("content", e.target.value)}
        rows={4}
      />
      <Input
        label="FIELD_04 // AVATAR URL"
        placeholder="https://example.com/avatar.jpg"
        value={form.avatar}
        onChange={(e) => updateField("avatar", e.target.value)}
      />
      <Input
        label="FIELD_05 // ORDER"
        type="number"
        placeholder="0"
        value={form.order}
        onChange={(e) => updateField("order", e.target.value)}
      />
    </FormModal>
  );
}
