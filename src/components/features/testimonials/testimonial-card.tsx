"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/components/ui/row-actions";
import { cn } from "@/lib/utils";
import type { TestimonialDto } from "@/lib/dto";

interface TestimonialCardProps {
  testimonial: TestimonialDto;
  /** Grid position — drives the staggered enter animation delay. */
  index?: number;
  /** Renders the leading selection box (dashboard archive). */
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  /** Moves the entry one slot up (-1) or down (1) in the archive order. */
  onMove?: (testimonial: TestimonialDto, direction: -1 | 1) => void;
  /** False at the ends of the archive — the reorder controls disable there. */
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  /** True while this row's move request is in flight — disables its controls. */
  moving?: boolean;
  onEdit?: (testimonial: TestimonialDto) => void;
  onDelete?: (testimonial: TestimonialDto) => void;
}

/**
 * TestimonialCard — one testimonial entry.
 *
 * Every dashboard capability is opted into by its handler: the selection
 * box renders with `selectable`, the reorder controls with `onMove` and the
 * edit/delete pair with both action handlers, so the card also renders as a
 * plain read-only entry (avatar frame, name/role header, quoted content and
 * the position chip) wherever no console actions apply.
 */
export const TestimonialCard = memo(function TestimonialCard({
  testimonial: t,
  index = 0,
  selectable = false,
  selected = false,
  onSelect,
  onMove,
  canMoveUp = false,
  canMoveDown = false,
  moving = false,
  onEdit,
  onDelete,
}: TestimonialCardProps) {
  const showFooter = (onEdit !== undefined && onDelete !== undefined) || onMove !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        variant="glass"
        hover="sweep"
        className={cn(
          "codex-card codex-radius-card",
          selected && "ring-2 ring-leather-caramel/40"
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            {selectable && onSelect && (
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onSelect(t.id)}
                aria-label={`Select ${t.name}`}
                className="mt-3 h-4 w-4 shrink-0 cursor-pointer accent-leather-caramel codex-focus"
              />
            )}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden border border-leather-caramel/40 bg-leather-caramel/10">
              {t.avatar ? (
                // Raw img (not next/image): avatar URLs come from the
                // Prisma DB and may be arbitrary remote hosts, which
                // the image optimizer would reject. Native lazy loading
                // + async decoding still defer off-screen avatars.
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Quote className="h-5 w-5 text-gold-ink" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-medium tracking-wider text-leather-dark">
                {t.name}
              </p>
              <p className="mt-0.5 font-mono text-[9px] text-leather-muted">
                {t.role}
              </p>
            </div>
          </div>

          <div className="mt-3 codex-card codex-radius-card p-3">
            <p className="font-mono text-[11px] leading-relaxed text-leather-muted italic line-clamp-3">
              &ldquo;{t.content}&rdquo;
            </p>
          </div>

          {showFooter && (
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="codex-label text-[8px]">#{t.order}</span>
              <div className="flex items-center gap-1">
                {onMove && (
                  <>
                    <IconButton
                      label={`Move ${t.name} up`}
                      className="disabled:cursor-not-allowed disabled:opacity-30"
                      disabled={moving || !canMoveUp}
                      onClick={() => onMove(t, -1)}
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton
                      label={`Move ${t.name} down`}
                      className="disabled:cursor-not-allowed disabled:opacity-30"
                      disabled={moving || !canMoveDown}
                      onClick={() => onMove(t, 1)}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </IconButton>
                  </>
                )}
                {onEdit && onDelete && (
                  <RowActions
                    editLabel={`Edit ${t.name}`}
                    deleteLabel={`Delete ${t.name}`}
                    onEdit={() => onEdit(t)}
                    onDelete={() => onDelete(t)}
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});
