import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AssetIcon } from "@/components/ui/asset-icon";
import type { GenshinIconKey } from "@/lib/ui-icons";

/**
 * EmptyState — reusable "no data" placeholder card.
 *
 * Extracted from dashboard list pages (projects, experiences,
 * testimonials, sections) which all rendered the same
 * parchment card with centered mono text.
 *
 * Optional `icon`, `title`, and `action` props let callers turn the
 * bare placeholder into a rich empty state with a accent,
 * designed title, and a primary call-to-action (e.g. "NEW DOSSIER").
 */
interface EmptyStateProps {
  message: string;
  /** Optional designed title rendered above the message (e.g. "NO DATA"). */
  title?: string;
  /** Optional icon rendered inside a icon box above the title. */
  icon?: GenshinIconKey;
  /** Optional call-to-action rendered below the message. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ message, title, icon, action, className }: EmptyStateProps) {
  return (
    <Card variant="glass" hover="none" className={cn(className)}>
      <CardContent className="relative p-8 text-center">
        {/* Diamond corner decor */}
        <span className="pointer-events-none absolute left-3 top-3 h-1.5 w-1.5 rotate-45 border border-leather-caramel/40" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-1.5 w-1.5 rotate-45 border border-leather-caramel/40" />

        {icon && (
          <div className="mx-auto mb-3 flex items-center justify-center">
            {/* The title carries the meaning; the medallion is decorative. */}
            <AssetIcon icon={icon} size="md" />
          </div>
        )}

        {title && (
          <p className="mb-1 font-display text-sm font-bold tracking-[0.15em] text-leather-muted uppercase">
            {title}
          </p>
        )}

        <p className="text-sm text-leather-muted">{message}</p>

        {action && <div className="mt-4 flex justify-center">{action}</div>}
      </CardContent>
    </Card>
  );
}
