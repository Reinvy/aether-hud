"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fadeInView } from "@/lib/motion-variants";
import { SectionHeading } from "@/components/features/section-heading";
import { SkillBar } from "@/components/features/skill-bar";
import { getElementByKey, type ElementAsset } from "@/lib/element-assets";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import type { SectionDto, SkillDto } from "@/lib/dto";

interface SkillsSectionProps {
  skills: SkillDto[];
  section: SectionDto;
}

const AUTHORED = { title: "Talents &", highlight: "Constellations" };

/** Elemental vision granted by each talent discipline (unknown → Geo). */
const ELEMENT_KEY_BY_CATEGORY: Partial<Record<string, string>> = {
  AI: "electro",
  Frontend: "anemo",
  Backend: "hydro",
  DevOps: "geo",
  Design: "cryo",
  Language: "dendro",
};

function getElementByKeyFromCategory(category: string): ElementAsset {
  return getElementByKey(ELEMENT_KEY_BY_CATEGORY[category] ?? "geo");
}

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.05 },
};

/**
 * SkillsSection — the talent tree, grouped by the vision each discipline
 * grants. Presentation-only: the talent records are a prop from the server
 * render, so the section never fetches.
 */
export function SkillsSection({ skills, section }: SkillsSectionProps) {
  const groups = useMemo(() => {
    const result: { category: string; element: ElementAsset; skills: SkillDto[] }[] = [];
    for (const skill of skills) {
      const group = result.find((entry) => entry.category === skill.category);
      if (group) {
        group.skills.push(skill);
      } else {
        result.push({
          category: skill.category,
          element: getElementByKeyFromCategory(skill.category),
          skills: [skill],
        });
      }
    }
    return result;
  }, [skills]);

  const categoryStats = groups.map((group) => ({
    label: group.category === "AI" ? "AI/ML" : group.category,
    pct: Math.round(group.skills.reduce((sum, skill) => sum + skill.level, 0) / group.skills.length),
  }));

  const sectionTitle = (section.title || "").trim();

  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-15" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Talents & Constellations // Visions"
          icon={
            <div className="codex-icon-plate h-7 w-7 shrink-0">
              <Image
                src={GENSHIN_UI_ICONS.talents}
                alt="Talents Icon"
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
            "Elemental proficiencies and character talent trees across seven digital domains."
          }
        />

        {/* Talent Tree Container */}
        <motion.div className="mt-12 mx-auto max-w-4xl" {...stagger}>
          <div className="codex-card codex-radius-card codex-lift p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-leather-caramel/20">
              <div className="codex-icon-plate h-7 w-7 shrink-0">
                <Image
                  src={GENSHIN_UI_ICONS.talents}
                  alt="Talents Tree"
                  width={20}
                  height={20}
                  className="codex-icon-on-plate h-4 w-4 object-contain"
                  unoptimized
                />
              </div>
              <span className="codex-label-active">
                Talent Tree // Active Constellations
              </span>
              <span className="ml-auto font-body text-[10px] tracking-wider text-leather-muted font-bold uppercase tabular-nums">
                {skills.length} talents attuned
              </span>
            </div>

            {skills.length === 0 ? (
              <div className="codex-card codex-radius-card codex-lift border border-leather-caramel/25 bg-parchment-subtle/60 px-6 py-10 text-center">
                <div className="codex-icon-plate mx-auto mb-3 h-11 w-11">
                  <Image
                    src={GENSHIN_UI_ICONS.talents}
                    alt=""
                    width={24}
                    height={24}
                    className="codex-icon-on-plate h-6 w-6 object-contain"
                    unoptimized
                  />
                </div>
                <h3 className="font-serif text-base font-bold uppercase tracking-wide text-leather-dark">
                  No talents attuned yet
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-leather-muted">
                  The constellation map is still unwritten — talent records will appear here once
                  they are inscribed in the console.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {groups.map((group) => (
                  <div key={group.category} className="space-y-3">
                    {/* Vision granted by this discipline */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={cn("vision-badge", `vision-${group.element.key}`)}>
                        <span className="hover-scale-sm codex-icon-plate h-5 w-5 shrink-0">
                          <Image
                            src={group.element.whiteIcon}
                            alt=""
                            width={14}
                            height={14}
                            className="codex-icon-on-plate h-3 w-3 object-contain"
                            unoptimized
                          />
                        </span>
                        {group.element.name}
                      </span>
                      <span className="codex-label">
                        {group.category}
                      </span>
                      <span className="codex-label ml-auto tabular-nums">
                        {group.skills.length} talents
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {group.skills.map((skill) => (
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
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Elemental Resonance // Category Average */}
        {categoryStats.length > 0 && (
          <motion.div className="mt-10 mx-auto max-w-2xl text-center" {...fadeInView}>
            <div className="codex-card codex-radius-card codex-lift p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="codex-icon-plate h-7 w-7 shrink-0">
                  <Image
                    src={GENSHIN_UI_ICONS.achievements}
                    alt="Elemental Resonance"
                    width={16}
                    height={16}
                    className="codex-icon-on-plate h-4 w-4 object-contain"
                    unoptimized
                  />
                </div>
                <span className="codex-label-active">
                  Elemental Resonance // Category Average
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4">
                {categoryStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="codex-lift text-center min-w-[84px] p-3 codex-radius-card bg-parchment-base border border-leather-caramel/25 shadow-sm"
                  >
                    <div className="text-2xl font-bold font-serif text-leather-dark tabular-nums">
                      {stat.pct}%
                    </div>
                    <div className="codex-label mt-1 tabular-nums">{stat.label}</div>
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
