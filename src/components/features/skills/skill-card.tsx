"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/components/ui/row-actions";
import { SegmentBar } from "@/components/ui/segment-bar";
import { skillIcons } from "@/lib/skill-icons";

export interface SkillCardData {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  order: number;
}

interface SkillCardProps {
  skill: SkillCardData;
  /** Grid position — drives the staggered enter animation delay. */
  index?: number;
  onEdit: (skill: SkillCardData) => void;
  onDelete: (skill: SkillCardData) => void;
  /** Renders the leading selection checkbox. */
  selectable?: boolean;
  /** Checked state of the selection checkbox. */
  selected?: boolean;
  /** Toggles selection for the card's id. */
  onSelect?: (id: string) => void;
  /**
   * Swaps this card with its neighbour in the parent's ordered list. Omitted
   * while the list is sorted or filtered, when a swap would not be visible.
   */
  onMove?: (id: string, direction: -1 | 1) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

/**
 * SkillCard — reusable proficiency module card for the dashboard skill
 * matrix (and any future skill readout).
 *
 * Composes the Teyvat Codex primitives (IconBox, Badge, SegmentBar,
 * RowActions) around the skill record, and carries the same selection +
 * reorder affordances as the project archive rows. Extracted from
 * skills-view so the matrix view stays a thin data orchestrator.
 */
export const SkillCard = memo(function SkillCard({
  skill,
  index = 0,
  onEdit,
  onDelete,
  selectable = false,
  selected = false,
  onSelect,
  onMove,
  canMoveUp = false,
  canMoveDown = false,
}: SkillCardProps) {
  const Icon = skillIcons[skill.icon] || Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="glass" hover="sweep" className="codex-card codex-radius-card skillbar-hover">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {selectable && (
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => onSelect?.(skill.id)}
                  aria-label={`Select ${skill.name}`}
                  className="h-4 w-4 shrink-0 cursor-pointer rounded-sm accent-gold-400 codex-focus"
                />
              )}
              <IconBox size="md">
                <Icon className="h-5 w-5 text-gold-ink" />
              </IconBox>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-medium tracking-wider text-leather-dark">
                  {skill.name}
                </p>
                <Badge variant="default" size="sm" className="mt-1">
                  {skill.category}
                </Badge>
              </div>
            </div>
            <span className="font-display text-xl font-bold tabular-nums text-gold-ink">
              {skill.level}%
            </span>
          </div>

          {/* Segment bar */}
          <SegmentBar value={skill.level} className="mt-4" />

          {/* Actions */}
          <div className="mt-4 flex items-center justify-end gap-1 border-t border-border-subtle pt-3">
            {onMove && (
              <div className="flex items-center">
                <IconButton
                  label={`Move ${skill.name} up`}
                  onClick={() => onMove(skill.id, -1)}
                  disabled={!canMoveUp}
                  className="disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton
                  label={`Move ${skill.name} down`}
                  onClick={() => onMove(skill.id, 1)}
                  disabled={!canMoveDown}
                  className="disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            )}
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
