"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  User,
  Save,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { ProfilePreviewCard } from "@/components/features/profile/profile-preview-card";
import { PersonalInfoCard } from "@/components/features/profile/personal-info-card";
import { BioCard } from "@/components/features/profile/bio-card";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardFormSkeleton } from "@/components/ui/skeleton";


interface ApiConfig {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  status: string;
  sysVersion: string;
}

export default function DashboardProfile() {
  const { data: config, loading, refetch } = useData<ApiConfig>("/api/config");
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    email: "",
    location: "",
    sysVersion: "",
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
        sysVersion: config.sysVersion || "",
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
    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      refetch();
    } catch (e) {
      console.error("Failed to save profile", e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <DashboardFormSkeleton />;
  }

  return (
    <div className="dashboard-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={User}
        label="DASHBOARD // PROFILE CONTROL"
        title="Manage Profile"
        titleHighlight="Profile"
        actions={
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4" />
            DEPLOY CHANGES
          </Button>
        }
      />

      {/* Profile panels — widget-level error boundary keeps a failing
          panel from blanking the whole view. */}
      <ErrorBoundary section="profile-panels" fallback={<WidgetError label="PROFILE CONFIG" />}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info — reusable identity fields card */}
        <motion.div {...fadeInUp}>
          <PersonalInfoCard form={form} onFieldChange={updateField} />
        </motion.div>

        {/* Bio — reusable markdown editor card */}
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
              sysVersion: form.sysVersion,
              status: form.status,
            }}
          />
        </motion.div>
      </div>
      </ErrorBoundary>

      {/* Deploy Button */}
      <motion.div className="mt-8 text-center" {...fadeInUp}>
        <div className="glass-panel chamfered-sm inline-flex items-center gap-4 px-8 py-4">
          <RefreshCw className="h-5 w-5 text-gold-400" />
          <div className="text-left">
            <p className="font-mono text-xs font-medium tracking-wider text-text-main">
              Profile Ready for Deployment
            </p>
            <p className="font-mono text-[9px] text-text-muted">
              Changes are applied immediately after deploy
            </p>
          </div>
          <Button variant="primary" size="md" onClick={handleSave} loading={saving}>
            <RefreshCw className="h-4 w-4" />
            DEPLOY
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
