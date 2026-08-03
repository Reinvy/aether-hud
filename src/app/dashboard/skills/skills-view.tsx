"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion-variants";
import {
  Cpu,
  Plus,
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
import { IconBox } from "@/components/ui/icon-box";
import { RowActions } from "@/components/ui/row-actions";
import { SegmentBar } from "@/components/ui/segment-bar";
import { CategoryFilter } from "@/components/features/category-filter";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useData } from "@/lib/use-data";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { DashboardListSkeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  Globe, FileCode, Palette, Server, Database, Brain, Zap, Container, PenTool, Rocket,
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
    return <DashboardListSkeleton rows={6} />;
  }

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <DashboardPageHeader
        icon={Cpu}
        label="DASHBOARD // SKILL MATRIX"
        title="Manage Proficiencies"
        titleHighlight="Proficiencies"
        actions={
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            ADD SKILL
          </Button>
        }
      />

      {/* Category Filters */}
      <motion.div className="mb-6" {...fadeInUp}>
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
          total={skillList.length}
          counts={Object.fromEntries(
            categories.map((cat) => [cat, skillList.filter((s) => s.category === cat).length])
          )}
        />
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
              <Card variant="glass" hover="sweep" diamond className="skillbar-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <IconBox size="md">
                        <Icon className="h-5 w-5 text-gold-400/60 transition-colors duration-300 group-hover:text-gold-400" />
                      </IconBox>
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
                  <SegmentBar value={skill.level} className="mt-4" />

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-end border-t border-border-subtle pt-3">
                    <RowActions
                      onEdit={() => openEdit(skill)}
                      onDelete={() => handleDelete(skill.id)}
                    />
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
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              CANCEL
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              CALIBRATE
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="FIELD_01 // SKILL NAME"
            placeholder="e.g., React Native"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </Modal>
    </div>
  );
}
