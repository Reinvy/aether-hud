"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// 7 Elemental Glyphs SVG definitions
export const ELEMENT_ICONS: { key: string; name: string; color: string; path: string }[] = [
  {
    key: "pyro",
    name: "Pyro",
    color: "#FF5E41",
    path: "M12 2C12 2 7 8 7 13C7 16.31 9.69 19 13 19C15.22 19 17.15 17.79 18.17 16C17.38 16 16.64 15.65 16.12 15.08C15.42 14.31 15.21 13.19 15.58 12.23C15.82 11.61 16.33 11.08 17 10.74C17.7 10.38 18.5 10.3 19.24 10.5C19.98 10.7 20.61 11.17 21 11.8C20.6 8.5 17.5 4.5 12 2Z",
  },
  {
    key: "hydro",
    name: "Hydro",
    color: "#29B6F6",
    path: "M12 2.69L17.66 8.35C20.78 11.47 20.78 16.53 17.66 19.65C14.54 22.77 9.48 22.77 6.36 19.65C3.24 16.53 3.24 11.47 6.36 8.35L12 2.69Z",
  },
  {
    key: "anemo",
    name: "Anemo",
    color: "#4DD0E1",
    path: "M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18Z",
  },
  {
    key: "electro",
    name: "Electro",
    color: "#B388FF",
    path: "M11 21H7V13H3L13 3V11H17L7 21H11Z",
  },
  {
    key: "dendro",
    name: "Dendro",
    color: "#7CB342",
    path: "M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L7.04 18.73C8.42 15.37 10.97 12.82 14.33 11.44L17.6 10.11L17 8ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z",
  },
  {
    key: "cryo",
    name: "Cryo",
    color: "#80DEEA",
    path: "M12 2L14.5 7.5L20 5L17.5 10.5L23 12L17.5 13.5L20 19L14.5 16.5L12 22L9.5 16.5L4 19L6.5 13.5L1 12L6.5 10.5L4 5L9.5 7.5L12 2Z",
  },
  {
    key: "geo",
    name: "Geo",
    color: "#FFB74D",
    path: "M12 2L2 9.5L5.82 21H18.18L22 9.5L12 2ZM12 6L17.5 10.12L15.39 16.5H8.61L6.5 10.12L12 6Z",
  },
];

interface IntroGateProps {
  onProceed?: () => void;
}

export function IntroGate({ onProceed }: IntroGateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Check if user already saw intro during this session
    const seen = sessionStorage.getItem("aether_intro_seen");
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  // Cycle glowing element in intro
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ELEMENT_ICONS.length);
    }, 800);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleProceed = () => {
    sessionStorage.setItem("aether_intro_seen", "true");
    setIsOpen(false);
    onProceed?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7EE] dark:bg-[#070913] px-4 text-center select-none"
        >
          {/* Subtle radial ambient light */}
          <div className="pointer-events-none absolute inset-0 bg-ambient-gold opacity-60" />
          <div className="pointer-events-none absolute inset-0 bg-grid-hud opacity-20" />

          {/* Top Skip Button */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={handleProceed}
              className="tactical-btn text-xs font-mono tracking-widest px-4 py-2 border border-leather-caramel/30 bg-parchment-subtle/80 dark:bg-surface-primary/80 text-leather-muted dark:text-platinum-200 hover:text-leather-dark dark:hover:text-gold-400 transition-all"
            >
              SKIP INTRO [ESC]
            </button>
          </div>

          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
            {/* 7 Elemental Glyphs Row */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-3 sm:gap-6 py-6"
            >
              {ELEMENT_ICONS.map((el, i) => {
                const isActive = i === activeIndex;
                return (
                  <motion.div
                    key={el.key}
                    animate={{
                      scale: isActive ? 1.25 : 1,
                      filter: isActive
                        ? `drop-shadow(0 0 12px ${el.color})`
                        : "drop-shadow(0 0 0px rgba(0,0,0,0))",
                    }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => setActiveIndex(i)}
                  >
                    <div
                      className="w-8 h-8 sm:w-11 sm:h-11 rounded-none chamfered-xs flex items-center justify-center transition-colors border"
                      style={{
                        borderColor: isActive ? el.color : "rgba(140, 98, 57, 0.25)",
                        backgroundColor: isActive ? `${el.color}15` : "rgba(140, 98, 57, 0.05)",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 sm:w-6 sm:h-6 transition-transform"
                        style={{ color: isActive ? el.color : "#8C6239" }}
                      >
                        <path d={el.path} />
                      </svg>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Subtitle / Lore credit */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xs font-serif tracking-[0.25em] text-leather-muted dark:text-text-muted uppercase mt-2"
            >
              AETHER TEYVAT CODEX // REINVY DOSSIER
            </motion.p>

            {/* Center Pulsing Proceed Trigger */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              {/* Pulsing Dot */}
              <div className="relative">
                <span className="inline-block w-4 h-4 rounded-full bg-leather-caramel/40 dark:bg-gold-400/40 animate-ping absolute inset-0" />
                <span className="inline-block w-4 h-4 rounded-full bg-leather-caramel dark:bg-gold-400 relative z-10" />
              </div>

              {/* Main CTA Button */}
              <button
                onClick={handleProceed}
                className="tactical-btn group btn-glow-sweep px-8 py-3.5 bg-gradient-to-r from-leather-caramel to-[#73502E] dark:from-gold-600 dark:to-gold-500 text-parchment-base dark:text-deep-space font-display text-sm tracking-[0.2em] uppercase font-bold shadow-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3"
              >
                <span>Click to Proceed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
