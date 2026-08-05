"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * ProjectCard — reusable HUD project dossier card.
 *
 * Extracted from the projects section so the same tactical card can be
 * reused anywhere (landing, dashboard, future archive views) without
 * duplicating the chamfered glass + tech-badge + energy-sweep markup.
 */

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  /** Local asset path (e.g. /placeholder.svg) or future optimized remote. */
  image: string;
  /** JSON array stored as string (API format). */
  tags: string;
  category: string;
  complexity: string;
  performance: string;
  year: string;
  liveUrl: string | null;
  githubUrl: string | null;
};

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tags ? tags.split(",").map((t) => t.trim()) : [];
  }
}

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

export const ProjectCard = memo(function ProjectCard(project: ProjectCardProps) {
  const tags = parseTags(project.tags);

  return (
    <motion.div {...cardMotion}>
      <Card variant="glass" hover="lift" className="group h-full overflow-hidden">
        {/* Project Image / Banner Area */}
        <div className="relative h-48 overflow-hidden bg-surface-primary border-b border-border-subtle">
          {/* Optimized image layer — next/image (AVIF/WebP + responsive
              sizes + lazy loading). Currently the local HUD placeholder;
              swap the data-file path for a real screenshot and the card
              stays optimized with zero markup changes. */}
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            />
          ) : null}
          {/* Placeholder gradient — subtle zoom on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-deep-space to-stellar-500/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
          <div className="absolute inset-0 bg-grid-hud opacity-30 transition-opacity duration-300 group-hover:opacity-50" />
          <div className="scanline absolute inset-0" />

          {/* Gold overlay on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gold-500/0 to-gold-500/0 transition-colors duration-500 group-hover:from-gold-500/15 group-hover:to-transparent" />

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
            {tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Links */}
          <div className="mt-5 flex items-center gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" glow="none">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="text-[10px]">LIVE</span>
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
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
  );
});
