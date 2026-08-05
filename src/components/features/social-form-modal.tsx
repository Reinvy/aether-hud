"use client";

import { useEffect, useState } from "react";
import { Globe, GitBranch, MessageCircle, Mail, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormModal } from "@/components/ui/form-modal";

/**
 * SocialFormModal — create/edit social-link module modal for the dashboard
 * contact page.
 *
 * Extracted from dashboard/contact so the whole form (fields + save logic)
 * can be lazy-loaded as its own chunk via next/dynamic — it only renders
 * when the operator opens the modal, keeping the contact list's initial
 * bundle small. Data comes from the API (POST/PUT /api/socials).
 *
 * Mirrors the SkillFormModal/ExperienceFormModal/TestimonialFormModal
 * extraction pattern (PR #26) — this closes the last remaining inline
 * CRUD form in the dashboard.
 */

export interface SocialFormRecord {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

type FormData = {
  platform: string;
  url: string;
  icon: string;
  order: string;
};

const EMPTY_FORM: FormData = {
  platform: "",
  url: "",
  icon: "Globe",
  order: "0",
};

function toForm(social: SocialFormRecord | null): FormData {
  if (!social) return EMPTY_FORM;
  return {
    platform: social.platform,
    url: social.url,
    icon: social.icon,
    order: String(social.order),
  };
}

interface SocialFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Social link being edited, or null for a new link. */
  social: SocialFormRecord | null;
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

  // Re-sync the form whenever the modal opens with a (different) social.
  useEffect(() => {
    if (open) setForm(toForm(social));
  }, [open, social]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        platform: form.platform,
        url: form.url,
        icon: form.icon,
        order: parseInt(form.order, 10) || 0,
      };

      if (social) {
        await fetch("/api/socials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: social.id, ...body }),
        });
      } else {
        await fetch("/api/socials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      onSaved();
    } catch (e) {
      console.error("Failed to save social link", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={social ? "EDIT SOCIAL LINK" : "NEW SOCIAL LINK"}
      sysId={social ? `DASH//06 // ${social.id.slice(0, 8)}` : "DASH//06 // NEW"}
      saveLabel="SAVE LINK"
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="FIELD_01 // PLATFORM"
          placeholder="GitHub"
          value={form.platform}
          onChange={(e) => updateField("platform", e.target.value)}
        />
        <Input
          label="FIELD_02 // ICON"
          placeholder="Github, Globe, Twitter..."
          value={form.icon}
          onChange={(e) => updateField("icon", e.target.value)}
        />
      </div>
      <Input
        label="FIELD_03 // URL"
        placeholder="https://github.com/username"
        value={form.url}
        onChange={(e) => updateField("url", e.target.value)}
      />
      <Input
        label="FIELD_04 // ORDER"
        type="number"
        placeholder="0"
        value={form.order}
        onChange={(e) => updateField("order", e.target.value)}
      />
    </FormModal>
  );
}
