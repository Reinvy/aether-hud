import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

/**
 * EmptyState — reusable HUD "no data" placeholder card.
 * Extracted from dashboard list pages (projects, experiences,
 * testimonials, sections) which all rendered the same
 * `[EMPTY] // ...` glass card with centered mono text.
 */
interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <Card variant="glass" hover="none" className={cn("sm:col-span-2", className)}>
      <CardContent className="p-8 text-center">
        <p className="font-mono text-sm text-text-muted">[EMPTY] // {message}</p>
      </CardContent>
    </Card>
  );
}
