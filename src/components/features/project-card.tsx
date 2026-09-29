"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TEYVAT_ELEMENTS } from "@/lib/element-assets";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";
import { EASE_CODEX } from "@/lib/motion-variants";
import type { ProjectDto } from "@/lib/dto";

interface ProjectCardProps {
  project: ProjectDto;
}

/** Map a domain category onto the element medallion shown over the art. */
function getElementForCategory(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("ai") || normalized.includes("neural")) return TEYVAT_ELEMENTS[0]; // Pyro
  if (normalized.includes("data") || normalized.includes("full")) return TEYVAT_ELEMENTS[1]; // Hydro
  if (normalized.includes("core") || normalized.includes("lang")) return TEYVAT_ELEMENTS[2]; // Anemo
  if (normalized.includes("realtime") || normalized.includes("event") || normalized.includes("stream")) {
    return TEYVAT_ELEMENTS[3]; // Electro
  }
  if (normalized.includes("agent") || normalized.includes("logic")) return TEYVAT_ELEMENTS[4]; // Dendro
  if (normalized.includes("sec") || normalized.includes("crypto") || normalized.includes("auth")) {
    return TEYVAT_ELEMENTS[5]; // Cryo
  }
  return TEYVAT_ELEMENTS[6]; // Geo
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
  const element = getElementForCategory(project.category);
  const is5Star = project.complexity.includes("S") || project.complexity.includes("A");
  const dossierHref = `/projects/${project.id}`;

  return (
    <motion.div {...cardMotion} className="h-full">
      <div className="group relative h-full codex-panel rounded-3xl overflow-hidden codex-lift flex flex-col justify-between">
        {/* Top Media & Artifact Realm Frame */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-parchment-subtle dark:bg-surface-primary border-b border-leather-caramel/25 dark:border-gold-400/25">
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
            <div className="absolute inset-0 bg-gradient-to-br from-parchment-elevated via-parchment-base to-parchment-subtle dark:from-gold-400/10 dark:via-surface-primary dark:to-deep-space" />
          )}

          {/* Ambient Elemental Glow on Card Media */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ backgroundColor: element.color }}
          />

          {/* Top-Right: Artifact Rarity Stars */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-parchment-base/95 border border-leather-caramel/40 px-3.5 py-1 rounded-full shadow-md dark:bg-deep-space/85 dark:border-gold-400/30">
            <span className="text-gold-500 dark:text-gold-400 text-xs tracking-tight drop-shadow-[0_0_4px_rgba(201,154,78,0.8)]">
              {is5Star ? "★★★★★" : "★★★★☆"}
            </span>
            <span className="font-serif text-[9px] text-leather-dark dark:text-platinum-50 font-bold uppercase">
              Artifact
            </span>
          </div>

          {/* Top-Left: Official Elemental Vision Medallion */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-parchment-base/95 backdrop-blur-md px-3 py-1 rounded-full border border-leather-caramel/40 shadow-md dark:bg-deep-space/70 dark:border-gold-400/40">
            <div className="w-5 h-5 relative">
              <Image
                src={element.gildedIcon}
                alt={element.name}
                width={20}
                height={20}
                className="object-contain transition-transform group-hover:scale-110"
                unoptimized
              />
            </div>
            <span
              className="font-serif text-[10px] font-bold uppercase tracking-wider"
              style={{ color: element.color }}
            >
              {element.name}
            </span>
          </div>

          {/* Bottom Domain Strip */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between gap-2 rounded-full border border-leather-caramel/25 dark:border-gold-400/25 bg-parchment-base/90 px-3 py-1 backdrop-blur-sm dark:bg-deep-space/85">
            <span className="codex-label">Domain · {project.category}</span>
            <span className="codex-label-gold tabular-nums">Performance {project.performance}</span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-transparent">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-lg font-bold tracking-wide text-leather-dark dark:text-platinum-50 group-hover:text-leather-caramel dark:group-hover:text-gold-400 transition-colors uppercase">
                <Link
                  href={dossierHref}
                  className="codex-focus after:absolute after:inset-0 after:content-['']"
                >
                  {project.title}
                </Link>
              </h3>
              <span className="text-[11px] font-serif text-leather-caramel dark:text-gold-400 shrink-0 tabular-nums font-bold">
                {project.year}
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-leather-muted dark:text-platinum-200 font-body font-medium line-clamp-3">
              {project.description}
            </p>

            {/* Tech Stack Tags */}
            {project.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/25 dark:border-gold-400/25 text-leather-dark dark:text-platinum-50 text-[11px] font-body font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Links — external domains & source forges */}
          <div className="pt-3 border-t border-leather-caramel/20 dark:border-gold-400/20 flex items-center gap-2.5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Enter Domain ${project.title}`}
                className="codex-btn-primary codex-focus relative z-10 px-4 py-2 font-serif text-[11px] font-bold tracking-wider uppercase transition-all inline-flex items-center gap-1.5"
              >
                <span className="w-3.5 h-3.5 relative">
                  <Image
                    src={GENSHIN_UI_ICONS.domain}
                    alt=""
                    width={14}
                    height={14}
                    className="object-contain brightness-0"
                    unoptimized
                  />
                </span>
                <span>Enter Domain</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View code for ${project.title}`}
                className="codex-btn-secondary codex-focus relative z-10 px-3.5 py-2 font-serif text-[11px] font-bold tracking-wider uppercase transition-all inline-flex items-center gap-1.5"
              >
                <span className="w-3.5 h-3.5 relative">
                  <Image
                    src={GENSHIN_UI_ICONS.trainingGuide}
                    alt=""
                    width={14}
                    height={14}
                    className="object-contain"
                    unoptimized
                  />
                </span>
                <span>Forge Lore</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
