"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Plus,
  Pencil,
  Trash2,
  Globe,
  FileCode,
  Server,
  Database,
  Brain,
  Zap,
  Container,
  PenTool,
  Rocket,
  Palette,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useData } from "@/lib/use-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Globe, FileCode, Palette, Server, Database, Brain, Zap, Container, PenTool, Rocket,
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

const categoryColors: Record<string, string> = {
  Frontend: "border-gold-400/40 text-gold-400",
  Language: "border-stellar-400/40 text-stellar-400",
  Backend: "border-gold-400/40 text-gold-400",
  Design: "border-stellar-400/40 text-stellar-400",
  DevOps: "border-gold-400/40 text-gold-400",
  AI: "border-gold-400/40 text-gold-400",
};

interface ApiSkill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
}

type FormData = {
  name: string;
  level: string;
  category: string;
  icon: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  level: "85",
  category: "",
  icon: "Zap",
};

export default function DashboardSkills() {
  const { data: skills, loading, refetch } = useData<ApiSkill[]>("/api/skills");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(skill: ApiSkill) {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      level: String(skill.level),
      category: skill.category,
      icon: skill.icon,
    });
    setModalOpen(true);
  }

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        level: parseInt(form.level, 10) || 0,
        category: form.category,
        icon: form.icon,
      };

      if (editingId) {
        await fetch("/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...body }),
        });
      } else {
        await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setModalOpen(false);
      refetch();
    } catch (e) {
      console.error("Failed to save skill", e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("PURGE SKILL MODULE? This action cannot be undone.")) return;
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      refetch();
    } catch (e) {
      console.error("Failed to delete skill", e);
    }
  }

  const skillList = skills ?? [];
  const categories = [...new Set(skillList.map((s) => s.category))];
  const filtered = activeCategory
    ? skillList.filter((s) => s.category === activeCategory)
    : skillList;

  if (loading) {
    return (
      <div className="dashboard-grid-bg flex min-h-full items-center justify-center p-6 lg:p-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          <p className="mt-4 font-mono text-xs text-text-muted">LOADING SKILL MATRIX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">DASHBOARD // SKILL MATRIX</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              Manage <span className="text-gradient-gold">Proficiencies</span>
            </h1>
          </div>
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            ADD SKILL
          </Button>
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div className="mb-6 flex flex-wrap gap-2" {...fadeInUp}>
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "tech-badge px-3 py-1.5 text-[10px] font-mono tracking-wider transition-all",
            !activeCategory
              ? "border-border-glass bg-[rgba(242,201,76,0.12)] text-gold-400"
              : "border-border-subtle text-text-muted hover:border-border-glass"
          )}
        >
          ALL // {skillList.length}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={cn(
              "tech-badge px-3 py-1.5 text-[10px] font-mono tracking-wider transition-all",
              activeCategory === cat
                ? "border-border-glass bg-[rgba(242,201,76,0.12)] text-gold-400"
                : "border-border-subtle text-text-muted hover:border-border-glass"
            )}
          >
            {cat.toUpperCase()} // {skillList.filter((s) => s.category === cat).length}
          </button>
        ))}
      </motion.div>

      {/* Skills Grid */}
      <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" {...fadeInUp}>
        {filtered.map((skill, i) => {
          const Icon = iconMap[skill.icon] || Cpu;
          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="glass" hover="sweep">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded border border-border-glass bg-deep-space/50">
                        <Icon className="h-5 w-5 text-gold-400/60" />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-medium tracking-wider text-text-main">
                          {skill.name}
                        </p>
                        <Badge variant="default" size="sm" className="mt-1">
                          {skill.category}
                        </Badge>
                      </div>
                    </div>
                    <span className="font-display text-xl font-bold tabular-nums text-gold-400">
                      {skill.level}%
                    </span>
                  </div>

                  {/* Segment bar */}
                  <div className="segment-bar mt-4">
                    {Array.from({ length: 10 }).map((_, segIdx) => (
                      <div
                        key={segIdx}
                        className={cn(
                          "segment",
                          segIdx < Math.round(skill.level / 10) && "active"
                        )}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-end gap-1 border-t border-border-subtle pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      glow="none"
                      className="p-1.5"
                      onClick={() => openEdit(skill)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      glow="none"
                      className="p-1.5 text-hud-danger"
                      onClick={() => handleDelete(skill.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add / Edit Skill Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "EDIT SKILL MODULE" : "NEW SKILL MODULE"}
        sysId={editingId ? `DASH//02 // ${editingId.slice(0, 8)}` : "DASH//02 // NEW"}
      >
        <div className="space-y-4">
          <Input
            label="FIELD_01 // SKILL NAME"
            placeholder="e.g., React Native"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="FIELD_02 // CATEGORY"
              placeholder="Frontend"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />
            <Input
              label="FIELD_03 // LEVEL (0-100)"
              type="number"
              min={0}
              max={100}
              placeholder="85"
              value={form.level}
              onChange={(e) => updateField("level", e.target.value)}
            />
          </div>
          <Input
            label="FIELD_04 // ICON"
            placeholder="Zap, Globe, FileCode, Palette, Server, Database, Brain, Container, PenTool, Rocket"
            value={form.icon}
            onChange={(e) => updateField("icon", e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              CANCEL
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "CALIBRATING..." : "CALIBRATE"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
