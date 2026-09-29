import { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";
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
  const activeSegments = Math.round((level / 100) * segments);

  return (
    <div className="group space-y-2.5 p-3.5 codex-card codex-radius-card codex-lift transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="hover-scale-sm w-8 h-8 rounded-full bg-leather-caramel/15 border border-leather-caramel/35 flex items-center justify-center p-1.5 shadow-inner">
            <Icon className="h-4 w-4 text-leather-caramel transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="font-serif text-xs tracking-wide text-leather-dark font-bold group-hover:text-leather-caramel transition-colors block">
              {name}
            </span>
            <span className="codex-label">
              {category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "font-serif text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5",
              isCrowned
                ? "bg-leather-caramel text-parchment-base shadow-sm"
                : "bg-leather-caramel/15 text-leather-dark border border-leather-caramel/25",
            )}
          >
            {isCrowned && (
              <div className="codex-icon-plate h-7 w-7 shrink-0">
                <Image
                  src={GENSHIN_UI_ICONS.crown}
                  alt="Crown of Insight"
                  width={16}
                  height={16}
                  className="codex-icon-on-plate h-4 w-4 object-contain"
                  unoptimized
                />
              </div>
            )}
            <span>{isCrowned ? "Crowned Lv. 10" : `Lv. ${talentLevel}`}</span>
          </div>
          <span className="font-body text-xs text-leather-caramel font-bold tabular-nums">
            {level}%
          </span>
        </div>
      </div>
      {/* Segment Bar */}
      <div
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${level}%`}
        className="segment-bar"
      >
        {Array.from({ length: segments }).map((_, i) => {
          const isActive = i < activeSegments;
          return (
            <motion.div
              key={i}
              className={cn("segment", isActive && "active")}
              initial={isActive ? { opacity: 0.35, scaleY: 0.6 } : false}
              whileInView={isActive ? { opacity: 1, scaleY: 1 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            />
          );
        })}
      </div>
    </div>
  );
});
