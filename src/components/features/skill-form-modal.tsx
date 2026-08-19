"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormModal } from "@/components/ui/form-modal";

/**
 * SkillFormModal — create/edit skill module modal for the dashboard skill
 * matrix.
 *
 * Extracted from dashboard/skills page so the whole form (fields + save
 * logic) can be lazy-loaded as its own chunk via next/dynamic — it only
 * renders when the operator opens the modal, keeping the matrix list's
 * initial bundle small. Data comes from the API (POST/PUT /api/skills).
 */

export interface SkillFormRecord {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
}

type FormData = {
  name: string;
  level: string;
  category: string;
  icon: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  level: "85",
  category: "",
  icon: "Zap",
};

function toForm(skill: SkillFormRecord | null): FormData {
  if (!skill) return EMPTY_FORM;
  return {
    name: skill.name,
    level: String(skill.level),
    category: skill.category,
    icon: skill.icon,
  };
}

interface SkillFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Skill being edited, or null for a new module. */
  skill: SkillFormRecord | null;
  /** Called after a successful save so the parent can refetch + close. */
  onSaved: () => void;
}

export function SkillFormModal({
  open,
  onClose,
  skill,
  onSaved,
}: SkillFormModalProps) {
  const [form, setForm] = useState<FormData>(() => toForm(skill));
  const [saving, setSaving] = useState(false);

  // Re-sync the form whenever the modal opens with a (different) skill.
  useEffect(() => {
    if (open) setForm(toForm(skill));
  }, [open, skill]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        name: form.name,
        level: parseInt(form.level, 10) || 0,
        category: form.category,
        icon: form.icon,
      };

      if (skill) {
        await fetch("/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: skill.id, ...body }),
        });
      } else {
        await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      onSaved();
    } catch (e) {
      console.error("Failed to save skill", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={skill ? "EDIT SKILL MODULE" : "NEW SKILL MODULE"}
      sysId={skill ? `DASH//02 // ${skill.id.slice(0, 8)}` : "DASH//02 // NEW"}
      saveLabel="CALIBRATE"
      onSave={handleSave}
      saving={saving}
    >
      <Input
        label="FIELD_01 // SKILL NAME"
        placeholder="e.g., React Native"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="FIELD_02 // CATEGORY"
          placeholder="Frontend"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        />
        <Input
          label="FIELD_03 // LEVEL (0-100)"
          type="number"
          min={0}
          max={100}
          placeholder="85"
          value={form.level}
          onChange={(e) => updateField("level", e.target.value)}
        />
      </div>
      <Select
        label="FIELD_04 // ICON"
        value={form.icon}
        onChange={(e) => updateField("icon", e.target.value)}
        options={[
          { value: "Zap", label: "Zap // Energy & Speed" },
          { value: "Globe", label: "Globe // Web & Frontend" },
          { value: "FileCode", label: "FileCode // Languages" },
          { value: "Palette", label: "Palette // Styling & CSS" },
          { value: "Server", label: "Server // Backend & APIs" },
          { value: "Database", label: "Database // Data & SQL" },
          { value: "Brain", label: "Brain // AI & Machine Learning" },
          { value: "Bot", label: "Bot // AI Agents & LLMs" },
          { value: "Terminal", label: "Terminal // Systems & CLI" },
          { value: "Radio", label: "Radio // Realtime & WebSockets" },
          { value: "Network", label: "Network // Architecture" },
          { value: "Container", label: "Container // Docker & K8s" },
          { value: "Rocket", label: "Rocket // DevOps & Cloud" },
          { value: "PenTool", label: "PenTool // Design & Figma" },
          { value: "Code", label: "Code // General Development" },
          { value: "Cpu", label: "Cpu // Compute Core" },
        ]}
      />
    </FormModal>
  );
}
