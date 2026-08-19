"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { fadeInView } from "@/lib/motion-variants";
import { Cpu, Globe } from "lucide-react";
import { useData } from "@/lib/use-data";
import { SectionHeading } from "@/components/features/section-heading";
import { SkillBar } from "@/components/features/skill-bar";
import { SkillsArraySkeleton } from "@/components/ui/section-skeleton";

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
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.05 },
};

export function SkillsSection() {
  const { data: skills, loading } = useData<Skill[]>("/api/skills");

  const categoryStats = useMemo(() => {
    if (!skills || skills.length === 0) {
      return [
        { label: "Frontend", pct: 92 },
        { label: "Backend", pct: 86 },
        { label: "AI/ML", pct: 88 },
        { label: "DevOps", pct: 82 },
        { label: "Language", pct: 85 },
      ];
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
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-10" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-violet" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="SKILLS MATRIX // ATTRIBUTE"
          icon={<Cpu className="mr-1.5 h-3.5 w-3.5" />}
          title="Combat"
          highlight="Proficiencies"
          subtitle="Technical attributes and system capabilities — HUD segment display."
        />

        {/* Skills Grid */}
        <motion.div
          className="mt-14 mx-auto max-w-4xl"
          {...stagger}
        >
          <div className="glass-panel chamfered p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-subtle">
              <Cpu className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">
                SKILL ARRAY // SEGMENTED DATA
              </span>
              <span className="ml-auto sys-label">
                {skills ? `${skills.length} MODULES LOADED` : "LOADING..."}
              </span>
            </div>

            {loading && (
              <SkillsArraySkeleton rows={6} />
            )}

            <div className="grid gap-6 sm:grid-cols-2">
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
                <span className="sys-label text-xs text-text-muted">NO SKILL DATA AVAILABLE</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Radar / Hex graph overview */}
        <motion.div
          className="mt-12 mx-auto max-w-2xl text-center"
          {...fadeInView}
        >
          <div className="glass-panel chamfered-sm p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">SYSTEM OVERVIEW // ACTIVE</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {categoryStats.map((stat) => (
                <div key={stat.label} className="text-center min-w-[70px]">
                  <div className="text-2xl font-bold text-gradient-gold font-display">
                    {stat.pct}
                  </div>
                  <div className="sys-label text-[9px]">{stat.label} // PCT</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
