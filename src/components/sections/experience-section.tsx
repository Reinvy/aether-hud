"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15 dark:opacity-30" />

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
          <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-leather-caramel/50 via-leather-caramel/25 to-transparent dark:from-gold-400/50 dark:via-gold-400/25" />

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
                <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-leather-caramel/40 dark:border-gold-400/40 bg-parchment-base dark:bg-surface-primary transition-all duration-300 group-hover:scale-110 shadow-lg p-1.5">
                  <Image
                    src={GENSHIN_UI_ICONS.quests}
                    alt="Quest Node"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>

                {/* Node connector line */}
                <div className="absolute left-[20px] top-11 bottom-0 w-0.5 bg-leather-caramel/20 dark:bg-gold-400/20 group-last:hidden" />

                {/* Content card */}
                <div className="bg-[#FAF8F5] dark:bg-surface-primary/75 parchment-panel dark:glass-panel rounded-3xl p-6 sm:p-7 group-hover:border-leather-caramel/50 dark:group-hover:border-gold-400/50 transition-all duration-300 shadow-xl border-2 border-leather-caramel/30 dark:border-gold-400/25">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="px-3 py-0.5 rounded-full bg-leather-caramel/15 dark:bg-gold-400/15 border border-leather-caramel/30 dark:border-gold-400/30 text-[#2C1E14] dark:text-gold-400 text-[10px] font-serif font-bold tracking-wider uppercase">
                          {exp.type === "work" ? "GUILD APPOINTMENT" : exp.type === "education" ? "ACADEMY LORE" : "COMMISSION"}
                        </span>
                        
                        {/* Claimed Primogem & Mora Rewards Tag */}
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          <div className="w-3.5 h-3.5 relative">
                            <Image
                              src={GENSHIN_UI_ICONS.primogem}
                              alt="Primogem"
                              width={14}
                              height={14}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-mono text-[9px] text-emerald-800 dark:text-emerald-400 font-bold">
                            +60
                          </span>
                          <div className="w-3.5 h-3.5 relative ml-1">
                            <Image
                              src={GENSHIN_UI_ICONS.mora}
                              alt="Mora"
                              width={14}
                              height={14}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-mono text-[9px] text-amber-800 dark:text-amber-400 font-bold">
                            +25K
                          </span>
                        </div>
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#2C1E14] dark:text-platinum-50 uppercase group-hover:text-[#8C6239] dark:group-hover:text-gold-400 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="mt-0.5 font-mono text-xs tracking-wider text-[#8C6239] dark:text-gold-400 font-bold">
                        {exp.company}
                      </p>
                    </div>

                    {/* Date range */}
                    <div className="flex items-center gap-1.5 shrink-0 bg-[#F3EDDF] dark:bg-surface-primary px-3.5 py-1.5 rounded-full border border-leather-caramel/25 dark:border-gold-400/20 shadow-sm">
                      <div className="w-3.5 h-3.5 relative">
                        <Image
                          src={GENSHIN_UI_ICONS.time}
                          alt="Time"
                          width={14}
                          height={14}
                          className="object-contain"
                        />
                      </div>
                      <span className="font-mono text-xs text-[#2C1E14] dark:text-platinum-200 tracking-wider tabular-nums font-bold">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#2C1E14] dark:text-platinum-200 font-body font-medium">
                    {exp.description}
                  </p>

                  {/* Commission ID & Guild Wax Seal */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-leather-caramel/20 dark:border-gold-400/15">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 relative">
                        <Image
                          src={GENSHIN_UI_ICONS.achievements}
                          alt="Achievements"
                          width={14}
                          height={14}
                          className="object-contain"
                        />
                      </div>
                      <span className="font-mono text-[10px] tracking-widest text-[#8C6239] dark:text-text-muted uppercase font-bold">
                        COMMISSION // {String(index + 1).padStart(2, "0")} SEALED
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-serif text-[#8C6239] dark:text-gold-400 font-bold">
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
