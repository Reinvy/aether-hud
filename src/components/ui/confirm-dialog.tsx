"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/status-dot";
import { AssetIcon } from "@/components/ui/asset-icon";
import { CodexGlyph } from "@/components/ui/codex-glyph";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  /** Short imperative title, e.g. "Remove domain" */
  title: string;
  /** Main warning copy rendered under the title. */
  message: ReactNode;
  /** Label for the destructive confirm button (defaults to "Remove"). */
  confirmLabel?: string;
  /** Label for the cancel button (defaults to "Cancel"). */
  cancelLabel?: string;
  /** Called when the destructive button is pressed. The dialog stays open
   *  until the caller closes it — pass `saving` while the async delete runs. */
  onConfirm: () => void;
  /** Disables both buttons and shows the elemental spinner on confirm. */
  saving?: boolean;
}

/**
 * ConfirmDialog — destructive confirmation modal.
 *
 * Replaces the native browser `confirm()` used in dashboard delete flows.
 * Renders the danger variant of the shared `Modal` with a warning icon and
 * the canonical cancel / destructive footer. Callers keep the dialog mounted
 * and flip `open` + `saving` around the async delete — no native dialogs,
 * no focus loss.
 */
export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel = "Remove",
  cancelLabel = "Cancel",
  onConfirm,
  saving = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      variant="danger"
      disableBackdropClose={saving}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={saving}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            loading={saving}
          >
            <CodexGlyph name="confirm" />
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <AssetIcon icon="warning" size="md" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <span className="codex-label-active text-[9px]">Please confirm</span>
            <div className="text-xs leading-relaxed text-leather-muted">{message}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-border-subtle pt-3">
          <StatusDot tone="danger" />
          <span className="codex-label text-[10px]">
            This action cannot be undone.
          </span>
        </div>
      </div>
    </Modal>
  );
}
