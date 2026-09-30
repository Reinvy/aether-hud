import { cn } from "@/lib/utils";
import { CODEX_GLYPHS, type CodexGlyphName } from "@/lib/ui-icons";

interface CodexGlyphProps {
  name: CodexGlyphName;
  /** Optional accessible name; omit when the glyph is decorative. */
  label?: string;
  className?: string;
}

/** Typographic mark for roles the artwork pool carries no glyph for. */
function CodexGlyph({ name, label, className }: CodexGlyphProps) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("codex-glyph", className)}
    >
      {CODEX_GLYPHS[name]}
    </span>
  );
}

export { CodexGlyph };
