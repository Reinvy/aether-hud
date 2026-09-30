import { AssetIcon } from "@/components/ui/asset-icon";
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
        "flex items-center gap-3 codex-btn border border-crimson-600/30 bg-crimson-600/8 px-3 py-2",
        className
      )}
    >
      {/* `warning` is colour art, so it renders on a plate, never as ink. */}
      <AssetIcon icon="warning" size="sm" />
      <p className="font-body text-xs text-crimson-600">{message}</p>
    </div>
  );
}
