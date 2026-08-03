"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  Settings2,
  Save,
  RefreshCw,
  Globe,
  Monitor,
  Code2,
  Eye,
  Palette,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardFormSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";


interface ApiConfig {
  siteName: string;
  siteDescription: string;
  themePreset: string;
  animationsEnabled: boolean;
  sysVersion: string;
  id: string;
}

const THEME_PRESETS = [
  { key: "obsidian", name: "OBSIDIAN", desc: "Deep space & imperial gold", color: "bg-gold-400" },
  { key: "night-ops", name: "NIGHT OPS", desc: "Dark tactical & stellar blue", color: "bg-stellar-400" },
  { key: "titanium", name: "TITANIUM", desc: "Platinum & silver frost", color: "bg-platinum-100" },
];

export default function DashboardSettings() {
  const { data: config, loading, refetch } = useData<ApiConfig>("/api/config");
  const [saving, setSaving] = useState(false);
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
      refetch();
    } catch (e) {
      console.error("Failed to save web config", e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <DashboardFormSkeleton />;
  }

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Site Identity */}
        <motion.div {...fadeInUp}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gold-400" />
                <CardTitle>Site Identity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="FIELD_01 // SITE NAME"
                value={form.siteName}
                onChange={(e) => updateField("siteName", e.target.value)}
                placeholder="AETHER-HUD"
              />
              <div>
                <label className="sys-label mb-2 block text-text-muted">FIELD_02 // SITE DESCRIPTION</label>
                <textarea
                  className="input-recessed w-full resize-none px-4 py-2.5 text-sm font-body"
                  rows={3}
                  value={form.siteDescription}
                  onChange={(e) => updateField("siteDescription", e.target.value)}
                  placeholder="High-End Tactical Portfolio"
                />
                <p className="mt-1 sys-label text-[9px] text-text-muted">
                  Used for SEO meta tags and social sharing
                </p>
              </div>
              <Input
                label="FIELD_03 // SYS VERSION"
                value={form.sysVersion}
                onChange={(e) => updateField("sysVersion", e.target.value)}
                placeholder="v2.4.1"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme & Appearance */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-gold-400" />
                <CardTitle>Theme & Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Presets */}
              <div>
                <span className="sys-label mb-3 block">FIELD_04 // THEME PRESET</span>
                <div className="grid grid-cols-1 gap-3">
                  {THEME_PRESETS.map((theme) => (
                    <button
                      key={theme.key}
                      onClick={() => updateField("themePreset", theme.key)}
                      className={cn(
                        "flex items-center gap-4 rounded border-2 px-4 py-3 text-left transition-all",
                        form.themePreset === theme.key
                          ? "border-gold-400 bg-[rgba(242,201,76,0.06)]"
                          : "border-border-subtle text-text-muted hover:border-border-glass"
                      )}
                    >
                      <span className={cn("h-4 w-4 rounded-full", theme.color)} />
                      <div className="flex-1">
                        <p className={cn(
                          "font-mono text-xs font-medium tracking-wider",
                          form.themePreset === theme.key ? "text-gold-400" : "text-text-main"
                        )}>
                          {theme.name}
                        </p>
                        <p className="font-mono text-[9px] text-text-muted">{theme.desc}</p>
                      </div>
                      {form.themePreset === theme.key && (
                        <Badge variant="gold" size="sm">ACTIVE</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animations Toggle */}
              <div className="flex items-center justify-between rounded border border-border-subtle px-4 py-3">
                <div className="flex items-center gap-3">
                  <Monitor className="h-4 w-4 text-gold-400/60" />
                  <div>
                    <p className="font-mono text-xs tracking-wider text-text-main">FIELD_05 // ANIMATIONS</p>
                    <p className="font-mono text-[9px] text-text-muted">Framer Motion effects</p>
                  </div>
                </div>
                <Toggle
                  id="animations-toggle"
                  checked={form.animationsEnabled}
                  onChange={(v) => updateField("animationsEnabled", v)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Info */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-gold-400" />
                <CardTitle>System Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded border border-border-subtle px-4 py-3">
                <span className="font-mono text-xs text-text-muted">FRAMEWORK</span>
                <span className="font-mono text-xs text-text-main">Next.js 16</span>
              </div>
              <div className="flex items-center justify-between rounded border border-border-subtle px-4 py-3">
                <span className="font-mono text-xs text-text-muted">DATABASE</span>
                <span className="font-mono text-xs text-stellar-400">PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between rounded border border-border-subtle px-4 py-3">
                <span className="font-mono text-xs text-text-muted">DEPLOY</span>
                <span className="font-mono text-xs text-text-main">Vercel</span>
              </div>
              <div className="flex items-center justify-between rounded border border-border-subtle px-4 py-3">
                <span className="font-mono text-xs text-text-muted">DESIGN SYSTEM</span>
                <span className="font-mono text-xs text-gold-400">AETHER-HUD v2</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-hud-danger" />
                <CardTitle className="text-hud-danger">Danger Zone</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-mono text-[10px] text-text-muted leading-relaxed">
                These actions are irreversible. Proceed with caution.
              </p>
              <div className="flex items-center justify-between rounded border border-hud-danger/30 px-4 py-3">
                <div>
                  <p className="font-mono text-xs tracking-wider text-text-main">RESET ALL DATA</p>
                  <p className="font-mono text-[9px] text-text-muted">Clear all portfolio content</p>
                </div>
                <Button variant="secondary" size="sm" glow="none" className="text-hud-danger border-hud-danger/30">
                  <RefreshCw className="h-3.5 w-3.5" />
                  RESET
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
    </div>
  );
}
