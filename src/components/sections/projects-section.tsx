"use client";

import { motion } from "framer-motion";
import { Boxes } from "lucide-react";
import { useData } from "@/lib/use-data";
import { SectionHeading } from "@/components/features/section-heading";
import { ProjectCard } from "@/components/features/project-card";
import { ProjectsGridSkeleton } from "@/components/ui/section-skeleton";

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
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 },
};

export function ProjectsSection() {
  const { data: projects, loading } = useData<Project[]>("/api/projects");

  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="PROJECT ARCHIVE // DOSSIER"
          icon={<Boxes className="mr-1.5 h-3.5 w-3.5" />}
          title="Deployed"
          highlight="Operations"
          subtitle="Tactical dossier of completed missions and active deployments."
        />

        {/* Projects Grid */}
        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
          {...stagger}
        >
          {loading && (
            <div className="col-span-full">
              <ProjectsGridSkeleton />
            </div>
          )}

          {projects?.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}

          {!loading && projects?.length === 0 && (
            <div className="col-span-full flex justify-center py-12">
              <span className="sys-label text-xs text-text-muted">NO PROJECT DATA AVAILABLE</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
