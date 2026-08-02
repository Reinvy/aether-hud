"use client";

import { Cpu, Zap, Globe, FileCode, Server, Database, Brain, Palette, PenTool, Container, Rocket } from "lucide-react";
import { SegmentBar } from "@/components/ui/segment-bar";

/**
 * SkillBar — reusable HUD segmented skill bar.
 *
 * Extracted from the skills section so the segment-bar visualization can
 * be reused across the site (landing skills matrix, dashboard skills
 * module) with the same Obsidian & Imperial Gold treatment.
 */

const skillIconMap: Record<string, React.ElementType> = {
  Globe, FileCode, Palette, Server, Database, Brain, Zap, Container, PenTool, Rocket,
};

interface SkillBarProps {
  name: string;
  /** 0-100 */
  level: number;
  icon: string;
  category: string;
  segments?: number;
}

export function SkillBar({ name, level, icon, category, segments = 10 }: SkillBarProps) {
  const Icon = skillIconMap[icon] || Zap;

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-gold-400/60" />
          <span className="font-mono text-xs tracking-wider text-text-main">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="sys-label text-[9px]">{category}</span>
          <span className="font-mono text-[10px] text-gold-400 tabular-nums">
            {level}%
          </span>
        </div>
      </div>
      {/* Segment Bar */}
      <SegmentBar value={level} segments={segments} />
    </div>
  );
}
