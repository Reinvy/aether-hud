import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

/**
 * EmptyState — reusable HUD "no data" placeholder card.
 *
 * Extracted from dashboard list pages (projects, experiences,
 * testimonials, sections) which all rendered the same
 * `[EMPTY] // ...` glass card with centered mono text.
 *
 * Optional `icon`, `title`, and `action` props let callers turn the
 * bare placeholder into a rich empty state with a diamond accent,
 * HUD-styled title, and a primary call-to-action (e.g. "NEW DOSSIER").
 */
interface EmptyStateProps {
  message: string;
  /** Optional HUD-styled title rendered above the message (e.g. "NO DATA"). */
  title?: string;
  /** Optional icon rendered inside a chamfered icon box above the title. */
  icon?: ReactNode;
  /** Optional call-to-action rendered below the message. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ message, title, icon, action, className }: EmptyStateProps) {
  return (
    <Card variant="glass" hover="none" className={cn("sm:col-span-2", className)}>
      <CardContent className="relative p-8 text-center">
        {/* Diamond corner decor */}
        <span className="pointer-events-none absolute left-3 top-3 h-1.5 w-1.5 rotate-45 border border-border-glass" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-1.5 w-1.5 rotate-45 border border-border-glass" />

        {icon && (
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center border border-border-subtle bg-deep-space/50 text-gold-400/60">
            {icon}
          </div>
        )}

        {title && (
          <p className="mb-1 font-display text-sm font-bold tracking-[0.15em] text-text-muted uppercase">
            {title}
          </p>
        )}

        <p className="font-mono text-sm text-text-muted">[EMPTY] // {message}</p>

        {action && <div className="mt-4 flex justify-center">{action}</div>}
      </CardContent>
    </Card>
  );
}
