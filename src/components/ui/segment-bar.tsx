import { cn } from "@/lib/utils";

/**
 * SegmentBar — reusable HUD segment progress visualization.
 * Extracted from the dashboard skills page and SkillBar so every
 * segment-bar (landing matrix, dashboard cards, skeletons) shares
 * the same segmented gold/stellar bar rendering.
 */
interface SegmentBarProps {
  /** 0-100 percentage value. */
  value: number;
  /** Number of segments to render (default 10). */
  segments?: number;
  tone?: "gold" | "stellar";
  className?: string;
  label?: string;
}

export function SegmentBar({ value, segments = 10, tone = "gold", className, label }: SegmentBarProps) {
  const activeSegments = Math.round((value / 100) * segments);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `${value}%`}
      className={cn("segment-bar", className)}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "segment",
            i < activeSegments && "active",
            i < activeSegments && tone === "stellar" && "stellar"
          )}
        />
      ))}
    </div>
  );
}
