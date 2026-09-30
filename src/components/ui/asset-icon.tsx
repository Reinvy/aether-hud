import Image from "next/image";
import { cn } from "@/lib/utils";
import { GENSHIN_UI_ICONS, type GenshinIconKey } from "@/lib/ui-icons";

interface AssetIconProps {
  icon: GenshinIconKey;
  /** sm = 28px plate / 16px glyph, md = 36/20, lg = 44/24 */
  size?: "sm" | "md" | "lg";
  /** plate = leather medallion (parchment surfaces), ink = bare ink glyph on parchment,
   *  plain = bare unfiltered glyph for dark fills (cognac panel, gold-900) */
  tone?: "plate" | "ink" | "plain";
  /** Optional accessible name; omit for decorative icons. */
  label?: string;
  className?: string;
}

const PLATE_SIZE: Record<NonNullable<AssetIconProps["size"]>, string> = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};

const GLYPH_SIZE: Record<NonNullable<AssetIconProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const GLYPH_PX: Record<NonNullable<AssetIconProps["size"]>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

/**
 * The single renderer for the Teyvat Codex artwork pool. Plate glyphs are never
 * filtered — the pool mixes mono-white and colour art, and both read on leather.
 * `ink` is the mono-art-on-parchment treatment and the only filtered case.
 */
function AssetIcon({ icon, size = "md", tone = "plate", label, className }: AssetIconProps) {
  const image = (
    <Image
      src={GENSHIN_UI_ICONS[icon]}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      width={GLYPH_PX[size]}
      height={GLYPH_PX[size]}
      unoptimized
      className={cn(
        "object-contain",
        GLYPH_SIZE[size],
        tone === "ink" && "codex-icon-ink"
      )}
    />
  );

  if (tone !== "plate") return image;

  return (
    <span className={cn("codex-icon-plate", PLATE_SIZE[size], className)}>{image}</span>
  );
}

export { AssetIcon };
