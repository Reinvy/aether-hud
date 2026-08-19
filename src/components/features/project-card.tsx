"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GitBranch, Sparkles } from "lucide-react";

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

// Map category to Genshin Vision element style
function getVisionClass(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes("ai")) return "vision-pyro";
  if (cat.includes("data") || cat.includes("stack")) return "vision-hydro";
  if (cat.includes("infra") || cat.includes("cloud")) return "vision-geo";
  if (cat.includes("security")) return "vision-cryo";
  if (cat.includes("realtime") || cat.includes("tools")) return "vision-electro";
  return "vision-anemo";
}

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

export const ProjectCard = memo(function ProjectCard(project: ProjectCardProps) {
  const tags = parseTags(project.tags);
  const is5Star = project.complexity.includes("S") || project.complexity.includes("A");
  const visionClass = getVisionClass(project.category);

  return (
    <motion.div {...cardMotion} className="h-full">
      <div className="group h-full parchment-panel dark:glass-panel chamfered-sm border border-leather-caramel/25 dark:border-gold-400/25 overflow-hidden card-lift flex flex-col justify-between relative shadow-lg">
        {/* Top Media Area */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-parchment-subtle dark:bg-surface-primary border-b border-leather-caramel/20 dark:border-gold-400/20">
          {project.image && project.image !== "/placeholder.svg" ? (
            <Image
              src={project.image}
              alt={`Preview of ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-leather-caramel/15 via-parchment-subtle to-gold-400/10 dark:from-gold-400/10 dark:via-surface-primary dark:to-[#182040]" />
          )}

          <div className="absolute inset-0 bg-grid-hud opacity-20 group-hover:opacity-35 transition-opacity" />

          {/* Top-Right: Rarity Stars (5★ or 4★) */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-leather-dark/80 dark:bg-surface-primary/80 px-2.5 py-1 chamfered-xs shadow-md">
            <span className="text-gold-400 text-xs tracking-tighter">
              {is5Star ? "★★★★★" : "★★★★☆"}
            </span>
          </div>

          {/* Top-Left: Vision Badge */}
          <div className="absolute top-3 left-3">
            <span className={`vision-badge ${visionClass} shadow-md uppercase`}>
              {project.category}
            </span>
          </div>

          {/* Bottom Telemetry strip */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
            <span className="sys-label font-mono text-[9px] text-leather-muted/80 dark:text-platinum-300">
              [{project.id.toUpperCase()}]
            </span>
            <span className="font-mono text-[9px] text-leather-caramel dark:text-gold-400 font-bold">
              PERF: {project.performance}
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-bold tracking-wide text-leather-dark dark:text-platinum-50 group-hover:text-leather-caramel dark:group-hover:text-gold-400 transition-colors uppercase">
                {project.title}
              </h3>
              <span className="text-[10px] font-mono text-leather-muted dark:text-text-muted shrink-0 tabular-nums">
                // {project.year}
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-leather-muted dark:text-text-muted font-body line-clamp-3">
              {project.description}
            </p>

            {/* Tech Tags */}
            <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 chamfered-xs bg-leather-caramel/8 dark:bg-gold-400/10 border border-leather-caramel/20 dark:border-gold-400/20 text-leather-dark dark:text-platinum-200 text-[10px] font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links Styled as Platform Badges (Ref 1) */}
          <div className="pt-3 border-t border-leather-caramel/15 dark:border-gold-400/15 flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Launch ${project.title}`}
                className="tactical-btn px-4 py-1.5 bg-leather-caramel dark:bg-gold-400 text-parchment-base dark:text-deep-space font-mono text-[10px] font-bold tracking-wider hover:opacity-90 transition-all inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>LAUNCH</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View code for ${project.title}`}
                className="tactical-btn px-3 py-1.5 border border-leather-caramel/30 dark:border-gold-400/30 text-leather-dark dark:text-gold-400 hover:bg-leather-caramel/10 dark:hover:bg-gold-400/10 font-mono text-[10px] tracking-wider transition-all inline-flex items-center gap-1.5"
              >
                <GitBranch className="w-3 h-3" />
                <span>CODE</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
