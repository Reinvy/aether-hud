"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Globe, FileCode, Server, Database, Brain, Palette, PenTool, Container, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { portfolioData } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Globe, FileCode, Palette, Server, Database, Brain, Zap, Container, PenTool, Rocket,
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

function SkillBar({ name, level, icon, category }: { name: string; level: number; icon: string; category: string }) {
  const segments = 10;
  const activeSegments = Math.round((level / 100) * segments);
  const Icon = iconMap[icon] || Zap;

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
      <div className="segment-bar">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "segment",
              i < activeSegments && "active",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-10" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-violet" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
          <Badge variant="gold" size="md" className="mb-4">
            <Cpu className="mr-1.5 h-3.5 w-3.5" />
            SKILLS MATRIX // ATTRIBUTE
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-[0.08em] text-text-main sm:text-4xl">
            Combat <span className="text-gradient-gold">Proficiencies</span>
          </h2>
          <p className="mt-4 text-lg text-text-muted font-body">
            Technical attributes and system capabilities — HUD segment display.
          </p>
        </motion.div>

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
              <span className="ml-auto sys-label">10 MODULES LOADED</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {portfolioData.skills.map((skill) => (
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
