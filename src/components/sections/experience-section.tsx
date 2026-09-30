"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/features/section-heading";
import { AssetIcon } from "@/components/ui/asset-icon";
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
 * formatDuration — renders an expedition length from two `YYYY-MM` strings as
 * `1 YR 6 MO`. An empty `endDate` is ongoing and measured to the current month.
 */
function formatDuration(startDate: string, endDate: string | null | undefined): string {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  if (!startYear || !startMonth) return "";

  const [endYear, endMonth] = endDate
    ? endDate.split("-").map(Number)
    : (() => {
        const now = new Date();
        return [now.getFullYear(), now.getMonth() + 1];
      })();

  if (!endYear || !endMonth) return "";

  const months = Math.max(0, (endYear - startYear) * 12 + (endMonth - startMonth));
  const years = Math.floor(months / 12);
  const remainder = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} YR`);
  if (remainder > 0 || years === 0) parts.push(`${remainder} MO`);
  return parts.join(" ");
}

/**
 * ExperienceSection — the expedition chronicle, one sealed commission per
 * role. Presentation-only: the log is a prop from the server render.
 */
export function ExperienceSection({ experiences, section }: ExperienceSectionProps) {
  const sectionTitle = (section.title || "").trim();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });
  const railFill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="Adventurer Handbook // Daily Commissions"
          icon={<AssetIcon icon="handbook" size="sm" className="shrink-0" />}
          title={sectionTitle || AUTHORED.title}
          highlight={sectionTitle ? undefined : AUTHORED.highlight}
          subtitle={
            section.subtitle ||
            "A verified record of completed guild commissions, leadership roles, and technical expeditions across seven realms."
          }
        />

        {/* Timeline */}
        <motion.div ref={timelineRef} className="relative mt-14" {...stagger}>
          {/* Vertical guild line */}
          {experiences.length > 0 && (
            <>
              <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-leather-caramel/50 via-leather-caramel/25 to-transparent" />
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden
                  className="absolute left-[20px] top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-gold-400 to-gold-600"
                  style={{ scaleY: railFill }}
                />
              )}
            </>
          )}

          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className="relative pl-14 pb-10 last:pb-0 group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Gold glow that fades in behind the node */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-0 top-1 h-10 w-10 rounded-full"
                initial={{ boxShadow: "0 0 0 0 rgba(242,201,76,0)" }}
                whileInView={{ boxShadow: "0 0 18px 4px rgba(242,201,76,0.45)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              />

              {/* Timeline node with Quest Icon */}
              <div className="absolute left-0 top-1 h-10 w-10 shrink-0 transition-all duration-300 group-hover:scale-110">
                <AssetIcon icon="quests" size="md" />
              </div>

              {/* Node connector line */}
              <div className="absolute left-[20px] top-11 bottom-0 w-0.5 bg-leather-caramel/20 group-last:hidden" />

              {/* Commission card */}
              <div className="codex-card codex-radius-card codex-lift p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="codex-badge">
                        {COMMISSION_LABEL[experience.type] ?? "Commission"}
                      </span>

                      {/* Computed expedition length */}
                      <span className="flex items-center gap-1.5 rounded-full bg-parchment-subtle px-2.5 py-0.5 border border-leather-caramel/25 shadow-sm">
                        <span className="font-serif text-[10px] tracking-wider text-gold-ink font-bold tabular-nums uppercase">
                          {formatDuration(experience.startDate, experience.endDate)}
                        </span>
                      </span>
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
                    <AssetIcon icon="time" size="sm" />
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
                  <AssetIcon icon="achievements" size="sm" />
                  <span className="font-serif text-[11px] tracking-wider text-leather-muted uppercase font-bold">
                    Commission {String(index + 1).padStart(2, "0")} · sealed by the guild
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {experiences.length === 0 && (
            <div className="codex-card codex-radius-card codex-lift mx-auto max-w-md px-8 py-10 text-center">
              <AssetIcon icon="quests" size="lg" className="mx-auto mb-4" />
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
