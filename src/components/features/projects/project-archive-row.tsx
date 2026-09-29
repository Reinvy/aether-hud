"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/components/ui/row-actions";
import { StatusDot } from "@/components/ui/status-dot";

/**
 * ProjectArchiveRow — reusable project dossier row for archive lists.
 *
 * Extracted from the dashboard projects view so the same glass dossier row
 * (selection checkbox + icon box + truncated title/description + category
 * badge + status dot + move/edit/delete actions) can be reused anywhere a
 * project archive is rendered. The parent owns data fetching, filtering,
 * ordering, the edit modal and the delete state.
 *
 * Memoized: the parent hands down referentially stable callbacks, so a
 * keystroke in the list toolbar only re-renders rows whose props — the
 * project record or its `selected` flag — actually changed.
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
  /** Renders the leading selection checkbox. */
  selectable?: boolean;
  /** Checked state of the selection checkbox. */
  selected?: boolean;
  /** Toggles selection for the row's id. */
  onSelect?: (id: string) => void;
  /**
   * Swaps this row with its neighbour in the parent's ordered list. Omitted
   * while the list is sorted or filtered, when a swap would not be visible.
   */
  onMove?: (id: string, direction: -1 | 1) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

function ProjectArchiveRowInner<T extends ProjectArchiveRowData>({
  project,
  index,
  onEdit,
  onDelete,
  selectable = false,
  selected = false,
  onSelect,
  onMove,
  canMoveUp = false,
  canMoveDown = false,
}: ProjectArchiveRowProps<T>) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="glass" hover="sweep">
        <div className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4">
          {selectable && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect?.(project.id)}
              aria-label={`Select ${project.title}`}
              className="h-4 w-4 shrink-0 cursor-pointer rounded-sm accent-gold-400 codex-focus"
            />
          )}

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
            <StatusDot tone="active" pulse />
            <span className="codex-label-active text-[8px]">DEPLOYED</span>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1">
            {onMove && (
              <div className="flex flex-col">
                <IconButton
                  label={`Move ${project.title} up`}
                  onClick={() => onMove(project.id, -1)}
                  disabled={!canMoveUp}
                  className="p-0.5 disabled:cursor-not-allowed disabled:opacity-30 sm:p-1"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton
                  label={`Move ${project.title} down`}
                  onClick={() => onMove(project.id, 1)}
                  disabled={!canMoveDown}
                  className="p-0.5 disabled:cursor-not-allowed disabled:opacity-30 sm:p-1"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            )}

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
