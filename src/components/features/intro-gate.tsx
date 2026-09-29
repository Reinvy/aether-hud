"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { TEYVAT_ELEMENTS } from "@/lib/element-assets";
import { EASE_CODEX } from "@/lib/motion-variants";

/** Session flag — the gate greets a visitor once per browser session. */
const GATE_STORAGE_KEY = "aether_gate_dismissed";

const TITLE_ID = "intro-gate-title";

/**
 * IntroGate — the seven-element threshold before the traveler dossier.
 *
 * An overlay dialog, not an any-key trap: it opens once per session, moves
 * focus to its explicit entry button, and dismisses on Escape, on the button,
 * or on the backdrop. The dossier behind it is always rendered, so crawlers
 * and screen readers never lose the page to the gate.
 */
export function IntroGate() {
  const [open, setOpen] = useState(false);
  const enterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sessionStorage.getItem(GATE_STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (open) {
      enterButtonRef.current?.focus();
    }
  }, [open]);

  const handleProceed = useCallback(() => {
    sessionStorage.setItem(GATE_STORAGE_KEY, "true");
    setOpen(false);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro-gate-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: EASE_CODEX }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              handleProceed();
            }
          }}
          onClick={handleProceed}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none bg-gradient-to-b from-parchment-base via-parchment-base to-parchment-subtle px-4 text-leather-dark"
        >
          {/* Subtle Outer Frame Inset */}
          <div className="absolute inset-4 sm:inset-8 border border-leather-caramel/15 pointer-events-none codex-panel-radius" />

          {/* Central Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-10 sm:space-y-12">
            {/* 7 Elemental Glyphs Row in Warm Bronze / Sepia */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_CODEX }}
              className="flex items-center justify-center gap-4 sm:gap-6"
            >
              {TEYVAT_ELEMENTS.map((elem) => (
                <div
                  key={elem.key}
                  className="codex-icon-plate h-9 w-9 sm:h-11 sm:w-11 transition-transform hover:scale-110"
                >
                  <Image
                    src={elem.whiteIcon}
                    alt={elem.name}
                    width={40}
                    height={40}
                    className="codex-icon-on-plate h-5 w-5 sm:h-6 sm:w-6 object-contain transition-opacity hover:opacity-100"
                    unoptimized
                  />
                </div>
              ))}
            </motion.div>

            {/* Title & Authorship Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              <h2
                id={TITLE_ID}
                className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-leather-dark"
              >
                The Teyvat Codex
              </h2>
              <span className="block font-serif italic text-xs sm:text-sm tracking-[0.25em] text-leather-caramel font-medium lowercase">
                kyou x gfx indonesia
              </span>
            </motion.div>

            {/* Pulsing Cursor Indicator + Explicit Entry CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col items-center gap-4"
            >
              <div aria-hidden="true" className="relative flex items-center justify-center">
                <span className="absolute w-6 h-6 rounded-full bg-leather-caramel/20 animate-ping" />
                <span className="w-3.5 h-3.5 rounded-full bg-leather-caramel/60 shadow-sm" />
              </div>

              <button
                ref={enterButtonRef}
                type="button"
                onClick={handleProceed}
                className="codex-btn-primary codex-focus inline-flex items-center justify-center px-8 py-3 font-serif text-sm font-bold tracking-[0.18em] uppercase"
              >
                Enter the Codex
              </button>

              <span className="font-body text-[11px] text-leather-muted tracking-widest">
                Press Escape to stay outside
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
