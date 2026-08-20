"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useData } from "@/lib/use-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/features/section-heading";
import { ProjectCard } from "@/components/features/project-card";
import { ProjectsGridSkeleton } from "@/components/ui/section-skeleton";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string; // JSON array stored as string
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string | null;
  githubUrl: string | null;
  order: number;
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.1 },
};

export function ProjectsSection() {
  const { data: projects, loading } = useData<Project[]>("/api/projects");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Extract unique categories
  const categories = useMemo(() => {
    if (!projects) return ["ALL"];
    const unique = Array.from(new Set(projects.map((p) => p.category.trim()))).filter(Boolean);
    return ["ALL", ...unique];
  }, [projects]);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (selectedCategory === "ALL") return projects;
    return projects.filter((p) => p.category.trim() === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-35" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="ARTIFACT ARCHIVE // DOMAINS OF FORGERY"
          icon={
            <div className="w-4 h-4 relative">
              <Image
                src={GENSHIN_UI_ICONS.domain}
                alt="Domain Icon"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
          }
          title="Domains &"
          highlight="Artifacts"
          subtitle="Curated chronicle of 5-star digital architectures, neural systems, and forged platforms across seven realms."
        />

        {/* Genshin Domain Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Domain categories">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full font-serif text-xs font-bold tracking-wider uppercase transition-all duration-200 border-2",
                    isActive
                      ? "bg-[#8C6239] dark:bg-gold-400 text-[#FAF8F5] dark:text-deep-space border-[#8C6239] dark:border-gold-400 shadow-md scale-105"
                      : "bg-[#FAF8F5] dark:bg-surface-primary/90 text-[#2C1E14] dark:text-platinum-200 border-[#8C6239]/35 dark:border-gold-400/25 hover:border-[#8C6239] dark:hover:border-gold-400"
                  )}
                >
                  {cat === "ALL" ? "✦ ALL DOMAINS" : cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        <motion.div
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
          {...stagger}
        >
          {loading && (
            <div className="col-span-full">
              <ProjectsGridSkeleton />
            </div>
          )}

          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}

          {!loading && filteredProjects.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 relative mb-3 opacity-60">
                <Image
                  src={GENSHIN_UI_ICONS.archive}
                  alt="Empty Archive"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <p className="font-display text-base font-bold text-[#1E1208] dark:text-platinum-50 uppercase">
                NO ARTIFACTS IN THIS DOMAIN
              </p>
              <p className="font-mono text-xs text-[#5E412A] dark:text-text-muted mt-1">
                Select another realm category or explore all domains.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
