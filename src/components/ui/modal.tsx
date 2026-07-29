"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  sysId?: string;
}

export function Modal({ open, onClose, title, children, className, sysId = "MODAL//00" }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-deep-space/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "glass-panel-strong chamfered-lg relative w-full max-w-lg p-0",
              "corner-brackets",
              className
            )}
          >
            {/* Header */}
            <div className="angled-bar flex items-center justify-between border-b border-border-subtle px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="sys-label-gold">{sysId}</span>
                {title && (
                  <h2 className="font-display text-sm font-bold tracking-wider uppercase text-text-main">
                    {title}
                  </h2>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded p-1 text-text-muted transition-colors hover:text-gold-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{children}</div>

            {/* Bottom sys node */}
            <span className="sys-node block" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
