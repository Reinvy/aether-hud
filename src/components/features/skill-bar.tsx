"use client";

import { memo } from "react";
import { Zap } from "lucide-react";
import { SegmentBar } from "@/components/ui/segment-bar";
import { skillIcons } from "@/lib/skill-icons";

/**
 * SkillBar — reusable HUD segmented skill bar.
 *
 * Extracted from the skills section so the segment-bar visualization can
 * be reused across the site (landing skills matrix, dashboard skills
 * module) with the same Obsidian & Imperial Gold treatment.
 */

interface SkillBarProps {
  name: string;
  /** 0-100 */
  level: number;
  icon: string;
  category: string;
  segments?: number;
}

export const SkillBar = memo(function SkillBar({ name, level, icon, category, segments = 10 }: SkillBarProps) {
  const Icon = skillIcons[icon] || Zap;

  return (
    <div className="group skillbar-hover">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-gold-400/60 transition-colors duration-300 group-hover:text-gold-400" />
          <span className="font-mono text-xs tracking-wider text-text-main transition-colors duration-300 group-hover:text-gold-300">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="sys-label text-[9px]">{category}</span>
          <span className="font-mono text-[10px] text-gold-400 tabular-nums transition-all duration-300 group-hover:text-gold-300 group-hover:drop-shadow-[0_0_4px_rgba(242,201,76,0.4)]">
            {level}%
          </span>
        </div>
      </div>
      {/* Segment Bar */}
      <SegmentBar value={level} segments={segments} />
    </div>
  );
});
