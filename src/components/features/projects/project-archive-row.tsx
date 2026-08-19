"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import { RowActions } from "@/components/ui/row-actions";

/**
 * ProjectArchiveRow — reusable HUD project dossier row for archive lists.
 *
 * Extracted from the dashboard projects view so the same chamfered-glass
 * dossier row (icon box + truncated title/description + category badge +
 * DEPLOYED led + edit/delete/purge actions) can be reused anywhere a
 * project archive is rendered. The parent owns data fetching, the edit
 * modal and the delete-target state.
 *
 * Memoized: with stable onEdit/onDelete callbacks (useCallback in the
 * parent), a keystroke in the archive search only re-renders rows whose
 * props actually changed — the untouched rows skip reconciliation entirely.
 * This keeps large archives responsive while filtering.
 */

interface ProjectArchiveRowData {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: string;
  liveUrl: string | null;
}

interface ProjectArchiveRowProps<T extends ProjectArchiveRowData> {
  project: T;
  index: number;
  onEdit: (project: T) => void;
  onDelete: (project: T) => void;
}

function ProjectArchiveRowInner<T extends ProjectArchiveRowData>({
  project,
  index,
  onEdit,
  onDelete,
}: ProjectArchiveRowProps<T>) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="glass" hover="sweep" diamond>
        <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4">
          <IconBox>
            <span className="font-mono text-[10px] text-gold-400">
              {project.complexity.slice(-1)}
            </span>
          </IconBox>

          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs font-medium tracking-wider text-text-main group-hover:text-gold-400 transition-colors duration-200">
              {project.title}
            </p>
            <p className="mt-0.5 truncate font-mono text-[9px] text-text-muted">
              {project.description.slice(0, 80)}...
            </p>
          </div>

          <div className="hidden w-24 sm:block">
            <Badge variant="default" size="sm">
              {project.category}
            </Badge>
          </div>

          <div className="hidden w-20 items-center gap-2 md:flex">
            <span className="led-active" />
            <span className="sys-label-active text-[8px]">DEPLOYED</span>
          </div>

          <div className="flex w-20 items-center justify-end">
            <RowActions
              onEdit={() => onEdit(project)}
              onDelete={() => onDelete(project)}
              leading={
                project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`}>
                    <Button variant="ghost" size="sm" glow="none" className="min-h-9 min-w-9 p-0 sm:min-h-0 sm:min-w-0 sm:p-2 hover:bg-glass-200 hover-scale-sm">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                ) : undefined
              }
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Preserve the generic signature via the cast — memo's shallow prop compare
// skips unchanged rows when the parent keeps callbacks stable.
export const ProjectArchiveRow = memo(ProjectArchiveRowInner) as typeof ProjectArchiveRowInner;
