"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HudLoader } from "@/components/ui/hud-loader";
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
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 },
};

const typeIcons: Record<string, React.ElementType> = {
  work: Briefcase,
  education: GraduationCap,
  freelance: Briefcase,
};

export function ExperienceSection() {
  const { data: experiences, loading } = useData<Experience[]>("/api/experiences");

  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-10" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-violet" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="EXPERIENCE // TIMELINE"
          icon={<Briefcase className="mr-1.5 h-3.5 w-3.5" />}
          title="Mission"
          highlight="History"
          subtitle="A chronological record of deployed missions, operations, and system upgrades."
        />

        {/* Timeline */}
        <motion.div
          className="relative mt-14"
          {...stagger}
        >
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-gold-400/40 via-gold-400/20 to-transparent" />

          {loading && (
            <div className="flex justify-center py-12">
              <HudLoader label="LOADING TIMELINE" size="md" />
            </div>
          )}

          {experiences?.map((exp, index) => {
            const TypeIcon = typeIcons[exp.type] || Briefcase;
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
                <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center chamfered-sm border border-border-glass bg-surface-primary transition-all duration-300 group-hover:border-gold-400/40 group-hover:shadow-[0_0_16px_rgba(242,201,76,0.25)] group-hover:scale-110">
                  <TypeIcon className="h-4 w-4 text-gold-400 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_4px_rgba(242,201,76,0.6)]" />
                </div>

                {/* Node connector line */}
                <div className="absolute left-[19px] top-11 bottom-0 w-px bg-border-subtle group-last:hidden" />

                {/* Content card */}
                <div className="glass-panel chamfered p-6 group-hover:border-gold-400/30 transition-all duration-300 energy-sweep">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="gold" size="sm">
                          {exp.type === "work" ? (
                            <><Briefcase className="mr-1 h-3 w-3" /> WORK</>
                          ) : exp.type === "education" ? (
                            <><GraduationCap className="mr-1 h-3 w-3" /> EDUCATION</>
                          ) : (
                            <><Briefcase className="mr-1 h-3 w-3" /> FREELANCE</>
                          )}
                        </Badge>
                      </div>
                      <h3 className="font-display text-base font-bold tracking-wider text-text-main transition-colors duration-300 group-hover:text-gold-400">
                        {exp.role}
                      </h3>
                      <p className="mt-0.5 font-mono text-xs tracking-wider text-gold-400">
                        {exp.company}
                      </p>
                    </div>

                    {/* Date range */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Calendar className="h-3 w-3 text-text-muted/50" />
                      <span className="font-mono text-[10px] text-text-muted tracking-wider">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-text-muted font-body">
                    {exp.description}
                  </p>

                  {/* Sys ID */}
                  <div className="mt-4 flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-gold-400/40" />
                    <span className="sys-label text-[9px]">
                      MISSION // {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {!loading && experiences?.length === 0 && (
            <div className="flex justify-center py-12">
              <span className="sys-label text-xs text-text-muted">NO TIMELINE DATA AVAILABLE</span>
            </div>
          )}
        </motion.div>

        {/* Bottom sys node decoration */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <span className="sys-node" />
            <span className="sys-label text-[9px] text-text-muted/30">END OF TIMELINE // SYS_NODE</span>
            <span className="sys-node" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
