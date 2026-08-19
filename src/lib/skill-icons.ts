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
  Terminal,
  Radio,
  Bot,
  Network,
  Cpu,
  Code,
  Layers,
} from "lucide-react";

/**
 * AETHER-HUD skill-icon registry — single source of truth for the
 * registered skill icons.
 *
 * Landing `SkillBar` and dashboard `SkillCard` resolve through this module.
 * Explicit imports keep the bundle tree-shaking friendly.
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
  Terminal,
  Radio,
  Bot,
  Network,
  Cpu,
  Code,
  Layers,
};

