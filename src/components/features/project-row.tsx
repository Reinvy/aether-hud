"use client";

import { memo } from "react";
import { ExternalLink } from "lucide-react";
import { IconBox } from "@/components/ui/icon-box";
import type { ProjectDto } from "@/lib/dto";

interface ProjectRowProps {
  /** Domain record rendered by this compact row. */
  project: ProjectDto;
}

/**
 * ProjectRow — compact domain row.
 *
 * The one-line treatment of a domain record: rank seal, title, category and
 * its first two tags, then the performance mark and the live link. Used by the
 * Codex Console overview ("Domain Archive" panel) wherever a full ProjectCard
 * would be too heavy.
 */
export const ProjectRow = memo(function ProjectRow({ project }: ProjectRowProps) {
  const tags = project.tags.slice(0, 2).join(", ");

  return (
    <div className="group relative flex items-center justify-between codex-radius-card border border-border-subtle px-3 py-3 transition-all duration-300 hover:border-leather-caramel/60 hover:bg-leather-caramel/10 hover-scale-sm press-scale sm:px-4">
      {/* Diamond hover indicator */}
      <span className="pointer-events-none absolute -left-px top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border border-gold-400/40 bg-parchment-elevated opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_8px_rgba(242,201,76,0.5)]" />
      <div className="flex min-w-0 items-center gap-3">
        <IconBox>
          <span className="font-display text-[10px] font-bold">
            {project.complexity.replace("CLASS-", "")}
          </span>
        </IconBox>
        <div className="min-w-0">
          <p className="truncate font-display text-xs font-semibold tracking-[0.08em] text-leather-dark transition-colors duration-200 group-hover:text-leather-caramel">
            {project.title}
          </p>
          <p className="truncate font-mono text-[10px] tracking-wide text-leather-muted">
            {project.category}
            {tags ? ` · ${tags}` : ""}
          </p>
        </div>
      </div>
      <div className="ml-2 flex shrink-0 items-center gap-2 sm:gap-3">
        <span className="codex-label hidden text-[9px] sm:inline">
          Rating {project.performance}
        </span>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${project.title}`}
            className="hover-scale-sm press-scale codex-focus block p-2"
          >
            <ExternalLink className="h-3.5 w-3.5 text-leather-muted transition-colors hover:text-leather-caramel" />
          </a>
        )}
      </div>
    </div>
  );
});
