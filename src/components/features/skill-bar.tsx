import { memo } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { SegmentBar } from "@/components/ui/segment-bar";
import { skillIcons } from "@/lib/skill-icons";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { cn } from "@/lib/utils";

interface SkillBarProps {
  name: string;
  /** 0-100 */
  level: number;
  icon: string;
  category: string;
  segments?: number;
}

/**
 * SkillBar — one talent row: discipline icon, talent name and its segment bar.
 *
 * The vision medallion for the row's category is rendered by the section that
 * groups the talents, so this row stays a single self-contained record.
 */
export const SkillBar = memo(function SkillBar({ name, level, icon, category, segments = 10 }: SkillBarProps) {
  const Icon = skillIcons[icon] || Sparkles;
  const talentLevel = Math.max(1, Math.min(10, Math.round(level / 10)));
  const isCrowned = talentLevel === 10;

  return (
    <div className="group space-y-2.5 p-3.5 rounded-2xl transition-all bg-parchment-base dark:bg-surface-primary hover:bg-parchment-subtle dark:hover:bg-surface-primary border-2 border-leather-caramel/25 dark:border-gold-400/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-leather-caramel/15 dark:bg-gold-400/15 border border-leather-caramel/35 dark:border-gold-400/35 flex items-center justify-center p-1.5 shadow-inner">
            <Icon className="h-4 w-4 text-leather-caramel dark:text-gold-400 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="font-serif text-xs tracking-wide text-leather-dark dark:text-platinum-50 font-bold group-hover:text-leather-caramel dark:group-hover:text-gold-400 transition-colors block">
              {name}
            </span>
            <span className="font-body text-[10px] font-semibold tracking-wider text-leather-muted dark:text-platinum-200 uppercase">
              {category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "font-serif text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5",
              isCrowned
                ? "bg-leather-caramel dark:bg-gold-400 text-parchment-base dark:text-deep-space shadow-sm"
                : "bg-leather-caramel/15 dark:bg-gold-400/15 text-leather-dark dark:text-platinum-50 border border-leather-caramel/25 dark:border-gold-400/25",
            )}
          >
            {isCrowned && (
              <div className="w-3.5 h-3.5 relative">
                <Image
                  src={GENSHIN_UI_ICONS.crown}
                  alt="Crown of Insight"
                  width={14}
                  height={14}
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <span>{isCrowned ? "Crowned Lv. 10" : `Lv. ${talentLevel}`}</span>
          </div>
          <span className="font-body text-xs text-leather-caramel dark:text-gold-400 font-bold tabular-nums">
            {level}%
          </span>
        </div>
      </div>
      {/* Segment Bar */}
      <SegmentBar value={level} segments={segments} />
    </div>
  );
});
