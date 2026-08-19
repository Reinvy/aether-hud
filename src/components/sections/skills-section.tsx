"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInView } from "@/lib/motion-variants";
import { Globe } from "lucide-react";
import { useData } from "@/lib/use-data";
import { SectionHeading } from "@/components/features/section-heading";
import { SkillBar } from "@/components/features/skill-bar";
import { SkillsArraySkeleton } from "@/components/ui/section-skeleton";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

type Skill = {
  id: string;
  name: string;
  level: number; // 0-100
  category: string;
  icon: string;
  order: number;
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.05 },
};

export function SkillsSection() {
  const { data: skills, loading } = useData<Skill[]>("/api/skills");

  const categoryStats = useMemo(() => {
    if (!skills || skills.length === 0) {
      return [];
    }
    const map: Record<string, { total: number; count: number }> = {};
    for (const s of skills) {
      const cat = s.category === "AI" ? "AI/ML" : s.category;
      if (!map[cat]) map[cat] = { total: 0, count: 0 };
      map[cat].total += s.level;
      map[cat].count += 1;
    }
    return Object.entries(map).map(([cat, val]) => ({
      label: cat,
      pct: Math.round(val.total / val.count),
    }));
  }, [skills]);

  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-35" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="TALENTS & CONSTELLATIONS // VISIONS"
          icon={
            <div className="w-4 h-4 relative">
              <Image
                src={GENSHIN_UI_ICONS.talents}
                alt="Talents Icon"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
          }
          title="Talents &"
          highlight="Constellations"
          subtitle="Elemental proficiencies and character talent trees across seven digital domains."
        />

        {/* Skills Grid Container */}
        <motion.div
          className="mt-12 mx-auto max-w-4xl"
          {...stagger}
        >
          <div className="parchment-panel dark:glass-panel chamfered p-6 sm:p-8 border-2 border-leather-caramel/30 dark:border-gold-400/30 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-leather-caramel/20 dark:border-gold-400/20">
              <div className="w-5 h-5 relative">
                <Image
                  src={GENSHIN_UI_ICONS.talents}
                  alt="Talents Tree"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="font-display text-xs tracking-widest text-leather-caramel dark:text-gold-400 font-bold uppercase">
                TALENT TREE // ACTIVE CONSTELLATIONS
              </span>
              <span className="ml-auto font-mono text-[10px] text-leather-muted dark:text-text-muted tabular-nums">
                {loading ? "SCANNING ARRAY…" : `${skills?.length ?? 0} TALENTS ACTIVE`}
              </span>
            </div>

            {loading && (
              <SkillsArraySkeleton rows={6} />
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {skills?.map((skill) => (
                <motion.div
                  key={skill.id}
                  variants={{
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <SkillBar
                    name={skill.name}
                    level={skill.level}
                    icon={skill.icon}
                    category={skill.category}
                  />
                </motion.div>
              ))}
            </div>

            {!loading && skills?.length === 0 && (
              <div className="flex justify-center py-8">
                <span className="font-mono text-xs text-leather-muted dark:text-text-muted">NO TALENT DATA AVAILABLE</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Radar / Category Summary Overview */}
        {categoryStats.length > 0 && (
          <motion.div
            className="mt-10 mx-auto max-w-2xl text-center"
            {...fadeInView}
          >
            <div className="parchment-panel-strong dark:glass-panel-strong chamfered-sm p-6 border border-leather-caramel/20 dark:border-gold-400/20 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-leather-caramel dark:text-gold-400" aria-hidden="true" />
                <span className="font-display text-xs tracking-wider text-leather-caramel dark:text-gold-400 font-bold uppercase">
                  ELEMENTAL RESONANCE // CATEGORY AVERAGE
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4">
                {categoryStats.map((stat) => (
                  <div key={stat.label} className="text-center min-w-[80px] p-2.5 chamfered-xs bg-parchment-subtle/80 dark:bg-surface-primary/40 border border-leather-caramel/25 dark:border-gold-400/15 shadow-sm">
                    <div className="text-2xl font-bold font-display text-leather-dark dark:text-gold-400 tabular-nums">
                      {stat.pct}%
                    </div>
                    <div className="font-mono text-[9px] text-leather-muted dark:text-text-muted mt-1 uppercase font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
