"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import { RowActions } from "@/components/ui/row-actions";
import { SegmentBar } from "@/components/ui/segment-bar";
import { skillIcons } from "@/lib/skill-icons";

export interface SkillCardData {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
}

interface SkillCardProps {
  skill: SkillCardData;
  /** Grid position — drives the staggered enter animation delay. */
  index?: number;
  onEdit: (skill: SkillCardData) => void;
  onDelete: (skill: SkillCardData) => void;
}

/**
 * SkillCard — reusable proficiency module card for the dashboard skill
 * matrix (and any future skill readout).
 *
 * Composes the AETHER-HUD primitives (IconBox, Badge, SegmentBar,
 * RowActions) around the skill record. Extracted from skills-view so the
 * matrix view stays a thin data orchestrator; this card is the single
 * place that renders a proficiency module.
 */
export const SkillCard = memo(function SkillCard({ skill, index = 0, onEdit, onDelete }: SkillCardProps) {
  const Icon = skillIcons[skill.icon] || Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
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
              onEdit={() => onEdit(skill)}
              onDelete={() => onDelete(skill)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
