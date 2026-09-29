"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  Save,
  User,
} from "lucide-react";
import { ActionError } from "@/components/ui/action-error";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { ProfilePreviewCard } from "@/components/features/profile/profile-preview-card";
import { PersonalInfoCard } from "@/components/features/profile/personal-info-card";
import { BioCard } from "@/components/features/profile/bio-card";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardFormSkeleton } from "@/components/ui/skeleton";
import { ApiError, apiRequest } from "@/lib/api-client";
import type { ConfigDto } from "@/lib/dto";

export default function DashboardProfile() {
  const { data: config, loading, error: loadError, refetch } = useData<ConfigDto>("/api/config");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    email: "",
    location: "",
    edition: "",
    bio: "",
    status: "",
    avatar: "",
  });

  // Sync form when config loads
  useEffect(() => {
    if (config && !initialized) {
      setForm({
        name: config.name || "",
        tagline: config.tagline || "",
        email: config.email || "",
        location: config.location || "",
        edition: config.edition || "",
        bio: config.bio || "",
        status: config.status || "ONLINE",
        avatar: config.avatar || "",
      });
      setInitialized(true);
    }
  }, [config, initialized]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await apiRequest<ConfigDto>("/api/config", { method: "PUT", body: form });
      refetch();
    } catch (e) {
      setSaveError(
        e instanceof ApiError ? e.message : "The traveler dossier could not be saved"
      );
    } finally {
      setSaving(false);
    }
  }

  // Skeleton only on first paint — a refetch after a save keeps the current
  // dossier on screen instead of flashing the placeholder.
  if (loading && config === null) {
    return <DashboardFormSkeleton />;
  }

  // A failed load renders the widget error with its own retry instead of a
  // misleading empty dossier form.
  if (loadError !== null) {
    return (
      <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
        <DashboardPageHeader
          icon={User}
          eyebrow="TRAVELER DOSSIER"
          title="Manage Profile"
          titleHighlight="Profile"
        />
        <WidgetError label="Traveler dossier" message={loadError} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={User}
        eyebrow="TRAVELER DOSSIER"
        title="Manage Profile"
        titleHighlight="Profile"
      />

      {/* Mutation failures use the single shared action banner. */}
      {saveError !== null && <ActionError message={saveError} className="mb-6" />}

      {/* Profile panels — widget-level error boundary keeps a failing
          panel from blanking the whole view. */}
      <ErrorBoundary section="profile-panels" fallback={<WidgetError label="Traveler dossier" />}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info — reusable identity fields card */}
        <motion.div {...fadeInUp}>
          <PersonalInfoCard form={form} onFieldChange={updateField} />
        </motion.div>

        {/* Bio — reusable summary editor card */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <BioCard value={form.bio} onChange={(value) => updateField("bio", value)} />
        </motion.div>

        {/* Preview Card — reusable live identity readout */}
        <motion.div className="lg:col-span-2" {...fadeInUp} transition={{ delay: 0.2 }}>
          <ProfilePreviewCard
            data={{
              name: form.name,
              tagline: form.tagline,
              location: form.location,
              email: form.email,
              edition: form.edition,
              status: form.status,
            }}
          />
        </motion.div>
      </div>
      </ErrorBoundary>

      {/* Save bar */}
      <motion.div className="mt-8 text-center" {...fadeInUp}>
        <div className="codex-card codex-radius-card inline-flex items-center gap-4 px-8 py-4">
          <Save className="h-5 w-5 text-gold-ink" aria-hidden="true" />
          <div className="text-left">
            <p className="font-display text-xs font-semibold tracking-wider text-leather-dark">
              Traveler dossier ready to save
            </p>
            <p className="font-body text-[11px] text-leather-muted">
              Changes are applied to the codex as soon as they are saved
            </p>
          </div>
          <Button variant="primary" size="md" onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
