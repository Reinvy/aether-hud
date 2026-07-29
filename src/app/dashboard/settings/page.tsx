"use client";

import { motion } from "framer-motion";
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  User,
  Mail,
  Bell,
  Shield,
  Palette,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PORTFOLIO_CONFIG } from "@/lib/constants";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

export default function DashboardSettings() {
  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">DASHBOARD // CONFIGURATION</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              System <span className="text-gradient-gold">Settings</span>
            </h1>
          </div>
          <Button variant="primary" size="sm">
            <Save className="h-4 w-4" />
            DEPLOY CHANGES
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <motion.div {...fadeInUp}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gold-400" />
                <CardTitle>Profile Config</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="DISPLAY NAME"
                defaultValue={PORTFOLIO_CONFIG.name}
              />
              <Input
                label="TAGLINE"
                defaultValue={PORTFOLIO_CONFIG.tagline}
              />
              <Input
                label="EMAIL NODE"
                defaultValue={PORTFOLIO_CONFIG.email}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="LOCATION"
                  defaultValue={PORTFOLIO_CONFIG.location}
                />
                <Input
                  label="SYS VERSION"
                  defaultValue={PORTFOLIO_CONFIG.sysVersion}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-gold-400" />
                <CardTitle>Appearance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme preset */}
              <div>
                <span className="sys-label mb-3 block">THEME PRESET</span>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: "OBSIDIAN", colors: "bg-deep-space border-gold-400" },
                    { name: "NIGHT OPS", colors: "bg-surface-primary border-stellar-400" },
                    { name: "TITANIUM", colors: "bg-deep-space border-platinum-100" },
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      className={`flex items-center gap-2 rounded border-2 px-4 py-3 text-xs font-mono tracking-wider transition-all ${theme.colors} ${
                        theme.name === "OBSIDIAN"
                          ? "border-gold-400 bg-[rgba(242,201,76,0.06)] text-gold-400"
                          : "border-border-subtle text-text-muted hover:border-border-glass"
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-gold-400" />
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animation toggle */}
              <div className="flex items-center justify-between rounded border border-border-subtle px-4 py-3">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-4 w-4 text-gold-400/60" />
                  <div>
                    <p className="font-mono text-xs tracking-wider text-text-main">ANIMATIONS</p>
                    <p className="font-mono text-[9px] text-text-muted">Framer Motion effects</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="h-5 w-9 rounded-full border border-border-glass bg-deep-space after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-gold-400 after:transition-all peer-checked:after:translate-x-full peer-checked:bg-[rgba(242,201,76,0.2)]" />
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gold-400" />
                <CardTitle>Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded border border-border-subtle px-4 py-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-hud-active" />
                  <div>
                    <p className="font-mono text-xs tracking-wider text-text-main">TWO-FACTOR AUTH</p>
                    <p className="font-mono text-[9px] text-text-muted">Additional security layer</p>
                  </div>
                </div>
                <Badge variant="gold" size="sm">ENABLED</Badge>
              </div>

              <div className="flex items-center justify-between rounded border border-border-subtle px-4 py-3">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-gold-400/60" />
                  <div>
                    <p className="font-mono text-xs tracking-wider text-text-main">SESSION TIMEOUT</p>
                    <p className="font-mono text-[9px] text-text-muted">Auto-logout after inactivity</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-text-muted">30 MIN</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <Card variant="glass" hover="none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-400" />
                <CardTitle>Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "DEPLOYMENT ALERTS", desc: "When new version is deployed" },
                { label: "CONTACT FORM", desc: "When someone sends a message" },
                { label: "SYSTEM UPDATES", desc: "Framework and dependency updates" },
              ].map((notif) => (
                <div
                  key={notif.label}
                  className="flex items-center justify-between rounded border border-border-subtle px-4 py-3"
                >
                  <div>
                    <p className="font-mono text-xs tracking-wider text-text-main">{notif.label}</p>
                    <p className="font-mono text-[9px] text-text-muted">{notif.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="h-5 w-9 rounded-full border border-border-glass bg-deep-space after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-gold-400 after:transition-all peer-checked:after:translate-x-full peer-checked:bg-[rgba(242,201,76,0.2)]" />
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deploy Button */}
      <motion.div className="mt-8 text-center" {...fadeInUp}>
        <div className="glass-panel chamfered-sm inline-flex items-center gap-4 px-8 py-4">
          <Globe className="h-5 w-5 text-gold-400" />
          <div className="text-left">
            <p className="font-mono text-xs font-medium tracking-wider text-text-main">
              Configuration Ready for Deployment
            </p>
            <p className="font-mono text-[9px] text-text-muted">
              Changes are applied immediately after deploy
            </p>
          </div>
          <Button variant="primary" size="md">
            <RefreshCw className="h-4 w-4" />
            DEPLOY
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
