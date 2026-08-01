import type { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * RowActions — reusable edit/delete action pair for dashboard list rows.
 * Extracted from projects/experiences/skills/testimonials pages which all
 * rendered the same ghost Pencil + danger Trash2 buttons.
 */
interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  /** Optional leading action(s) rendered before the edit button (e.g. external link). */
  leading?: ReactNode;
  className?: string;
}

export function RowActions({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  leading,
  className,
}: RowActionsProps) {
  return (
    <div className={cn("flex items-center gap-1 sm:gap-1", className)}>
      {leading}
      <Button
        variant="ghost"
        size="sm"
        glow="none"
        className="min-h-9 min-w-9 p-0 sm:min-h-0 sm:min-w-0 sm:p-2 hover:bg-glass-200"
        onClick={onEdit}
        aria-label={editLabel}
        title={editLabel}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        glow="none"
        className="min-h-9 min-w-9 p-0 sm:min-h-0 sm:min-w-0 sm:p-2 text-hud-danger hover:bg-[rgba(255,0,85,0.08)] hover:text-hud-danger"
        onClick={onDelete}
        aria-label={deleteLabel}
        title={deleteLabel}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
