"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { AlertCircle, Save, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { useData } from "@/lib/use-data";
import { useMotionPrefs } from "@/components/motion-provider";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardFormSkeleton } from "@/components/ui/skeleton";
import { CodexLoader } from "@/components/ui/codex-loader";
import { SiteIdentityCard } from "@/components/features/settings/site-identity-card";
import { AppearanceCard } from "@/components/features/settings/appearance-card";
import { SystemInfoCard } from "@/components/features/settings/system-info-card";
import { DangerZoneCard } from "@/components/features/settings/danger-zone-card";
import { ApiError, apiRequest } from "@/lib/api-client";
import type { ConfigDto } from "@/lib/dto";

const ConfirmDialog = dynamic(
  () =>
    import("@/components/ui/confirm-dialog").then((m) => ({
      default: m.ConfirmDialog,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-space/80 backdrop-blur-sm">
        <CodexLoader label="Opening confirmation" size="md" />
      </div>
    ),
  }
);

export default function DashboardSettings() {
  const { data: config, loading, error: loadError, refetch } = useData<ConfigDto>("/api/config");
  const { setAnimationsEnabled, syncConfig } = useMotionPrefs();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [form, setForm] = useState({
    siteName: "",
    siteDescription: "",
    animationsEnabled: true,
    edition: "",
  });

  useEffect(() => {
    if (config && !initialized) {
      setForm({
        siteName: config.siteName || "Teyvat Codex",
        siteDescription: config.siteDescription || "",
        animationsEnabled: config.animationsEnabled !== false,
        edition: config.edition || "Teyvat Codex Edition",
      });
      setInitialized(true);
    }
  }, [config, initialized]);

  function updateField(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await apiRequest<ConfigDto>("/api/config", { method: "PUT", body: form });
      setAnimationsEnabled(form.animationsEnabled);
      syncConfig();
      refetch();
    } catch (e) {
      setSaveError(
        e instanceof ApiError ? e.message : "The realm settings could not be saved"
      );
    } finally {
      setSaving(false);
    }
  }

  const handleResetData = useCallback(async () => {
    setResetting(true);
    setResetError(null);
    try {
      await apiRequest<{ success: boolean; message: string }>("/api/config/reset", {
        method: "POST",
      });
      setConfirmResetOpen(false);
      setSaveError(null);
      setAnimationsEnabled(true);
      syncConfig();
      setInitialized(false);
      refetch();
    } catch (e) {
      // A 503 (static-data mode) must read as the server's own message, not
      // as a successful reset — the dialog stays open with the reason.
      setResetError(
        e instanceof ApiError ? e.message : "The codex data could not be reset"
      );
    } finally {
      setResetting(false);
    }
  }, [refetch, setAnimationsEnabled, syncConfig]);

  if (loading) {
    return <DashboardFormSkeleton />;
  }

  return (
    <div className="codex-grid-bg min-h-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Settings2}
        eyebrow="REALM SETTINGS"
        title="Codex Settings"
        titleHighlight="Settings"
        actions={
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save changes
          </Button>
        }
      />

      {/* Fetch and save failures are reported to the operator instead of
          leaving a silently stale settings form on screen. */}
      {(loadError || saveError) && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 codex-radius-sm border border-hud-danger/40 bg-hud-danger/5 px-4 py-3 dark:bg-hud-danger/10"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-hud-danger" aria-hidden="true" />
          <p className="font-body text-xs text-hud-danger">
            {saveError ?? loadError}
          </p>
        </div>
      )}

      {/* Settings panels — widget-level error boundary keeps a failing
          panel from blanking the whole view. Each panel is a reusable
          sub-component; the view is the thin orchestrator (state + save). */}
      <ErrorBoundary section="settings-panels" fallback={<WidgetError label="REALM SETTINGS" />}>
      <div className="grid gap-6 lg:grid-cols-2">
        <SiteIdentityCard
          values={{
            siteName: form.siteName,
            siteDescription: form.siteDescription,
            edition: form.edition,
          }}
          onChange={(field, value) => updateField(field, value)}
        />

        <AppearanceCard
          animationsEnabled={form.animationsEnabled}
          onAnimationsChange={(enabled) => updateField("animationsEnabled", enabled)}
          delay={0.1}
        />

        <SystemInfoCard delay={0.2} />

        <DangerZoneCard
          delay={0.3}
          onReset={() => {
            setResetError(null);
            setConfirmResetOpen(true);
          }}
          resetting={resetting}
        />
      </div>
      </ErrorBoundary>

      {/* Save bar */}
      <motion.div className="mt-8 text-center" {...fadeInUp}>
        <div className="codex-card codex-radius-sm inline-flex items-center gap-4 px-8 py-4">
          <Save className="h-5 w-5 text-gold-400" aria-hidden="true" />
          <div className="text-left">
            <p className="font-display text-xs font-semibold tracking-wider text-text-main dark:text-platinum-50">
              Settings ready to save
            </p>
            <p className="font-body text-[11px] text-text-muted dark:text-platinum-200">
              Theme and identity changes apply as soon as they are saved
            </p>
          </div>
          <Button variant="primary" size="md" onClick={handleSave} loading={saving}>
            Save
          </Button>
        </div>
      </motion.div>

      {/* Reset Confirmation Dialog */}
      {confirmResetOpen && (
        <ConfirmDialog
          open
          onClose={() => setConfirmResetOpen(false)}
          title="Reset all codex data"
          message={
            <>
              This replaces every custom record with the authored seed: domains, talents,
              quests, allies, codex pages and settings.
              <br />
              This action cannot be undone.
              {resetError && (
                <p role="alert" className="mt-3 flex items-start gap-2 text-hud-danger">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {resetError}
                </p>
              )}
            </>
          }
          confirmLabel="Reset and re-seed"
          onConfirm={handleResetData}
          saving={resetting}
        />
      )}
    </div>
  );
}
