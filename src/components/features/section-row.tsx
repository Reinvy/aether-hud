"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Badge } from "@/components/ui/badge";
import { CodexGlyph } from "@/components/ui/codex-glyph";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/components/ui/row-actions";
import { cn } from "@/lib/utils";
import type { SectionDto } from "@/lib/dto";

interface SectionRowProps {
  section: SectionDto;
  index: number;
  /** Renders the leading selection box. */
  selectable: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  /** Moves the page one slot up (-1) or down (1) in the display order. */
  onMove: (section: SectionDto, direction: -1 | 1) => void;
  /** False at the ends of the registry — the reorder controls disable there. */
  canMoveUp: boolean;
  canMoveDown: boolean;
  /** True while this row's move request is in flight — disables its controls. */
  moving?: boolean;
  onToggle: (section: SectionDto) => void;
  onEdit: (section: SectionDto) => void;
  onDelete: (section: SectionDto) => void;
}

/**
 * SectionRow — one landing-section control row in the sections table.
 *
 * Renders selection, order/reorder, title/key/subtitle, the enabled toggle
 * and the row actions; the parent owns data fetching, pagination, the edit
 * modal and the toggle/reorder/delete handlers.
 */
export const SectionRow = memo(function SectionRow({
  section,
  index,
  selectable,
  selected,
  onSelect,
  onMove,
  canMoveUp,
  canMoveDown,
  moving = false,
  onToggle,
  onEdit,
  onDelete,
}: SectionRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        "border-b border-border-subtle/50 transition-colors hover:bg-leather-caramel/10",
        !section.enabled && "opacity-60",
        selected && "bg-leather-caramel/5"
      )}
    >
      {/* Selection */}
      <td className="px-4 py-4">
        {selectable && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(section.id)}
            aria-label={`Select ${section.title}`}
            className="h-4 w-4 cursor-pointer accent-leather-caramel codex-focus"
          />
        )}
      </td>
      {/* Order */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <span className="font-display text-[11px] tabular-nums text-leather-muted">
            {String(section.order).padStart(2, "0")}
          </span>
          <IconButton
            label={`Move ${section.title} up`}
            disabled={moving || !canMoveUp}
            className="disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => onMove(section, -1)}
          >
            <CodexGlyph name="up" />
          </IconButton>
          <IconButton
            label={`Move ${section.title} down`}
            disabled={moving || !canMoveDown}
            className="disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => onMove(section, 1)}
          >
            <CodexGlyph name="down" />
          </IconButton>
        </div>
      </td>
      {/* Title */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <AssetIcon icon="deckList" tone="ink" size="sm" />
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.08em] text-leather-dark">
              {section.title}
            </p>
            <p className="codex-label">
              {section.key}
            </p>
          </div>
        </div>
      </td>
      {/* Key */}
      <td className="px-4 py-4 hidden md:table-cell">
        <Badge variant="default" size="sm">
          {section.key}
        </Badge>
      </td>
      {/* Subtitle */}
      <td className="px-4 py-4 hidden sm:table-cell">
        <span className="font-body text-[10px] text-leather-muted">
          {section.subtitle || "—"}
        </span>
      </td>
      {/* Status */}
      <td className="px-4 py-4 text-center">
        <button
          type="button"
          onClick={() => onToggle(section)}
          aria-pressed={section.enabled}
          aria-label={`${section.enabled ? "Hide" : "Show"} ${section.title}`}
          className={cn(
            "inline-flex items-center gap-1.5 codex-btn px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all hover-scale-sm press-scale codex-focus",
            section.enabled
              ? "bg-jade-400/10 text-jade-ink hover:bg-jade-400/20"
              : "bg-crimson-600/8 text-crimson-600 hover:bg-crimson-600/8"
          )}
        >
          {section.enabled ? "Active" : "Hidden"}
        </button>
      </td>
      {/* Actions */}
      <td className="px-4 py-4 text-right">
        <RowActions
          className="justify-end"
          editLabel={`Edit ${section.title}`}
          deleteLabel={`Remove ${section.title}`}
          onEdit={() => onEdit(section)}
          onDelete={() => onDelete(section)}
        />
      </td>
    </motion.tr>
  );
});
