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
import { portfolioData } from "@/data/portfolio";
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

export default function DashboardSkills() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(portfolioData.skills.map((s) => s.category))];
  const filtered = activeCategory
    ? portfolioData.skills.filter((s) => s.category === activeCategory)
    : portfolioData.skills;

  return (
    <div className="dashboard-grid-bg min-h-full p-6 lg:p-8">
      {/* Header */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">DASHBOARD // SKILL MATRIX</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-main">
              Manage <span className="text-gradient-gold">Proficiencies</span>
            </h1>
          </div>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
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
              ? "bg-[rgba(242,201,76,0.12)] border-border-glass text-gold-400"
              : "text-text-muted border-border-subtle hover:border-border-glass"
          )}
        >
          ALL // {portfolioData.skills.length}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={cn(
              "tech-badge px-3 py-1.5 text-[10px] font-mono tracking-wider transition-all",
              activeCategory === cat
                ? "bg-[rgba(242,201,76,0.12)] border-border-glass text-gold-400"
                : "text-text-muted border-border-subtle hover:border-border-glass"
            )}
          >
            {cat.toUpperCase()} // {portfolioData.skills.filter((s) => s.category === cat).length}
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
                      <div className="flex items-center justify-center w-10 h-10 rounded border border-border-glass bg-deep-space/50">
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
                    <span className="font-display text-xl font-bold text-gold-400 tabular-nums">
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
                    <Button variant="ghost" size="sm" glow="none" className="p-1.5">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" glow="none" className="p-1.5 text-hud-danger">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add Skill Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="NEW SKILL MODULE" sysId="DASH//02 // NEW">
        <div className="space-y-4">
          <Input label="FIELD_01 // SKILL NAME" placeholder="e.g., React Native" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="FIELD_02 // CATEGORY" placeholder="Frontend" />
            <Input label="FIELD_03 // LEVEL (0-100)" type="number" placeholder="85" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="primary" size="sm">
              CALIBRATE
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
