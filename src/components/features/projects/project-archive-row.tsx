"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodexGlyph } from "@/components/ui/codex-glyph";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/components/ui/row-actions";
import { StatusDot } from "@/components/ui/status-dot";

/**
 * ProjectArchiveRow — reusable project dossier row for archive lists.
 *
 * Extracted from the dashboard projects view so the same parchment dossier row
 * (selection checkbox + domain plate + truncated title/description + category
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
  /** A reorder write for this row is in flight — its move controls are disabled. */
  moving?: boolean;
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
  moving = false,
}: ProjectArchiveRowProps<T>) {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="ledger" hover="sweep" className="codex-radius-card">
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

          <AssetIcon icon="domain" size="sm" />

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xs font-semibold tracking-[0.08em] text-leather-dark group-hover:text-gold-ink transition-colors duration-200">
              {project.title}
            </p>
            <p className="mt-0.5 truncate font-body text-[9px] text-leather-muted">
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

          <span className="codex-label hidden text-[9px] lg:inline">
            {project.complexity}
          </span>

          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1">
            {onMove && (
              <div className="flex flex-col">
                <IconButton
                  label={`Move ${project.title} up`}
                  onClick={() => onMove(project.id, -1)}
                  disabled={!canMoveUp || moving}
                  className="p-0.5 disabled:cursor-not-allowed disabled:opacity-30 sm:p-1"
                >
                  <CodexGlyph name="up" />
                </IconButton>
                <IconButton
                  label={`Move ${project.title} down`}
                  onClick={() => onMove(project.id, 1)}
                  disabled={!canMoveDown || moving}
                  className="p-0.5 disabled:cursor-not-allowed disabled:opacity-30 sm:p-1"
                >
                  <CodexGlyph name="down" />
                </IconButton>
              </div>
            )}

            <RowActions
              onEdit={() => onEdit(project)}
              onDelete={() => onDelete(project)}
              leading={
                project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`} className="codex-focus codex-btn">
                    <Button variant="ghost" size="sm" glow="none" className="min-h-9 min-w-9 p-0 sm:min-h-0 sm:min-w-0 sm:p-2 hover:bg-leather-caramel/10 hover-scale-sm">
                      <CodexGlyph name="open" className="text-sm" />
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
