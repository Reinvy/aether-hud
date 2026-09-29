import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionErrorProps {
  /** Operator-facing message from `ApiError.message` or a load failure. */
  message: string;
  className?: string;
}

/**
 * ActionError — the single inline failure banner for the console.
 *
 * Every dashboard view reported a failed save, delete or load with its own
 * hand-rolled red box; they had drifted into three different paddings, two
 * different reds and one silent `console.error`. This is the one surface:
 * `role="alert"` so assistive tech announces it, crimson ink on a crimson wash,
 * and never a raw server string (callers pass `ApiError.message`).
 */
export function ActionError({ message, className }: ActionErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 codex-btn border border-crimson-600/30 bg-crimson-600/8 px-3 py-2",
        className
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-crimson-600" aria-hidden="true" />
      <p className="font-body text-xs text-crimson-600">{message}</p>
    </div>
  );
}
