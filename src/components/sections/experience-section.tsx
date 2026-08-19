"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { ExperienceTimelineSkeleton } from "@/components/ui/section-skeleton";
import { useData } from "@/lib/use-data";
import { SectionHeading } from "@/components/features/section-heading";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

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

export function ExperienceSection() {
  const { data: experiences, loading } = useData<Experience[]>("/api/experiences");

  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-30" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="ADVENTURER HANDBOOK // DAILY COMMISSIONS"
          icon={
            <div className="w-4 h-4 relative">
              <Image
                src={GENSHIN_UI_ICONS.handbook}
                alt="Adventurer Handbook"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
          }
          title="Expedition"
          highlight="Chronicle"
          subtitle="A verified record of completed guild commissions, leadership roles, and technical expeditions across seven realms."
        />

        {/* Timeline */}
        <motion.div
          className="relative mt-14"
          {...stagger}
        >
          {/* Vertical guild line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-leather-caramel/50 via-leather-caramel/25 to-transparent dark:from-gold-400/50 dark:via-gold-400/25" />

          {loading && (
            <div className="pt-2">
              <ExperienceTimelineSkeleton rows={3} />
            </div>
          )}

          {experiences?.map((exp, index) => {
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
                {/* Timeline node with Quest Icon */}
                <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center chamfered-sm border-2 border-leather-caramel/40 dark:border-gold-400/40 bg-parchment-subtle dark:bg-surface-primary transition-all duration-300 group-hover:scale-110 shadow-lg p-1.5">
                  <Image
                    src={GENSHIN_UI_ICONS.quests}
                    alt="Quest Node"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>

                {/* Node connector line */}
                <div className="absolute left-[19px] top-11 bottom-0 w-px bg-leather-caramel/20 dark:bg-gold-400/20 group-last:hidden" />

                {/* Content card */}
                <div className="parchment-panel dark:glass-panel chamfered p-6 sm:p-7 group-hover:border-leather-caramel/50 dark:group-hover:border-gold-400/50 transition-all duration-300 shadow-xl border-2 border-leather-caramel/25 dark:border-gold-400/25">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 chamfered-xs bg-leather-caramel/15 dark:bg-gold-400/15 border border-leather-caramel/30 dark:border-gold-400/30 text-leather-dark dark:text-gold-400 text-[10px] font-mono font-bold tracking-wider uppercase">
                          {exp.type === "work" ? "GUILD APPOINTMENT" : exp.type === "education" ? "ACADEMY LORE" : "COMMISSION"}
                        </span>
                        
                        {/* Claimed Primogem & Mora Rewards Tag */}
                        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 chamfered-xs">
                          <div className="w-3 h-3 relative">
                            <Image
                              src={GENSHIN_UI_ICONS.primogem}
                              alt="Primogem"
                              width={12}
                              height={12}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                            +60
                          </span>
                          <div className="w-3 h-3 relative ml-1">
                            <Image
                              src={GENSHIN_UI_ICONS.mora}
                              alt="Mora"
                              width={12}
                              height={12}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-mono text-[9px] text-amber-600 dark:text-amber-400 font-bold">
                            +25K
                          </span>
                        </div>
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold tracking-wide text-leather-dark dark:text-platinum-50 uppercase group-hover:text-leather-caramel dark:group-hover:text-gold-400 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="mt-0.5 font-mono text-xs tracking-wider text-leather-caramel dark:text-gold-400 font-semibold">
                        {exp.company}
                      </p>
                    </div>

                    {/* Date range */}
                    <div className="flex items-center gap-1.5 shrink-0 bg-parchment-subtle dark:bg-surface-primary px-3 py-1.5 chamfered-xs border border-leather-caramel/25 dark:border-gold-400/20 shadow-sm">
                      <Calendar className="h-3.5 w-3.5 text-leather-caramel dark:text-text-muted" aria-hidden="true" />
                      <span className="font-mono text-xs text-leather-dark dark:text-platinum-200 tracking-wider tabular-nums font-semibold">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-leather-dark/90 dark:text-text-muted font-body">
                    {exp.description}
                  </p>

                  {/* Commission ID & Guild Wax Seal */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-leather-caramel/20 dark:border-gold-400/15">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-leather-caramel dark:text-gold-400" aria-hidden="true" />
                      <span className="font-mono text-[10px] tracking-widest text-leather-muted dark:text-text-muted uppercase font-semibold">
                        COMMISSION // {String(index + 1).padStart(2, "0")} SEALED
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-display text-leather-caramel dark:text-gold-400 font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>AR 60 GUILD RANK</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {!loading && experiences?.length === 0 && (
            <div className="flex justify-center py-12">
              <span className="font-mono text-xs text-leather-muted dark:text-text-muted">NO QUEST LOG DATA AVAILABLE</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
