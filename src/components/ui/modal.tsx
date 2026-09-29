"use client";

import { useEffect, useCallback, useRef, useId, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_CODEX } from "@/lib/motion-variants";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "danger";
  /** Error message surfaced above the footer (server or validation failure). */
  error?: string | null;
  /** Prevent close on backdrop click */
  disableBackdropClose?: boolean;
}

const sizeStyles: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const variantStyles: Record<string, string> = {
  default: "",
  danger: "border-crimson-600/30",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  size = "md",
  variant = "default",
  error = null,
  disableBackdropClose = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Escape honours the same switch as the backdrop, so an in-flight save
      // (disableBackdropClose) can never be aborted by a stray key press.
      if (e.key === "Escape" && !disableBackdropClose) onClose();
      // Focus trap: keep Tab cycling inside the dialog, never behind it.
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !panel.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose, disableBackdropClose]
  );

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus management: remember the trigger, move focus into the dialog on
  // open, and restore it to the trigger on close/unmount.
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement | null;
      const panel = panelRef.current;
      if (panel) {
        const focusables = Array.from(
          panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);
        // Prefer the first real control (form field / ABORT) over the close
        // button — destructive dialogs focus the safe action, not the danger one.
        const target =
          focusables.find((el) => el.getAttribute("aria-label") !== "Close modal") ??
          panel;
        target.focus();
      }
    }
    // Restore focus on close (open flips false) OR on unmount — the
    // ConfirmDialog/FormModal consumers are conditionally mounted
    // (`{deleteTarget && <ConfirmDialog open .../>}`), so closing unmounts
    // the whole component with `open` still true; both paths must restore.
    return () => {
      if (previousFocus.current) {
        if (document.contains(previousFocus.current)) {
          previousFocus.current.focus();
        }
        previousFocus.current = null;
      }
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="codex-scrim absolute inset-0"
            onClick={disableBackdropClose ? undefined : onClose}
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: EASE_CODEX }}
            className={cn(
              "codex-card-strong codex-panel-radius relative z-10 w-full max-h-[90vh] overflow-y-auto outline-none",
              sizeStyles[size] || sizeStyles.md,
              variantStyles[variant] || variantStyles.default,
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3 sm:px-6 sm:py-4">
              {title && (
                <h2
                  id={titleId}
                  className="font-display text-sm font-bold tracking-wider uppercase text-leather-dark truncate"
                >
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                title="Close modal"
                className="codex-btn min-h-9 min-w-9 shrink-0 p-0 text-leather-muted transition-all duration-200 hover:text-gold-ink hover-scale-sm press-scale codex-focus sm:min-h-0 sm:min-w-0 sm:p-1.5"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Diamond indicator */}
            <div className="absolute top-3 right-3 flex gap-1 pointer-events-none">
              <span className="h-1.5 w-1.5 rotate-45 bg-leather-caramel/40" />
              <span className="h-1.5 w-1.5 rotate-45 bg-leather-caramel/20" />
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">{children}</div>

            {error && (
              <p role="alert" className="px-4 pb-3 text-[11px] text-crimson-600 sm:px-6">
                {error}
              </p>
            )}

            {/* Footer */}
            {footer && (
              <div className="border-t border-border-subtle px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
