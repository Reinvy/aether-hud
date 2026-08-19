"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TEYVAT_ELEMENTS } from "@/lib/element-assets";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
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
    return tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  }
}

// Map category to matching Teyvat Element Asset
function getElementForCategory(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes("ai") || cat.includes("neural")) return TEYVAT_ELEMENTS[0]; // Pyro
  if (cat.includes("data") || cat.includes("full")) return TEYVAT_ELEMENTS[1]; // Hydro
  if (cat.includes("core") || cat.includes("lang")) return TEYVAT_ELEMENTS[2]; // Anemo
  if (cat.includes("realtime") || cat.includes("event") || cat.includes("stream")) return TEYVAT_ELEMENTS[3]; // Electro
  if (cat.includes("agent") || cat.includes("logic")) return TEYVAT_ELEMENTS[4]; // Dendro
  if (cat.includes("sec") || cat.includes("crypto") || cat.includes("auth")) return TEYVAT_ELEMENTS[5]; // Cryo
  return TEYVAT_ELEMENTS[6]; // Geo
}

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

export const ProjectCard = memo(function ProjectCard(project: ProjectCardProps) {
  const tags = parseTags(project.tags);
  const element = getElementForCategory(project.category);
  const is5Star = project.complexity.includes("S") || project.complexity.includes("A");

  return (
    <motion.div {...cardMotion} className="h-full">
      <div className="group h-full bg-[#FAF7EE] dark:bg-surface-primary/70 parchment-panel dark:glass-panel rounded-3xl border-2 border-leather-caramel/30 dark:border-gold-400/30 overflow-hidden card-lift flex flex-col justify-between relative shadow-xl">
        {/* Top Media & Artifact Realm Frame */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-[#F3EDDF] dark:bg-surface-primary border-b border-leather-caramel/25 dark:border-gold-400/20">
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#EFE8D6] via-[#FAF7EE] to-[#E2D6C0] dark:from-gold-400/15 dark:via-surface-primary dark:to-[#182040]" />
          )}

          {/* Ambient Elemental Glow on Card Media */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ backgroundColor: element.color }}
          />

          {/* Top-Right: 5★ Artifact Rarity Stars */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#FAF7EE]/95 dark:bg-black/85 px-3.5 py-1 rounded-full border border-leather-caramel/40 dark:border-gold-400/30 shadow-md">
            <span className="text-[#DFAE2A] dark:text-gold-400 text-xs tracking-tight drop-shadow-[0_0_4px_rgba(201,154,78,0.8)]">
              {is5Star ? "★★★★★" : "★★★★☆"}
            </span>
            <span className="font-display text-[9px] text-[#1E1208] dark:text-gold-200 font-bold uppercase">
              ARTIFACT
            </span>
          </div>

          {/* Top-Left: Official Elemental Vision Medallion */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#FAF7EE]/95 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-leather-caramel/40 dark:border-gold-400/40 shadow-md">
            <div className="w-5 h-5 relative">
              <Image
                src={element.gildedIcon}
                alt={element.name}
                width={20}
                height={20}
                className="object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <span
              className="font-display text-[10px] font-bold uppercase tracking-wider"
              style={{ color: element.color }}
            >
              {element.name}
            </span>
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
            <span className="font-mono text-[9px] text-[#5E412A] dark:text-platinum-300 font-bold">
              DOMAIN // {project.category.toUpperCase()}
            </span>
            <span className="font-mono text-[9px] text-[#8C6239] dark:text-gold-400 font-bold">
              PERF: {project.performance}
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-transparent">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-bold tracking-wide text-[#1E1208] dark:text-platinum-50 group-hover:text-[#8C6239] dark:group-hover:text-gold-400 transition-colors uppercase">
                {project.title}
              </h3>
              <span className="text-[10px] font-mono text-[#5E412A] dark:text-text-muted shrink-0 tabular-nums font-bold">
                // {project.year}
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#2B1A0D] dark:text-text-muted font-body font-medium line-clamp-3">
              {project.description}
            </p>

            {/* Tech Stack Tags */}
            <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full bg-[#8C6239]/10 dark:bg-gold-400/10 border border-[#8C6239]/25 dark:border-gold-400/25 text-[#1E1208] dark:text-platinum-200 text-[10px] font-mono font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links Styled as Genshin Domain Buttons */}
          <div className="pt-3 border-t border-leather-caramel/20 dark:border-gold-400/20 flex items-center gap-2.5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Enter Domain ${project.title}`}
                className="genshin-btn-primary px-4 py-2 font-display text-[11px] font-bold tracking-wider hover:opacity-95 transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <div className="w-3.5 h-3.5 relative">
                  <Image
                    src={GENSHIN_UI_ICONS.domain}
                    alt="Domain"
                    width={14}
                    height={14}
                    className="object-contain brightness-0"
                  />
                </div>
                <span>ENTER DOMAIN</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View code for ${project.title}`}
                className="genshin-btn-secondary px-3.5 py-2 font-mono text-[11px] tracking-wider transition-all inline-flex items-center gap-1.5"
              >
                <div className="w-3.5 h-3.5 relative">
                  <Image
                    src={GENSHIN_UI_ICONS.trainingGuide}
                    alt="Training Guide"
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                </div>
                <span>FORGE LORE</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
