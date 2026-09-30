"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AssetIcon } from "@/components/ui/asset-icon";
import { elementForCategory, resolveRarity } from "@/lib/project-meta";
import { EASE_CODEX } from "@/lib/motion-variants";
import type { ProjectDto } from "@/lib/dto";

interface ProjectCardProps {
  project: ProjectDto;
}

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: EASE_CODEX },
} as const;

/**
 * ProjectCard — one artifact in the domain archive.
 *
 * The card body links through to the `/projects/<id>` dossier (a stretched
 * link over the whole card), while the external live/source buttons stay
 * independent above it.
 */
export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const element = elementForCategory(project.category);
  const rarity = resolveRarity(project.complexity);
  const dossierHref = `/projects/${project.id}`;

  return (
    <motion.div {...cardMotion} className="h-full">
      <div className="group relative h-full codex-card codex-radius-card overflow-hidden codex-lift flex flex-col justify-between">
        {/* Top Media & Artifact Realm Frame */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-parchment-subtle border-b border-leather-caramel/25">
          {project.image && project.image !== "/placeholder.svg" ? (
            <Image
              src={project.image}
              alt={`Domain artifact of ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-parchment-elevated via-parchment-base to-parchment-subtle">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="codex-icon-plate h-11 w-11">
                  <Image
                    src={element.whiteIcon}
                    alt=""
                    width={24}
                    height={24}
                    className="codex-icon-on-plate h-6 w-6 object-contain"
                    unoptimized
                  />
                </span>
                <span className="font-display text-5xl text-leather-caramel/40">
                  {project.title.charAt(0).toUpperCase()}
                </span>
                <span className="codex-label">{project.category}</span>
              </div>
            </div>
          )}

          {/* Ambient Elemental Glow on Card Media */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ backgroundColor: element.color }}
          />

          {/* Top-Right: Artifact Rarity Stars */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-parchment-base/95 border border-leather-caramel/40 px-3.5 py-1 rounded-full shadow-md">
            <span className="text-gold-ink text-xs tracking-tight drop-shadow-[0_0_4px_rgba(201,154,78,0.8)]">
              {"★".repeat(rarity)}
            </span>
            <span className="font-serif text-[9px] text-leather-dark font-bold uppercase">
              Artifact
            </span>
          </div>

          {/* Top-Left: Official Elemental Vision Medallion */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-parchment-base/95 backdrop-blur-md px-3 py-1 rounded-full border border-leather-caramel/40 shadow-md">
            <span className="codex-icon-plate h-7 w-7 shrink-0">
              <Image
                src={element.whiteIcon}
                alt={element.name}
                width={16}
                height={16}
                className="codex-icon-on-plate h-4 w-4 object-contain transition-transform group-hover:scale-110"
                unoptimized
              />
            </span>
            <span
              className="font-serif text-[10px] font-bold uppercase tracking-wider"
              style={{ color: element.inkColor }}
            >
              {element.name}
            </span>
          </div>

          {/* Bottom Domain Strip */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between gap-2 rounded-full border border-leather-caramel/25 bg-parchment-base/90 px-3 py-1 backdrop-blur-sm">
            <span className="codex-label">Domain · {project.category}</span>
            <span className="codex-label-gold tabular-nums">Performance {project.performance}</span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-transparent">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-lg font-bold tracking-wide text-leather-dark group-hover:text-leather-caramel transition-colors uppercase">
                <Link
                  href={dossierHref}
                  className="codex-focus after:absolute after:inset-0 after:content-['']"
                >
                  {project.title}
                </Link>
              </h3>
              <span className="text-[11px] font-serif text-leather-caramel shrink-0 tabular-nums font-bold">
                {project.year}
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-leather-muted font-body font-medium line-clamp-3">
              {project.description}
            </p>

            {/* Tech Stack Tags */}
            {project.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="codex-badge"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Links — external domains & source forges */}
          <div className="pt-3 border-t border-leather-caramel/20 flex items-center gap-2.5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Enter Domain ${project.title}`}
                className="codex-btn-primary codex-sheen codex-focus relative z-10 px-4 py-2 font-serif text-[11px] font-bold tracking-wider uppercase transition-all inline-flex items-center gap-1.5"
              >
                <AssetIcon icon="domain" size="sm" />
                <span>Enter Domain</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View code for ${project.title}`}
                className="codex-btn-secondary codex-sheen codex-focus relative z-10 px-3.5 py-2 font-serif text-[11px] font-bold tracking-wider uppercase transition-all inline-flex items-center gap-1.5"
              >
                <AssetIcon icon="trainingGuide" size="sm" />
                <span>Forge Lore</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
