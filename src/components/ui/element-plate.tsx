import Image from "next/image";
import { elementForSkillCategory } from "@/lib/element-assets";
import { cn } from "@/lib/utils";

interface ElementPlateProps {
  /** Skill category — resolved to the vision the discipline grants. */
  category: string;
  /** sm = 28px plate / 16px glyph, md = 36/20, lg = 44/24 */
  size?: "sm" | "md" | "lg";
  /** Optional accessible name; omit for decorative marks. */
  label?: string;
  className?: string;
}

const PLATE_SIZE = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-11 w-11" } as const;
const GLYPH_SIZE = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" } as const;
const GLYPH_PX = { sm: 16, md: 20, lg: 24 } as const;

/**
 * ElementPlate — a skill's vision medallion. The elemental art is white line
 * art in every variant, so this is the one plate that keeps the invert filter.
 */
function ElementPlate({ category, size = "sm", label, className }: ElementPlateProps) {
  const element = elementForSkillCategory(category);
  return (
    <span className={cn("codex-icon-plate", PLATE_SIZE[size], className)}>
      <Image
        src={element.whiteIcon}
        alt={label ?? ""}
        aria-hidden={label ? undefined : true}
        width={GLYPH_PX[size]}
        height={GLYPH_PX[size]}
        unoptimized
        className={cn("codex-icon-on-plate object-contain", GLYPH_SIZE[size])}
      />
    </span>
  );
}

export { ElementPlate };
