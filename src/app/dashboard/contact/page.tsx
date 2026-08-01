"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Plus,
  Pencil,
  Trash2,
  Link2,
  Mail,
  Globe,
  GitBranch,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useData } from "@/lib/use-data";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

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

type SocialFormData = {
  platform: string;
  url: string;
  icon: string;
  order: string;
};

const EMPTY_SOCIAL_FORM: SocialFormData = {
  platform: "",
  url: "",
  icon: "Globe",
  order: "0",
};

const iconMap: Record<string, React.ElementType> = {
  Globe, GitBranch, MessageCircle, Mail, Link2,
};

export default function DashboardContact() {
  const { data: socials, loading: socialsLoading, refetch: refetchSocials } = useData<ApiSocial[]>("/api/socials");
  const { data: config, loading: configLoading, refetch: refetchConfig } = useData<ApiConfig>("/api/config");

  // Social Links state
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialForm, setSocialForm] = useState<SocialFormData>(EMPTY_SOCIAL_FORM);
  const [savingSocial, setSavingSocial] = useState(false);

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
    setEditingSocialId(null);
    setSocialForm(EMPTY_SOCIAL_FORM);
    setSocialModalOpen(true);
  }

  function openEditSocial(s: ApiSocial) {
    setEditingSocialId(s.id);
    setSocialForm({
      platform: s.platform,
      url: s.url,
      icon: s.icon,
      order: String(s.order),
    });
    setSocialModalOpen(true);
  }

  function updateSocialField<K extends keyof SocialFormData>(key: K, value: SocialFormData[K]) {
    setSocialForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveSocial() {
    setSavingSocial(true);
    try {
      const body = {
        platform: socialForm.platform,
        url: socialForm.url,
        icon: socialForm.icon,
        order: parseInt(socialForm.order, 10) || 0,
      };

      if (editingSocialId) {
        await fetch("/api/socials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSocialId, ...body }),
        });
      } else {
        await fetch("/api/socials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setSocialModalOpen(false);
      refetchSocials();
    } catch (e) {
      console.error("Failed to save social link", e);
    } finally {
      setSavingSocial(false);
    }
  }

  async function handleDeleteSocial(id: string) {
    if (!confirm("PURGE SOCIAL LINK? This action cannot be undone.")) return;
    try {
      await fetch(`/api/socials/${id}`, { method: "DELETE" });
      refetchSocials();
    } catch (e) {
      console.error("Failed to delete social link", e);
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
    return (
      <div className="dashboard-grid-bg flex min-h-full items-center justify-center p-6 lg:p-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          <p className="mt-4 font-mono text-xs text-text-muted">LOADING CONTROLS...</p>
        </div>
      </div>
    );
  }

  const socialList = socials ?? [];

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gold-400" />
          <span className="sys-label-gold">DASHBOARD // HERO & CONTACT CONTROL</span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-[0.08em] text-text-main">
          Manage <span className="text-gradient-gold">Contact Configuration</span>
        </h1>
      </motion.div>

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
                <p className="py-8 text-center font-mono text-xs text-text-muted">
                  [EMPTY] // No social links configured
                </p>
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
                        className="group flex items-center justify-between rounded border border-border-subtle px-4 py-3 transition-all hover:border-border-glass hover:bg-glass-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded border border-border-glass bg-deep-space/50">
                            <Icon className="h-4 w-4 text-gold-400/60" />
                          </div>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            glow="none"
                            className="p-1.5"
                            onClick={() => openEditSocial(s)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            glow="none"
                            className="p-1.5 text-hud-danger hover:text-hud-danger"
                            onClick={() => handleDeleteSocial(s.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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

      {/* Social Link Modal */}
      <Modal
        open={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        title={editingSocialId ? "EDIT SOCIAL LINK" : "NEW SOCIAL LINK"}
        sysId={editingSocialId ? `DASH//01 // ${editingSocialId.slice(0, 8)}` : "DASH//01 // NEW"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="FIELD_01 // PLATFORM"
              placeholder="GitHub"
              value={socialForm.platform}
              onChange={(e) => updateSocialField("platform", e.target.value)}
            />
            <Input
              label="FIELD_02 // ICON"
              placeholder="Github, Globe, Twitter..."
              value={socialForm.icon}
              onChange={(e) => updateSocialField("icon", e.target.value)}
            />
          </div>
          <Input
            label="FIELD_03 // URL"
            placeholder="https://github.com/username"
            value={socialForm.url}
            onChange={(e) => updateSocialField("url", e.target.value)}
          />
          <Input
            label="FIELD_04 // ORDER"
            type="number"
            placeholder="0"
            value={socialForm.order}
            onChange={(e) => updateSocialField("order", e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSocialModalOpen(false)}
              disabled={savingSocial}
            >
              CANCEL
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveSocial} loading={savingSocial}>
              SAVE LINK
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
