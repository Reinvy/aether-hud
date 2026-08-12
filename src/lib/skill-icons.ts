import type { ElementType } from "react";
import {
  Globe,
  FileCode,
  Palette,
  Server,
  Database,
  Brain,
  Zap,
  Container,
  PenTool,
  Rocket,
} from "lucide-react";

/**
 * AETHER-HUD skill-icon registry — single source of truth for the 10
 * registered skill icons.
 *
 * Landing `SkillBar` and dashboard `SkillCard` previously each shipped
 * their own copy of this map and had to be kept in sync by hand; both
 * now resolve through this module. If a new skill icon is added, register
 * it here (explicit imports keep the bundle tree-shaking friendly).
 *
 * NOTE: per-component fallbacks stay local — `SkillBar` falls back to
 * `Zap`, `SkillCard` to `Cpu` (their original behavior is preserved).
 */
export const skillIcons: Record<string, ElementType> = {
  Globe,
  FileCode,
  Palette,
  Server,
  Database,
  Brain,
  Zap,
  Container,
  PenTool,
  Rocket,
};
