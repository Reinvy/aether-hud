"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  sysId?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "danger";
  /** Label for the primary save button. */
  saveLabel?: string;
  /** Called when the primary save button is pressed. */
  onSave: () => void;
  /** Disables both footer buttons and shows the HUD spinner on save. */
  saving?: boolean;
  /** Form fields rendered inside the modal body. */
  children: ReactNode;
}

/**
 * FormModal — standardized create/edit modal for dashboard CRUD forms.
 *
 * Wraps the HUD `Modal` with the canonical footer (CANCEL secondary +
 * primary save with HUD diamond loading spinner) and a consistent
 * `space-y-4` content gutter, so every CRUD form shares the same chrome
 * instead of re-declaring footer buttons inline.
 */
export function FormModal({
  open,
  onClose,
  title,
  sysId = "DASH//00",
  size = "md",
  variant = "default",
  saveLabel = "SAVE",
  onSave,
  saving = false,
  children,
}: FormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      sysId={sysId}
      size={size}
      variant={variant}
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={saving}
          >
            CANCEL
          </Button>
          <Button variant="primary" size="sm" onClick={onSave} loading={saving}>
            {saveLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">{children}</div>
    </Modal>
  );
}
