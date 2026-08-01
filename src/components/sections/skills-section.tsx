"use client";

import { motion } from "framer-motion";
import { Cpu, Globe } from "lucide-react";
import { useData } from "@/lib/use-data";
import { SectionHeading } from "@/components/features/section-heading";
import { SkillBar } from "@/components/features/skill-bar";

type Skill = {
  id: string;
  name: string;
  level: number; // 0-100
  category: string;
  icon: string;
  order: number;
};

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.05 },
};

export function SkillsSection() {
  const { data: skills, loading } = useData<Skill[]>("/api/skills");

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
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                  <span className="sys-label text-xs text-text-muted">LOADING SKILLS...</span>
                </div>
              </div>
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

        {/* Radar / Hex graph placeholder */}
        <motion.div
          className="mt-12 mx-auto max-w-md text-center"
          {...fadeInUp}
        >
          <div className="glass-panel chamfered-sm p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-gold-400" />
              <span className="sys-label-gold">SYSTEM OVERVIEW // ACTIVE</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {["Frontend", "Backend", "AI/ML", "DevOps", "Design"].map((cat) => (
                <div key={cat} className="text-center">
                  <div className="text-2xl font-bold text-gradient-gold font-display">
                    {cat === "Frontend" ? "92" : cat === "Backend" ? "86" : cat === "AI/ML" ? "80" : cat === "DevOps" ? "82" : "85"}
                  </div>
                  <div className="sys-label text-[9px]">{cat} // PCT</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
