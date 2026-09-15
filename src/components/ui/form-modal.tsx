"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "danger";
  /** Label for the primary save button. */
  saveLabel?: string;
  /** Server or validation error rendered above the footer. */
  error?: string | null;
  /** Called when the primary save button is pressed. */
  onSave: () => void;
  /** Disables both footer buttons and shows the elemental spinner on save. */
  saving?: boolean;
  /** Form fields rendered inside the modal body. */
  children: ReactNode;
}

/**
 * FormModal — standardized create/edit modal for dashboard CRUD forms.
 *
 * Wraps the `Modal` with the canonical footer (cancel secondary + primary
 * save with the elemental loading spinner) and a consistent `space-y-4`
 * content gutter, so every CRUD form shares the same chrome instead of
 * re-declaring footer buttons inline.
 */
export function FormModal({
  open,
  onClose,
  title,
  size = "md",
  variant = "default",
  saveLabel = "Save",
  error = null,
  onSave,
  saving = false,
  children,
}: FormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      variant={variant}
      error={error}
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
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
