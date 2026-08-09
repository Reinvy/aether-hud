"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  User,
  Plus,
  Link2,
  Mail,
  Globe,
  GitBranch,
  MessageCircle,
  MonitorPlay,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { IconBox } from "@/components/ui/icon-box";
import { Input } from "@/components/ui/input";
import { RowActions } from "@/components/ui/row-actions";
import { HudLoader } from "@/components/ui/hud-loader";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";

// Lazy-loaded social link form modal — own chunk, only loads on demand.
// Mirrors the SkillFormModal/ExperienceFormModal/TestimonialFormModal
// extraction pattern (PR #26). The loader overlay is fixed + z-50 so it
// sits above the modal backdrop while the chunk streams in.
const SocialFormModal = dynamic(
  () =>
    import("@/components/features/social-form-modal").then((m) => ({
      default: m.SocialFormModal,
    })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <HudLoader label="LOADING LINK MODULE" size="lg" />
      </div>
    ),
  }
);

// Deferred purge dialog — the confirm-dialog chunk is only fetched when
// the operator clicks a delete action, keeping it out of the initial
// controls bundle (mirrors the form-modal split above).
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


interface ApiSocial {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

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

const iconMap: Record<string, React.ElementType> = {
  Globe, GitBranch, MessageCircle, Mail, Link2, MonitorPlay, Palette,
};

export default function DashboardContact() {
  const { data: socials, loading: socialsLoading, refetch: refetchSocials } = useData<ApiSocial[]>("/api/socials");
  const { data: config, loading: configLoading, refetch: refetchConfig } = useData<ApiConfig>("/api/config");

  // Social Links state — record is null when creating a new link
  const [socialModal, setSocialModal] = useState<{
    open: boolean;
    record: ApiSocial | null;
  }>({ open: false, record: null });

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<ApiSocial | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Config state
  const [editEmail, setEditEmail] = useState("");
  const [editEmailDirty, setEditEmailDirty] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Sync config email when loaded
  if (config && !editEmailDirty) {
    setEditEmail(config.email);
    setEditEmailDirty(true); // mark as dirty to prevent re-sync
  }

  function openNewSocial() {
    setSocialModal({ open: true, record: null });
  }

  function openEditSocial(s: ApiSocial) {
    setSocialModal({ open: true, record: s });
  }

  async function handleDeleteSocial() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/socials/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      refetchSocials();
    } catch (e) {
      console.error("Failed to delete social link", e);
    } finally {
      setDeleting(false);
    }
  }

  async function handleSaveConfig() {
    setSavingConfig(true);
    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: editEmail }),
      });
      refetchConfig();
    } catch (e) {
      console.error("Failed to update config", e);
    } finally {
      setSavingConfig(false);
    }
  }

  if (socialsLoading || configLoading) {
    return <DashboardListSkeleton rows={4} />;
  }

  const socialList = socials ?? [];

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={User}
        label="DASHBOARD // HERO & CONTACT CONTROL"
        title="Manage Contact Configuration"
        titleHighlight="Contact Configuration"
      />

      {/* Social + Config panels — widget-level error boundary keeps a
          failing panel from blanking the whole view. */}
      <ErrorBoundary section="contact-panels" fallback={<WidgetError label="CONTACT CONFIG" />}>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* === SOCIAL LINKS === */}
        <motion.div {...fadeInUp}>
          <Card variant="glass" hover="none" className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-gold-400" />
                  <CardTitle>Social Links</CardTitle>
                </div>
                <Button variant="primary" size="sm" onClick={openNewSocial}>
                  <Plus className="h-4 w-4" />
                  ADD LINK
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {socialList.length === 0 ? (
                <EmptyState
                  icon={<Link2 className="h-5 w-5" />}
                  title="NETWORK OFFLINE"
                  message="No social links configured"
                  className="sm:col-span-1"
                />
              ) : (
                <div className="space-y-2">
                  {socialList.map((s, i) => {
                    const Icon = iconMap[s.icon] || Link2;
                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group relative flex items-center justify-between border border-border-subtle bg-deep-space/30 px-4 py-3 transition-all duration-300 hover:border-border-glass hover:bg-glass-200 hover-scale-sm"
                      >
                        {/* Diamond accent on hover — mirrors Card micro-interaction */}
                        <span className="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 rotate-45 border-t border-r border-border-glass opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-gold-400/40" />
                        <div className="flex items-center gap-3 min-w-0">
                          <IconBox>
                            <Icon className="h-4 w-4 text-gold-400/60" />
                          </IconBox>
                          <div>
                            <p className="font-mono text-xs font-medium tracking-wider text-text-main">
                              {s.platform}
                            </p>
                            <p className="mt-0.5 font-mono text-[9px] text-text-muted truncate max-w-[200px]">
                              {s.url}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="sys-label text-[8px]">#{s.order}</span>
                          <RowActions
                            onEdit={() => openEditSocial(s)}
                            onDelete={() => setDeleteTarget(s)}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* === CONTACT CONFIG === */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card variant="glass" hover="none" className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-400" />
                <CardTitle>Contact Config</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="FIELD_01 // DISPLAY NAME"
                value={config?.name ?? ""}
                disabled
              />
              <Input
                label="FIELD_02 // TAGLINE"
                value={config?.tagline ?? ""}
                disabled
              />
              <Input
                label="FIELD_03 // EMAIL ADDRESS"
                type="email"
                placeholder="hello@aether-hud.dev"
                value={editEmail}
                onChange={(e) => {
                  setEditEmail(e.target.value);
                  setEditEmailDirty(true);
                }}
              />
              <Input
                label="FIELD_04 // LOCATION"
                value={config?.location ?? ""}
                disabled
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="sys-label mb-2 block text-text-muted">
                    FIELD_05 // STATUS
                  </label>
                  <div className="input-recessed flex items-center gap-2 px-4 py-2.5">
                    <span className="led-active" />
                    <span className="font-mono text-xs text-stellar-400">{config?.status ?? "ONLINE"}</span>
                  </div>
                </div>
                <div>
                  <label className="sys-label mb-2 block text-text-muted">
                    FIELD_06 // SYS VERSION
                  </label>
                  <div className="input-recessed flex items-center px-4 py-2.5">
                    <span className="font-mono text-xs text-text-muted">{config?.sysVersion ?? "v2.4.1"}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveConfig}
                  loading={savingConfig}
                >
                  UPDATE EMAIL
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </ErrorBoundary>

      {/* Social Link Modal — lazy-loaded chunk (own bundle) */}
      <SocialFormModal
        open={socialModal.open}
        onClose={() => setSocialModal({ open: false, record: null })}
        social={socialModal.record}
        onSaved={() => {
          setSocialModal({ open: false, record: null });
          refetchSocials();
        }}
      />

      {/* Purge confirmation — deferred chunk, mounted only on delete */}
      {deleteTarget && (
        <ConfirmDialog
          open
          onClose={() => setDeleteTarget(null)}
          title="PURGE SOCIAL LINK"
          sysId={`DASH//SOC // ${deleteTarget.id}`}
          message={
            <>
              Target: <span className="text-gold-400">{deleteTarget.platform}</span>
              <br />
              This social link will be permanently removed from the network config.
            </>
          }
          confirmLabel="PURGE"
          onConfirm={handleDeleteSocial}
          saving={deleting}
        />
      )}
    </div>
  );
}
