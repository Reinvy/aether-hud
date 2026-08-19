"use client";

import { memo } from "react";
import { Zap } from "lucide-react";
import { SegmentBar } from "@/components/ui/segment-bar";
import { skillIcons } from "@/lib/skill-icons";

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
    <div className="group skillbar-hover space-y-1.5 p-2 chamfered-xs transition-colors hover:bg-leather-caramel/5 dark:hover:bg-gold-400/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-leather-caramel dark:text-gold-400/80 transition-transform group-hover:scale-110" />
          <span className="font-mono text-xs tracking-wider text-leather-dark dark:text-platinum-100 font-semibold group-hover:text-leather-caramel dark:group-hover:text-gold-400 transition-colors">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="sys-label text-[9px] text-leather-muted dark:text-text-muted">{category}</span>
          <span className="font-mono text-xs text-leather-caramel dark:text-gold-400 font-bold tabular-nums">
            {level}%
          </span>
        </div>
      </div>
      {/* Segment Bar */}
      <SegmentBar value={level} segments={segments} />
    </div>
  );
});
