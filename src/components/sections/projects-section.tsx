"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/features/section-heading";
import { ProjectCard } from "@/components/features/project-card";
import { AssetIcon } from "@/components/ui/asset-icon";
import type { ProjectDto, SectionDto } from "@/lib/dto";

interface ProjectsSectionProps {
  projects: ProjectDto[];
  section: SectionDto;
}

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.1 },
};

/**
 * ProjectsSection — the artifact archive of forged domains.
 *
 * Presentation-only: the domain list is a prop from the server render, so the
 * section never fetches and always renders its final state.
 */
export function ProjectsSection({ projects, section }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Extract unique categories
  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category.trim()))).filter(Boolean);
    return ["ALL", ...unique];
  }, [projects]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "ALL") return projects;
    return projects.filter((p) => p.category.trim() === selectedCategory);
  }, [projects, selectedCategory]);

  const sectionTitle = section.title.trim();
  const archiveIsEmpty = projects.length === 0;

  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-35" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="Artifact Archive // Domains of Forgery"
          icon={<AssetIcon icon="domain" size="sm" className="shrink-0" />}
          title={sectionTitle || "Domains &"}
          highlight={sectionTitle ? undefined : "Artifacts"}
          subtitle={
            section.subtitle ||
            "Curated chronicle of legendary digital architectures, neural systems, and forged platforms across seven realms."
          }
        />

        {/* Domain Category Filter Tabs */}
        {categories.length > 1 && (
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="Filter domains by discipline"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "press-scale px-4 py-1.5 codex-btn font-serif text-xs font-bold tracking-wider uppercase transition-all duration-200 border-2 codex-focus",
                    isActive
                      ? "bg-leather-caramel text-parchment-base border-leather-caramel shadow-md scale-105"
                      : "bg-parchment-base/80 text-leather-dark border-leather-caramel/35 hover:border-leather-caramel",
                  )}
                >
                  {category === "ALL" ? "All domains" : category}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        <motion.div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" {...stagger}>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="col-span-full">
              <div className="codex-card codex-radius-card codex-lift mx-auto max-w-md px-8 py-10 text-center">
                <AssetIcon icon="archive" size="lg" className="mx-auto mb-4" />
                <h3 className="font-serif text-lg font-bold uppercase tracking-wide text-leather-dark">
                  {archiveIsEmpty ? "The archive awaits its first artifact" : "No artifacts in this domain"}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-leather-muted">
                  {archiveIsEmpty
                    ? "Commissioned builds will be catalogued here as soon as they are forged."
                    : "Choose another realm from the filter above, or return to all domains."}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
