"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  /** Short imperative title, e.g. "PURGE DOSSIER" */
  title: string;
  /** Optional HUD sys id shown next to the title (defaults to a danger-coded id). */
  sysId?: string;
  /** Main warning copy rendered under the title. */
  message: ReactNode;
  /** Label for the destructive confirm button (defaults to "PURGE"). */
  confirmLabel?: string;
  /** Label for the cancel button (defaults to "ABORT"). */
  cancelLabel?: string;
  /** Called when the destructive button is pressed. The dialog stays open
   *  until the caller closes it — pass `saving` while the async delete runs. */
  onConfirm: () => void;
  /** Disables both buttons and shows the HUD diamond spinner on confirm. */
  saving?: boolean;
}

/**
 * ConfirmDialog — HUD-styled destructive confirmation modal.
 *
 * Replaces the native browser `confirm()` used in dashboard delete flows.
 * Renders the danger variant of the shared HUD `Modal` with a warning
 * icon, chamfered danger panel, and the canonical ABORT / destructive
 * footer. Callers keep the dialog mounted and flip `open` + `saving`
 * around the async delete — no native dialogs, no focus loss.
 */
export function ConfirmDialog({
  open,
  onClose,
  title,
  sysId = "DANGER//CONFIRM",
  message,
  confirmLabel = "PURGE",
  cancelLabel = "ABORT",
  onConfirm,
  saving = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      sysId={sysId}
      size="sm"
      variant="danger"
      disableBackdropClose={saving}
      footer={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={saving}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            loading={saving}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 border border-hud-danger/30 bg-[rgba(255,0,85,0.08)] p-2.5">
            <AlertTriangle className="h-5 w-5 text-hud-danger" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <span className="sys-label-active text-[9px]">
              WARNING // IRREVERSIBLE ACTION
            </span>
            <div className="font-mono text-xs leading-relaxed text-text-muted">
              {message}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-border-subtle pt-3">
          <span className="led-warning" />
          <span className="font-mono text-[9px] tracking-[0.15em] text-text-muted/60">
            THIS OPERATION CANNOT BE UNDONE
          </span>
        </div>
      </div>
    </Modal>
  );
}
