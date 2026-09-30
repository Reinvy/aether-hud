"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodexGlyph } from "@/components/ui/codex-glyph";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBox } from "@/components/ui/icon-box";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/components/ui/row-actions";
import { cn } from "@/lib/utils";
import type { SocialDto } from "@/lib/dto";

/**
 * SocialLinksCard — dashboard widget for managing the contact network links.
 *
 * The console speaks one channel language: every link row carries the same
 * community mark, so the row reads as a codex entry rather than a platform
 * logo wall. The parent owns data fetching, pagination, modal state and the
 * delete flow.
 */

interface SocialLinksCardProps {
  socials: SocialDto[];
  /** Renders the leading selection box on every row. */
  selectable: boolean;
  selectedIds: ReadonlySet<string>;
  onSelect: (id: string) => void;
  /** Empty-state copy; the view swaps it in when a search hides every row. */
  emptyMessage?: string;
  /** Moves the link one slot up (-1) or down (1) in the network order. */
  onMove: (social: SocialDto, direction: -1 | 1) => void;
  /** Ids of the first and last link in display order; the reorder controls
   *  disable on those two rows. */
  firstId: string | null;
  lastId: string | null;
  /** Id of the link whose move request is in flight — its controls disable. */
  movingId?: string | null;
  onAdd: () => void;
  onEdit: (social: SocialDto) => void;
  onDelete: (social: SocialDto) => void;
}

export const SocialLinksCard = memo(function SocialLinksCard({
  socials,
  selectable,
  selectedIds,
  onSelect,
  emptyMessage = "Add a link to publish it on your landing page.",
  onMove,
  firstId,
  lastId,
  movingId = null,
  onAdd,
  onEdit,
  onDelete,
}: SocialLinksCardProps) {
  return (
    <Card variant="glass" hover="none" className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AssetIcon icon="community" size="sm" />
            <CardTitle>Social Links</CardTitle>
          </div>
          <Button variant="primary" size="sm" onClick={onAdd}>
            <CodexGlyph name="add" />
            Add link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {socials.length === 0 ? (
          <EmptyState
            icon="community"
            title="No links to show"
            message={emptyMessage}
          />
        ) : (
          <div className="space-y-2" role="region" aria-label="Social registry">
            {socials.map((s, i) => {
              const selected = selectedIds.has(s.id);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "group relative flex items-center justify-between gap-3 codex-card codex-radius-card px-4 py-3 transition-all duration-300 hover:bg-leather-caramel/10 hover-scale-sm",
                    selected && "border-leather-caramel/50"
                  )}
                >
                  {/* Diamond accent on hover — mirrors Card micro-interaction */}
                  <span className="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 rotate-45 border-t border-r border-leather-caramel/40 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-gold-400/40" />
                  <div className="flex min-w-0 items-center gap-3">
                    {selectable && (
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onSelect(s.id)}
                        aria-label={`Select ${s.platform}`}
                        className="h-4 w-4 shrink-0 cursor-pointer accent-leather-caramel codex-focus"
                      />
                    )}
                    <IconBox>
                      <AssetIcon icon="community" tone="ink" size="sm" />
                    </IconBox>
                    <div className="min-w-0">
                      <p className="font-display text-xs font-semibold tracking-[0.08em] text-leather-dark">
                        {s.platform}
                      </p>
                      <p className="mt-0.5 max-w-[200px] truncate font-body text-[9px] text-leather-muted">
                        {s.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <span className="codex-label text-[8px]">#{s.order}</span>
                    <IconButton
                      label={`Move ${s.platform} up`}
                      disabled={s.id === firstId || s.id === movingId}
                      className="disabled:cursor-not-allowed disabled:opacity-30"
                      onClick={() => onMove(s, -1)}
                    >
                      <CodexGlyph name="up" />
                    </IconButton>
                    <IconButton
                      label={`Move ${s.platform} down`}
                      disabled={s.id === lastId || s.id === movingId}
                      className="disabled:cursor-not-allowed disabled:opacity-30"
                      onClick={() => onMove(s, 1)}
                    >
                      <CodexGlyph name="down" />
                    </IconButton>
                    <RowActions
                      editLabel={`Edit ${s.platform}`}
                      deleteLabel={`Remove ${s.platform}`}
                      onEdit={() => onEdit(s)}
                      onDelete={() => onDelete(s)}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
