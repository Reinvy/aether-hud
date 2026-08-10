"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import { User } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { WidgetError } from "@/components/ui/widget-error";
import { HudLoader } from "@/components/ui/hud-loader";
import { DashboardListSkeleton } from "@/components/ui/skeleton";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import {
  SocialLinksCard,
  type ApiSocial,
} from "@/components/features/contact/social-links-card";
import {
  ContactConfigCard,
  type ApiConfig,
} from "@/components/features/contact/contact-config-card";

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

/**
 * DashboardContact — thin orchestrator for the hero & contact control page.
 *
 * The two panels (social links list + contact config form) live in reusable
 * sub-components under src/components/features/contact/; this view owns the
 * data fetching, modal/delete state and the panel grid layout.
 */
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
          <SocialLinksCard
            socials={socialList}
            onAdd={openNewSocial}
            onEdit={openEditSocial}
            onDelete={setDeleteTarget}
          />
        </motion.div>

        {/* === CONTACT CONFIG === */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <ContactConfigCard
            config={config}
            email={editEmail}
            onEmailChange={(value) => {
              setEditEmail(value);
              setEditEmailDirty(true);
            }}
            onSave={handleSaveConfig}
            saving={savingConfig}
          />
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
