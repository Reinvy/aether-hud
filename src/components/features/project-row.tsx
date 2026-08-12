"use client";

import { memo } from "react";
import { ExternalLink } from "lucide-react";
import { IconBox } from "@/components/ui/icon-box";

/**
 * ProjectRow — reusable HUD project dossier row.
 *
 * Extracted from the dashboard overview page ("Deployed Archives" quick
 * overview) so the same tactical row markup can be reused anywhere a
 * compact project listing is needed (dashboard overview, archive views,
 * future ops panels) without duplicating the chamfered glass + sys-label
 * + PERF badge treatment.
 */

export interface ProjectRowData {
  title: string;
  category: string;
  /** JSON array stored as string (API format). */
  tags: string;
  complexity: string;
  performance: string;
  liveUrl: string | null;
}

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tags ? tags.split(",").map((t) => t.trim()) : [];
  }
}

export const ProjectRow = memo(function ProjectRow({
  project,
}: {
  project: ProjectRowData;
}) {
  const tags = parseTags(project.tags);

  return (
    <div className="group relative flex items-center justify-between chamfered-xs border border-border-subtle px-3 sm:px-4 py-3 transition-all duration-300 hover:border-border-glass hover:bg-glass-200 hover-scale-sm press-scale">
      {/* Diamond hover indicator */}
      <span className="pointer-events-none absolute -left-px top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border border-gold-400/40 bg-deep-space opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(242,201,76,0.5)]" />
      <div className="flex items-center gap-3 min-w-0">
        <IconBox>
          <span className="font-mono text-[9px] text-gold-400">
            {project.complexity.slice(-1)}
          </span>
        </IconBox>
        <div className="min-w-0">
          <p className="truncate font-mono text-xs font-medium tracking-wider text-text-main group-hover:text-gold-400 transition-colors duration-200">
            {project.title}
          </p>
          <p className="truncate font-mono text-[9px] tracking-wider text-text-muted">
            {project.category} // {tags.slice(0, 2).join(", ")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
        <span className="sys-label text-[8px] hidden sm:inline">
          PERF: {project.performance}
        </span>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-scale-sm press-scale focus-ring-gold block p-2"
          >
            <ExternalLink className="h-3.5 w-3.5 text-text-muted transition-colors hover:text-gold-400" />
          </a>
        )}
      </div>
    </div>
  );
});
