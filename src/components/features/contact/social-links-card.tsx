"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Link2,
  Plus,
  Mail,
  Globe,
  GitBranch,
  MessageCircle,
  Palette,
  Tv,
  Gamepad2,
  Radio,
  Heart,
  Coffee,
  Video,
  Camera,
  Send,
  Code,
  Music,
  AtSign,
  BookOpen,
  GitFork,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBox } from "@/components/ui/icon-box";
import { IconButton } from "@/components/ui/icon-button";
import { RowActions } from "@/components/ui/row-actions";
import { cn } from "@/lib/utils";
import type { SocialDto } from "@/lib/dto";

/**
 * SocialLinksCard — dashboard widget for managing the contact network links.
 *
 * Owns the icon registry and the per-row presentation (selection, reorder,
 * edit/delete); the parent owns data fetching, pagination, modal state and
 * the delete flow.
 */

// Icon registry for social platforms — unknown icon names fall back to Link2.
// Registered names must stay in sync with the landing contact-section map.
const iconMap: Record<string, React.ElementType> = {
  Globe,
  GitBranch,
  MessageCircle,
  Mail,
  Link2,
  Tv,
  Gamepad2,
  Radio,
  Palette,
  Heart,
  Coffee,
  Video,
  Camera,
  Send,
  Code,
  Music,
  AtSign,
  BookOpen,
  GitFork,
  MessageSquare,
};

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
            <Link2 className="h-4 w-4 text-gold-ink" />
            <CardTitle>Social Links</CardTitle>
          </div>
          <Button variant="primary" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            Add link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {socials.length === 0 ? (
          <EmptyState
            icon={<Link2 className="h-5 w-5" />}
            title="No links to show"
            message={emptyMessage}
          />
        ) : (
          <div className="space-y-2" role="region" aria-label="Social registry">
            {socials.map((s, i) => {
              const Icon = iconMap[s.icon] || Link2;
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
                      <Icon className="h-4 w-4 text-gold-ink" />
                    </IconBox>
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-medium tracking-wider text-leather-dark">
                        {s.platform}
                      </p>
                      <p className="mt-0.5 max-w-[200px] truncate font-mono text-[9px] text-leather-muted">
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
                      <ChevronUp className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton
                      label={`Move ${s.platform} down`}
                      disabled={s.id === lastId || s.id === movingId}
                      className="disabled:cursor-not-allowed disabled:opacity-30"
                      onClick={() => onMove(s, 1)}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
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
