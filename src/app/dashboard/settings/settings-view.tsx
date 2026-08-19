"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { Eye, RefreshCw, Save, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { useData } from "@/lib/use-data";
import { useTheme } from "@/components/theme-provider";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardFormSkeleton } from "@/components/ui/skeleton";
import { HudLoader } from "@/components/ui/hud-loader";
import { SiteIdentityCard } from "@/components/features/settings/site-identity-card";
import { ThemeAppearanceCard } from "@/components/features/settings/theme-appearance-card";
import { SystemInfoCard } from "@/components/features/settings/system-info-card";
import { DangerZoneCard } from "@/components/features/settings/danger-zone-card";

const ConfirmDialog = dynamic(
  () =>
    import("@/components/ui/confirm-dialog").then((m) => ({
      default: m.ConfirmDialog,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <HudLoader label="LOADING PURGE MODULE" size="md" />
      </div>
    ),
  }
);

interface ApiConfig {
  siteName: string;
  siteDescription: string;
  themePreset: string;
  animationsEnabled: boolean;
  sysVersion: string;
  id: string;
}

export default function DashboardSettings() {
  const { data: config, loading, refetch } = useData<ApiConfig>("/api/config");
  const { setThemePreset, setAnimationsEnabled } = useTheme();
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [form, setForm] = useState({
    siteName: "",
    siteDescription: "",
    themePreset: "obsidian",
    animationsEnabled: true,
    sysVersion: "",
  });

  useEffect(() => {
    if (config && !initialized) {
      setForm({
        siteName: config.siteName || "AETHER-HUD",
        siteDescription: config.siteDescription || "",
        themePreset: config.themePreset || "obsidian",
        animationsEnabled: config.animationsEnabled !== false,
        sysVersion: config.sysVersion || "v2.4.1",
      });
      setInitialized(true);
    }
  }, [config, initialized]);

  function updateField(key: string, value: string | boolean) {
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
      setThemePreset(form.themePreset);
      setAnimationsEnabled(form.animationsEnabled);
      refetch();
    } catch (e) {
      console.error("Failed to save web config", e);
    } finally {
      setSaving(false);
    }
  }

  const handleResetData = useCallback(async () => {
    setResetting(true);
    try {
      await fetch("/api/config/reset", {
        method: "POST",
      });
      setConfirmResetOpen(false);
      setThemePreset("obsidian");
      setAnimationsEnabled(true);
      setInitialized(false);
      refetch();
    } catch (e) {
      console.error("Failed to reset portfolio data", e);
    } finally {
      setResetting(false);
    }
  }, [refetch, setThemePreset, setAnimationsEnabled]);

  if (loading) {
    return <DashboardFormSkeleton />;
  }

  return (
    <div className="dashboard-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Settings2}
        label="DASHBOARD // WEB CONFIGURATION"
        title="Web Settings"
        titleHighlight="Settings"
        actions={
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4" />
            DEPLOY CHANGES
          </Button>
        }
      />

      {/* Settings panels — widget-level error boundary keeps a failing
          panel from blanking the whole view. Each panel is a reusable
          sub-component; the view is the thin orchestrator (state + save). */}
      <ErrorBoundary section="settings-panels" fallback={<WidgetError label="WEB CONFIG" />}>
      <div className="grid gap-6 lg:grid-cols-2">
        <SiteIdentityCard
          values={{
            siteName: form.siteName,
            siteDescription: form.siteDescription,
            sysVersion: form.sysVersion,
          }}
          onChange={(field, value) => updateField(field, value)}
        />

        <ThemeAppearanceCard
          themePreset={form.themePreset}
          animationsEnabled={form.animationsEnabled}
          onChange={(field, value) => updateField(field, value)}
          delay={0.1}
        />

        <SystemInfoCard delay={0.2} />

        <DangerZoneCard
          delay={0.3}
          onReset={() => setConfirmResetOpen(true)}
          resetting={resetting}
        />
      </div>
      </ErrorBoundary>

      {/* Deploy Button */}
      <motion.div className="mt-8 text-center" {...fadeInUp}>
        <div className="glass-panel chamfered-sm inline-flex items-center gap-4 px-8 py-4">
          <Eye className="h-5 w-5 text-gold-400" />
          <div className="text-left">
            <p className="font-mono text-xs font-medium tracking-wider text-text-main">
              Web Config Ready for Deployment
            </p>
            <p className="font-mono text-[9px] text-text-muted">
              Theme and site changes applied immediately
            </p>
          </div>
          <Button variant="primary" size="md" onClick={handleSave} loading={saving}>
            <RefreshCw className="h-4 w-4" />
            DEPLOY
          </Button>
        </div>
      </motion.div>

      {/* Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <ConfirmDialog
          open
          onClose={() => setConfirmResetOpen(false)}
          title="RESET ALL PORTFOLIO DATA"
          sysId="DASH//DANGER // PURGE_ALL"
          message={
            <>
              Warning: This operation will <span className="text-hud-danger font-bold">PURGE</span> all custom records
              and restore default projects, skills, sections, and configuration from the tactical dossier seed.
              <br />
              This action cannot be undone.
            </>
          }
          confirmLabel="PURGE & RE-SEED"
          onConfirm={handleResetData}
          saving={resetting}
        />
      )}
    </div>
  );
}
