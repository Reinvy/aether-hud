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
    <div className="group flex items-center justify-between rounded-sm border border-border-subtle px-3 sm:px-4 py-3 transition-all duration-200 hover:border-border-glass hover:bg-glass-200 hover-scale-sm">
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
            className="hover-scale-sm block p-1"
          >
            <ExternalLink className="h-3.5 w-3.5 text-text-muted transition-colors hover:text-gold-400" />
          </a>
        )}
      </div>
    </div>
  );
});
