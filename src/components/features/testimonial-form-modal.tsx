"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/ui/form-modal";
import { ApiError, apiRequest } from "@/lib/api-client";
import type { TestimonialDto } from "@/lib/dto";

/**
 * TestimonialFormModal — create/edit testimonial modal for the dashboard
 * testimonial archive.
 *
 * Lazy-loaded as its own chunk via next/dynamic — it only renders when the
 * operator opens the modal. Writes go through the shared api-client so a
 * rejected save surfaces the server's message inside the modal instead of
 * failing silently. Display order is assigned by the server on create, so the
 * form never sends an `order`.
 */

type FormData = {
  name: string;
  role: string;
  content: string;
  avatar: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  role: "",
  content: "",
  avatar: "",
};

function toForm(t: TestimonialDto | null): FormData {
  if (!t) return EMPTY_FORM;
  return {
    name: t.name,
    role: t.role,
    content: t.content,
    avatar: t.avatar,
  };
}

interface TestimonialFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Testimonial being edited, or null for a new one. */
  testimonial: TestimonialDto | null;
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
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Re-sync the form whenever the modal opens with a (different) record.
  useEffect(() => {
    if (open) {
      setForm(toForm(testimonial));
      setError(null);
      setFieldErrors({});
    }
  }, [open, testimonial]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({});
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const body = {
        name: form.name,
        role: form.role,
        content: form.content,
        avatar: form.avatar,
      };

      if (testimonial) {
        await apiRequest("/api/testimonials", {
          method: "PUT",
          body: { id: testimonial.id, ...body },
        });
      } else {
        await apiRequest("/api/testimonials", {
          method: "POST",
          body,
        });
      }

      onSaved();
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        setFieldErrors(e.fields);
      } else {
        setError("Failed to save testimonial");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={testimonial ? "Edit testimonial" : "New testimonial"}
      saveLabel="Save testimonial"
      error={Object.keys(fieldErrors).length === 0 ? error : null}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          placeholder="Client or colleague name"
          value={form.name}
          required
          error={fieldErrors.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        <Input
          label="Role"
          placeholder="e.g. CTO at Company"
          value={form.role}
          onChange={(e) => updateField("role", e.target.value)}
        />
      </div>
      <Textarea
        label="Testimonial"
        placeholder="What did they say about your work?"
        value={form.content}
        required
        error={fieldErrors.content}
        onChange={(e) => updateField("content", e.target.value)}
        rows={4}
      />
      <Input
        label="Avatar URL"
        placeholder="https://example.com/avatar.jpg"
        value={form.avatar}
        onChange={(e) => updateField("avatar", e.target.value)}
      />
    </FormModal>
  );
}
