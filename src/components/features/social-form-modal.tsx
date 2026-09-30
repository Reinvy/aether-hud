"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FormModal } from "@/components/ui/form-modal";
import { ApiError, apiRequest } from "@/lib/api-client";
import type { SocialDto } from "@/lib/dto";

/**
 * SocialFormModal — create/edit social-link modal for the dashboard contact
 * page.
 *
 * Lazy-loaded as its own chunk via next/dynamic — it only renders when the
 * operator opens the modal. Writes go through the shared api-client so a
 * rejected save surfaces the server's message inside the modal instead of
 * failing silently. Display order is assigned by the server on create, so the
 * form never sends an `order`.
 */

type FormData = {
  platform: string;
  url: string;
};

const EMPTY_FORM: FormData = {
  platform: "",
  url: "",
};

function toForm(social: SocialDto | null): FormData {
  if (!social) return EMPTY_FORM;
  return {
    platform: social.platform,
    url: social.url,
  };
}

interface SocialFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Social link being edited, or null for a new link. */
  social: SocialDto | null;
  /** Called after a successful save so the parent can refetch + close. */
  onSaved: () => void;
}

export function SocialFormModal({
  open,
  onClose,
  social,
  onSaved,
}: SocialFormModalProps) {
  const [form, setForm] = useState<FormData>(() => toForm(social));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Re-sync the form whenever the modal opens with a (different) social.
  useEffect(() => {
    if (open) {
      setForm(toForm(social));
      setError(null);
      setFieldErrors({});
    }
  }, [open, social]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({});
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const body = {
        platform: form.platform,
        url: form.url,
      };

      if (social) {
        await apiRequest("/api/socials", {
          method: "PUT",
          body: { id: social.id, ...body },
        });
      } else {
        await apiRequest("/api/socials", {
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
        setError("Failed to save social link");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={social ? "Edit social link" : "New social link"}
      saveLabel="Save link"
      error={Object.keys(fieldErrors).length === 0 ? error : null}
      onSave={handleSave}
      saving={saving}
    >
      <Input
        label="Platform"
        placeholder="e.g. GitHub"
        value={form.platform}
        required
        error={fieldErrors.platform}
        onChange={(e) => updateField("platform", e.target.value)}
      />
      <Input
        label="URL"
        placeholder="https://github.com/username"
        value={form.url}
        required
        error={fieldErrors.url}
        onChange={(e) => updateField("url", e.target.value)}
      />
    </FormModal>
  );
}
