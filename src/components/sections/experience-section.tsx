"use client";

import { motion } from "framer-motion";
import { Award, GraduationCap, Calendar, ShieldCheck, Briefcase } from "lucide-react";
import { ExperienceTimelineSkeleton } from "@/components/ui/section-skeleton";
import { useData } from "@/lib/use-data";
import { SectionHeading } from "@/components/features/section-heading";

type Experience = {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  type: "work" | "education" | "freelance";
  order: number;
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.1 },
};

const typeIcons: Record<string, React.ElementType> = {
  work: Award,
  education: GraduationCap,
  freelance: Briefcase,
};

export function ExperienceSection() {
  const { data: experiences, loading } = useData<Experience[]>("/api/experiences");

  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-30" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="ADVENTURER'S GUILD // QUEST LOG"
          icon={<Award className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
          title="Expedition"
          highlight="Chronicle"
          subtitle="A verified history of completed guild commissions, career milestones, and technical expeditions."
        />

        {/* Timeline */}
        <motion.div
          className="relative mt-14"
          {...stagger}
        >
          {/* Vertical guild line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-leather-caramel/40 via-leather-caramel/20 to-transparent dark:from-gold-400/40 dark:via-gold-400/20" />

          {loading && (
            <div className="pt-2">
              <ExperienceTimelineSkeleton rows={3} />
            </div>
          )}

          {experiences?.map((exp, index) => {
            const TypeIcon = typeIcons[exp.type] || Award;
            return (
              <motion.div
                key={exp.id}
                className="relative pl-14 pb-10 last:pb-0 group"
                variants={{
                  initial: { opacity: 0, x: -24 },
                  whileInView: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Timeline node */}
                <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center chamfered-sm border border-leather-caramel/35 dark:border-gold-400/40 bg-parchment-subtle dark:bg-surface-primary transition-all duration-300 group-hover:scale-110 shadow-md">
                  <TypeIcon className="h-4 w-4 text-leather-caramel dark:text-gold-400 transition-transform group-hover:scale-110" aria-hidden="true" />
                </div>

                {/* Node connector line */}
                <div className="absolute left-[19px] top-11 bottom-0 w-px bg-leather-caramel/20 dark:bg-gold-400/20 group-last:hidden" />

                {/* Content card */}
                <div className="parchment-panel dark:glass-panel chamfered p-6 group-hover:border-leather-caramel/40 dark:group-hover:border-gold-400/40 transition-all duration-300 shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 chamfered-xs bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/25 dark:border-gold-400/25 text-leather-dark dark:text-gold-400 text-[10px] font-mono font-bold tracking-wider uppercase">
                          {exp.type === "work" ? "GUILD MISSION" : exp.type === "education" ? "ACADEMY LORE" : "COMMISSION"}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold tracking-wide text-leather-dark dark:text-platinum-50 uppercase group-hover:text-leather-caramel dark:group-hover:text-gold-400 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="mt-0.5 font-mono text-xs tracking-wider text-leather-caramel dark:text-gold-400 font-semibold">
                        {exp.company}
                      </p>
                    </div>

                    {/* Date range */}
                    <div className="flex items-center gap-1.5 shrink-0 bg-leather-caramel/5 dark:bg-surface-primary px-3 py-1 chamfered-xs border border-leather-caramel/15 dark:border-gold-400/15">
                      <Calendar className="h-3.5 w-3.5 text-leather-muted dark:text-text-muted" aria-hidden="true" />
                      <span className="font-mono text-xs text-leather-dark dark:text-platinum-200 tracking-wider tabular-nums font-semibold">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-leather-muted dark:text-text-muted font-body">
                    {exp.description}
                  </p>

                  {/* Commission ID */}
                  <div className="mt-4 flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-leather-caramel/70 dark:text-gold-400/70" aria-hidden="true" />
                    <span className="font-mono text-[10px] tracking-widest text-leather-muted dark:text-text-muted uppercase">
                      COMMISSION // {String(index + 1).padStart(2, "0")} VERIFIED
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {!loading && experiences?.length === 0 && (
            <div className="flex justify-center py-12">
              <span className="sys-label text-xs text-leather-muted dark:text-text-muted">NO QUEST LOG DATA AVAILABLE</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
