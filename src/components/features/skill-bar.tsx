"use client";

import { memo } from "react";
import { Sparkles } from "lucide-react";
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
  const Icon = skillIcons[icon] || Sparkles;
  const talentLevel = Math.max(1, Math.min(10, Math.round(level / 10)));
  const isCrowned = talentLevel === 10;

  return (
    <div className="group space-y-2 p-3 chamfered-xs transition-colors bg-leather-caramel/5 dark:bg-surface-primary/40 hover:bg-leather-caramel/10 dark:hover:bg-gold-400/10 border border-leather-caramel/20 dark:border-gold-400/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-leather-caramel/15 dark:bg-gold-400/15 border border-leather-caramel/30 dark:border-gold-400/30 flex items-center justify-center">
            <Icon className="h-3.5 w-3.5 text-leather-caramel dark:text-gold-400 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="font-display text-xs tracking-wide text-leather-dark dark:text-platinum-50 font-bold group-hover:text-leather-caramel dark:group-hover:text-gold-400 transition-colors block">
              {name}
            </span>
            <span className="font-mono text-[9px] text-leather-muted dark:text-text-muted">
              {category} // TALENT
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-mono text-[9px] px-2 py-0.5 chamfered-xs font-bold ${
            isCrowned
              ? "bg-leather-caramel text-parchment-base dark:bg-gold-400 dark:text-deep-space"
              : "bg-leather-caramel/10 text-leather-caramel dark:bg-gold-400/10 dark:text-gold-400"
          }`}>
            {isCrowned ? "CROWNED LV.10" : `LV. ${talentLevel}`}
          </span>
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
