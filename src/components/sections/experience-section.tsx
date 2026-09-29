"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/features/section-heading";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import type { ExperienceDto, SectionDto } from "@/lib/dto";

interface ExperienceSectionProps {
  experiences: ExperienceDto[];
  section: SectionDto;
}

const AUTHORED = { title: "Expedition", highlight: "Chronicle" };

/** Guild register of every commission type the chronicle knows. */
const COMMISSION_LABEL: Record<string, string> = {
  work: "Guild Appointment",
  education: "Academy Lore",
  freelance: "Commission",
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.1 },
};

/**
 * ExperienceSection — the expedition chronicle, one sealed commission per
 * role. Presentation-only: the log is a prop from the server render.
 */
export function ExperienceSection({ experiences, section }: ExperienceSectionProps) {
  const sectionTitle = (section.title || "").trim();

  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="Adventurer Handbook // Daily Commissions"
          icon={
            <div className="codex-icon-plate h-7 w-7 shrink-0">
              <Image
                src={GENSHIN_UI_ICONS.handbook}
                alt="Adventurer Handbook"
                width={16}
                height={16}
                className="codex-icon-on-plate h-4 w-4 object-contain"
                unoptimized
              />
            </div>
          }
          title={sectionTitle || AUTHORED.title}
          highlight={sectionTitle ? undefined : AUTHORED.highlight}
          subtitle={
            section.subtitle ||
            "A verified record of completed guild commissions, leadership roles, and technical expeditions across seven realms."
          }
        />

        {/* Timeline */}
        <motion.div className="relative mt-14" {...stagger}>
          {/* Vertical guild line */}
          {experiences.length > 0 && (
            <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-leather-caramel/50 via-leather-caramel/25 to-transparent" />
          )}

          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className="relative pl-14 pb-10 last:pb-0 group"
              variants={{
                initial: { opacity: 0, x: -24 },
                whileInView: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Timeline node with Quest Icon */}
              <div className="codex-icon-plate absolute left-0 top-1 h-10 w-10 shrink-0 transition-all duration-300 group-hover:scale-110">
                <Image
                  src={GENSHIN_UI_ICONS.quests}
                  alt="Quest Node"
                  width={24}
                  height={24}
                  className="codex-icon-on-plate h-6 w-6 object-contain"
                  unoptimized
                />
              </div>

              {/* Node connector line */}
              <div className="absolute left-[20px] top-11 bottom-0 w-0.5 bg-leather-caramel/20 group-last:hidden" />

              {/* Commission card */}
              <div className="codex-card codex-radius-card p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="codex-badge">
                        {COMMISSION_LABEL[experience.type] ?? "Commission"}
                      </span>

                      {/* Primogem & Mora reward tally */}
                      <div className="flex items-center gap-1.5 bg-jade-400/10 border border-jade-400/30 px-2.5 py-0.5 rounded-full">
                        <span className="codex-icon-plate h-7 w-7 shrink-0">
                          <Image
                            src={GENSHIN_UI_ICONS.primogem}
                            alt=""
                            width={16}
                            height={16}
                            className="codex-icon-on-plate h-4 w-4 object-contain"
                            unoptimized
                          />
                        </span>
                        <span className="font-serif text-[10px] text-jade-ink font-bold">
                          Primogems +60
                        </span>
                        <span className="codex-icon-plate ml-1.5 h-7 w-7 shrink-0">
                          <Image
                            src={GENSHIN_UI_ICONS.mora}
                            alt=""
                            width={16}
                            height={16}
                            className="codex-icon-on-plate h-4 w-4 object-contain"
                            unoptimized
                          />
                        </span>
                        <span className="font-serif text-[10px] text-gold-ink font-bold">
                          Mora +25K
                        </span>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-leather-dark uppercase group-hover:text-leather-caramel transition-colors">
                      {experience.role}
                    </h3>
                    <p className="mt-0.5 font-serif text-xs tracking-wider text-leather-caramel font-bold">
                      {experience.company}
                    </p>
                  </div>

                  {/* Date range */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-parchment-subtle px-3.5 py-1.5 rounded-full border border-leather-caramel/25 shadow-sm">
                    <span className="codex-icon-plate h-7 w-7 shrink-0">
                      <Image
                        src={GENSHIN_UI_ICONS.time}
                        alt="Time"
                        width={16}
                        height={16}
                        className="codex-icon-on-plate h-4 w-4 object-contain"
                        unoptimized
                      />
                    </span>
                    <span className="font-body text-xs text-leather-dark tracking-wider tabular-nums font-semibold">
                      {experience.startDate} — {experience.endDate || "Present"}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-leather-muted font-body font-medium">
                  {experience.description}
                </p>

                {/* Commission seal */}
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-leather-caramel/20">
                  <span className="codex-icon-plate h-7 w-7 shrink-0">
                    <Image
                      src={GENSHIN_UI_ICONS.achievements}
                      alt=""
                      width={16}
                      height={16}
                      className="codex-icon-on-plate h-4 w-4 object-contain"
                      unoptimized
                    />
                  </span>
                  <span className="font-serif text-[11px] tracking-wider text-leather-muted uppercase font-bold">
                    Commission {String(index + 1).padStart(2, "0")} · sealed by the guild
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {experiences.length === 0 && (
            <div className="codex-card codex-radius-card mx-auto max-w-md px-8 py-10 text-center">
              <div className="codex-icon-plate mx-auto mb-4 h-11 w-11">
                <Image
                  src={GENSHIN_UI_ICONS.quests}
                  alt=""
                  width={28}
                  height={28}
                  className="codex-icon-on-plate h-6 w-6 object-contain"
                  unoptimized
                />
              </div>
              <h3 className="font-serif text-lg font-bold uppercase tracking-wide text-leather-dark">
                No commissions recorded
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-leather-muted">
                The expedition chronicle is waiting for its first entry — guild appointments and
                freelance quests will be logged here.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
