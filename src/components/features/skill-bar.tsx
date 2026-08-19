"use client";

import { memo } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { SegmentBar } from "@/components/ui/segment-bar";
import { skillIcons } from "@/lib/skill-icons";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

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
    <div className="group space-y-2.5 p-3.5 rounded-2xl transition-all bg-[#FFFFFF] dark:bg-surface-primary/70 hover:bg-[#FAF7EE] dark:hover:bg-gold-400/10 border-2 border-leather-caramel/30 dark:border-gold-400/20 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-leather-caramel/15 dark:bg-gold-400/15 border border-leather-caramel/35 dark:border-gold-400/30 flex items-center justify-center p-1.5 shadow-inner">
            <Icon className="h-4 w-4 text-[#8C6239] dark:text-gold-400 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="font-display text-xs tracking-wide text-[#1E1208] dark:text-platinum-50 font-bold group-hover:text-[#8C6239] dark:group-hover:text-gold-400 transition-colors block">
              {name}
            </span>
            <span className="font-mono text-[9px] text-[#5E412A] dark:text-text-muted font-bold">
              {category} // TALENT
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`font-display text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
            isCrowned
              ? "bg-[#8C6239] text-[#FAF7EE] dark:bg-gold-400 dark:text-deep-space shadow-sm"
              : "bg-leather-caramel/15 text-[#1E1208] dark:bg-gold-400/10 dark:text-gold-400 border border-leather-caramel/25 dark:border-gold-400/20"
          }`}>
            {isCrowned && (
              <div className="w-3.5 h-3.5 relative">
                <Image
                  src={GENSHIN_UI_ICONS.crown}
                  alt="Crown of Insight"
                  width={14}
                  height={14}
                  className="object-contain"
                />
              </div>
            )}
            <span>{isCrowned ? "CROWNED LV.10" : `LV. ${talentLevel}`}</span>
          </div>
          <span className="font-mono text-xs text-[#8C6239] dark:text-gold-400 font-bold tabular-nums">
            {level}%
          </span>
        </div>
      </div>
      {/* Segment Bar */}
      <SegmentBar value={level} segments={segments} />
    </div>
  );
});
