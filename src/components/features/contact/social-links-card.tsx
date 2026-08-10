"use client";

import { motion } from "framer-motion";
import {
  Link2,
  Plus,
  Mail,
  Globe,
  GitBranch,
  MessageCircle,
  MonitorPlay,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconBox } from "@/components/ui/icon-box";
import { RowActions } from "@/components/ui/row-actions";

/**
 * SocialLinksCard — dashboard widget for managing the contact network links.
 *
 * Extracted from the contact dashboard view (was inline) so the view stays a
 * thin orchestrator. Owns the icon registry and the per-row presentation;
 * the parent owns data fetching, modal state and the delete flow.
 */

export interface ApiSocial {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

// Icon registry for social platforms — unknown icon names fall back to Link2.
// Registered names must stay in sync with the landing contact-section map.
const iconMap: Record<string, React.ElementType> = {
  Globe,
  GitBranch,
  MessageCircle,
  Mail,
  Link2,
  MonitorPlay,
  Palette,
};

interface SocialLinksCardProps {
  socials: ApiSocial[];
  onAdd: () => void;
  onEdit: (social: ApiSocial) => void;
  onDelete: (social: ApiSocial) => void;
}

export function SocialLinksCard({
  socials,
  onAdd,
  onEdit,
  onDelete,
}: SocialLinksCardProps) {
  return (
    <Card variant="glass" hover="none" className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-gold-400" />
            <CardTitle>Social Links</CardTitle>
          </div>
          <Button variant="primary" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            ADD LINK
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {socials.length === 0 ? (
          <EmptyState
            icon={<Link2 className="h-5 w-5" />}
            title="NETWORK OFFLINE"
            message="No social links configured"
            className="sm:col-span-1"
          />
        ) : (
          <div className="space-y-2">
            {socials.map((s, i) => {
              const Icon = iconMap[s.icon] || Link2;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative flex items-center justify-between border border-border-subtle bg-deep-space/30 px-4 py-3 transition-all duration-300 hover:border-border-glass hover:bg-glass-200 hover-scale-sm"
                >
                  {/* Diamond accent on hover — mirrors Card micro-interaction */}
                  <span className="pointer-events-none absolute -top-px -right-px h-2.5 w-2.5 rotate-45 border-t border-r border-border-glass opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-gold-400/40" />
                  <div className="flex items-center gap-3 min-w-0">
                    <IconBox>
                      <Icon className="h-4 w-4 text-gold-400/60" />
                    </IconBox>
                    <div>
                      <p className="font-mono text-xs font-medium tracking-wider text-text-main">
                        {s.platform}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] text-text-muted truncate max-w-[200px]">
                        {s.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="sys-label text-[8px]">#{s.order}</span>
                    <RowActions
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
}
