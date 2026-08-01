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
    <div className={cn("flex items-center gap-0.5 sm:gap-1", className)}>
      {leading}
      <Button
        variant="ghost"
        size="sm"
        glow="none"
        className="p-1.5 sm:p-2"
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
        className="p-1.5 sm:p-2 text-hud-danger hover:text-hud-danger"
        onClick={onDelete}
        aria-label={deleteLabel}
        title={deleteLabel}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
