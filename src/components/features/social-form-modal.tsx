"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
 * failing silently. Display order is owned by the link list's reorder
 * controls, so new links append with `nextOrder`.
 */

type FormData = {
  platform: string;
  url: string;
  icon: string;
};

const EMPTY_FORM: FormData = {
  platform: "",
  url: "",
  icon: "Globe",
};

function toForm(social: SocialDto | null): FormData {
  if (!social) return EMPTY_FORM;
  return {
    platform: social.platform,
    url: social.url,
    icon: social.icon,
  };
}

interface SocialFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Social link being edited, or null for a new link. */
  social: SocialDto | null;
  /** Order value a new link appends with — the last position in the list. */
  nextOrder: number;
  /** Called after a successful save so the parent can refetch + close. */
  onSaved: () => void;
}

export function SocialFormModal({
  open,
  onClose,
  social,
  nextOrder,
  onSaved,
}: SocialFormModalProps) {
  const [form, setForm] = useState<FormData>(() => toForm(social));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-sync the form whenever the modal opens with a (different) social.
  useEffect(() => {
    if (open) {
      setForm(toForm(social));
      setError(null);
    }
  }, [open, social]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const body = {
        platform: form.platform,
        url: form.url,
        icon: form.icon,
      };

      if (social) {
        await apiRequest("/api/socials", {
          method: "PUT",
          body: { id: social.id, ...body },
        });
      } else {
        await apiRequest("/api/socials", {
          method: "POST",
          body: { ...body, order: nextOrder },
        });
      }

      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to save social link");
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
      error={error}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Platform"
          placeholder="e.g. GitHub"
          value={form.platform}
          onChange={(e) => updateField("platform", e.target.value)}
        />
        <Select
          label="Icon"
          value={form.icon}
          onChange={(e) => updateField("icon", e.target.value)}
          options={[
            { value: "Globe", label: "Globe — website / LinkedIn" },
            { value: "GitBranch", label: "GitBranch — GitHub" },
            { value: "GitFork", label: "GitFork — GitLab" },
            { value: "MessageCircle", label: "MessageCircle — Twitter / Discord / Threads" },
            { value: "MessageSquare", label: "MessageSquare — Reddit / forum" },
            { value: "Mail", label: "Mail — direct email" },
            { value: "Send", label: "Send — Telegram" },
            { value: "Video", label: "Video — YouTube / Vimeo" },
            { value: "Camera", label: "Camera — Instagram" },
            { value: "Music", label: "Music — TikTok" },
            { value: "Code", label: "Code — Dev.to / Hashnode" },
            { value: "BookOpen", label: "BookOpen — Medium / Substack" },
            { value: "MonitorPlay", label: "MonitorPlay — Twitch / Kick" },
            { value: "Palette", label: "Palette — Dribbble / Behance" },
            { value: "Heart", label: "Heart — sponsors / Patreon" },
            { value: "Coffee", label: "Coffee — Ko-fi / Buy Me a Coffee" },
            { value: "AtSign", label: "AtSign — Bluesky / Mastodon / Farcaster" },
            { value: "Rss", label: "Rss — RSS feed" },
            { value: "Link2", label: "Link2 — generic link" },
          ]}
        />
      </div>
      <Input
        label="URL"
        placeholder="https://github.com/username"
        value={form.url}
        onChange={(e) => updateField("url", e.target.value)}
      />
    </FormModal>
  );
}
