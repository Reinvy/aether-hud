"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Save,
  RefreshCw,
  Globe,
  MapPin,
  Tag,
  Mail,
  Code2,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useData } from "@/lib/use-data";
import { DashboardFormSkeleton } from "@/components/ui/skeleton";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

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
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <User className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">DASHBOARD // PROFILE CONTROL</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              Manage <span className="text-gradient-gold">Profile</span>
            </h1>
          </div>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "DEPLOYING..." : "DEPLOY CHANGES"}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <motion.div {...fadeInUp}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smile className="h-4 w-4 text-gold-400" />
                <CardTitle>Personal Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="FIELD_01 // DISPLAY NAME"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Your name"
              />
              <Input
                label="FIELD_02 // TAGLINE"
                value={form.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="Full-Stack Developer & AI Engineer"
              />
              <Input
                label="FIELD_03 // EMAIL NODE"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="hello@aether-hud.dev"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="FIELD_04 // LOCATION"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="Jakarta, Indonesia"
                />
                <Input
                  label="FIELD_05 // SYS VERSION"
                  value={form.sysVersion}
                  onChange={(e) => updateField("sysVersion", e.target.value)}
                  placeholder="v2.4.1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="FIELD_06 // STATUS"
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  placeholder="ONLINE"
                />
                <Input
                  label="FIELD_07 // AVATAR URL"
                  value={form.avatar}
                  onChange={(e) => updateField("avatar", e.target.value)}
                  placeholder="/placeholder.svg"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bio */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card variant="glass" hover="none" className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-gold-400" />
                <CardTitle>Bio / Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <label className="sys-label mb-2 block text-text-muted">FIELD_08 // BIO</label>
              <textarea
                className="input-recessed w-full resize-none px-4 py-2.5 text-sm font-body"
                rows={10}
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="System bio..."
              />
              <p className="mt-2 sys-label text-[9px] text-text-muted">
                Markdown supported. Displayed in the Hero terminal section.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Card */}
        <motion.div className="lg:col-span-2" {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gold-400" />
                <CardTitle>Profile Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-6">
                {/* Avatar placeholder */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400/30 bg-deep-space">
                  <User className="h-7 w-7 text-gold-400/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-bold tracking-[0.08em] text-text-main">
                    {form.name || "DISPLAY NAME"}
                  </h3>
                  <p className="font-mono text-xs text-gold-400/80">{form.tagline || "TAGLINE"}</p>
                  <div className="mt-2 flex flex-wrap gap-4">
                    {form.location && (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
                        <MapPin className="h-3 w-3" /> {form.location}
                      </span>
                    )}
                    {form.email && (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
                        <Mail className="h-3 w-3" /> {form.email}
                      </span>
                    )}
                    {form.sysVersion && (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
                        <Tag className="h-3 w-3" /> {form.sysVersion}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${form.status === "ONLINE" ? "bg-hud-active" : "bg-hud-warning"}`} />
                  <span className="sys-label-active text-[9px]">{form.status || "ONLINE"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
            <RefreshCw className="h-4 w-4" />
            {saving ? "DEPLOYING..." : "DEPLOY"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
