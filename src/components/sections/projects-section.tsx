"use client";

import { motion } from "framer-motion";
import { Boxes, ExternalLink, GitBranch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { portfolioData } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-starfield opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-ambient-gold" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
          <Badge variant="gold" size="md" className="mb-4">
            <Boxes className="mr-1.5 h-3.5 w-3.5" />
            PROJECT ARCHIVE // DOSSIER
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-[0.08em] text-text-main sm:text-4xl">
            Deployed <span className="text-gradient-gold">Operations</span>
          </h2>
          <p className="mt-4 text-lg text-text-muted font-body">
            Tactical dossier of completed missions and active deployments.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
          {...stagger}
        >
          {portfolioData.projects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <Card
                variant="glass"
                hover="lift"
                className="group h-full overflow-hidden"
              >
                {/* Project Image / Banner Area */}
                <div className="relative h-48 overflow-hidden bg-surface-primary border-b border-border-subtle">
                  {/* Placeholder gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-deep-space to-stellar-500/10" />
                  <div className="absolute inset-0 bg-grid-hud opacity-30" />
                  <div className="scanline absolute inset-0" />

                  {/* Tech overlay */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <Badge variant="default" size="sm">
                      {project.complexity}
                    </Badge>
                    <Badge variant={project.performance >= "98%" ? "stellar" : "gold"} size="sm">
                      PERF: {project.performance}
                    </Badge>
                  </div>

                  {/* Category tag */}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="gold" size="sm">
                      {project.category}
                    </Badge>
                  </div>

                  {/* Sys node */}
                  <span className="absolute bottom-3 right-3 sys-label text-[9px]">
                    [{project.id.toUpperCase()}]
                  </span>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-base font-bold tracking-wider text-text-main group-hover:text-gold-400 transition-colors">
                      {project.title}
                    </h3>
                    <span className="sys-label text-[9px] shrink-0">
                      {project.year}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-text-muted font-body line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="mt-5 flex items-center gap-3">
                    {project.links.live && (
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" glow="none">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span className="text-[10px]">LIVE</span>
                        </Button>
                      </a>
                    )}
                    {project.links.github && (
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" glow="none">
                          <GitBranch className="h-3.5 w-3.5" />
                          <span className="text-[10px]">SOURCE</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
