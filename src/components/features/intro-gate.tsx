"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { TEYVAT_ELEMENTS } from "@/lib/element-assets";

export function IntroGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user already dismissed gate this session
    const dismissed = sessionStorage.getItem("aether_gate_dismissed");
    if (!dismissed) {
      setOpen(true);
    }

    const handleKeyDown = () => {
      handleProceed();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleProceed = () => {
    sessionStorage.setItem("aether_gate_dismissed", "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro-gate-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={handleProceed}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none bg-[#FAF8F5] text-[#2C1E14] px-4"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, #FAF6EE 60%, #F3EDDE 100%)
          `,
        }}
      >
        {/* Subtle Outer Frame Inset */}
        <div className="absolute inset-4 sm:inset-8 border border-[#8C6239]/15 pointer-events-none rounded-2xl" />

        {/* Central Content (1:1 from ref_video.mp4) */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-12 sm:space-y-16">
          {/* 7 Elemental Glyphs Row in Warm Bronze / Sepia */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-4 sm:gap-6"
          >
            {TEYVAT_ELEMENTS.map((elem) => (
              <div
                key={elem.key}
                className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-transform hover:scale-110"
              >
                <Image
                  src={elem.gildedIcon}
                  alt={elem.name}
                  width={40}
                  height={40}
                  className="object-contain filter sepia-[0.3] contrast-[1.1] opacity-90 hover:opacity-100 transition-opacity"
                  unoptimized
                />
              </div>
            ))}
          </motion.div>

          {/* Subtitle / Authorship Label (1:1 from ref_video.mp4) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="-mt-8"
          >
            <span className="font-serif italic text-xs sm:text-sm tracking-[0.25em] text-[#8C6239] font-medium lowercase">
              kyou x gfx indonesia
            </span>
          </motion.div>

          {/* Interactive Cursor Pulse + Click to Proceed */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col items-center gap-3 pt-6"
          >
            {/* Animated Pulsing Dot Cursor */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-6 h-6 rounded-full bg-[#8C6239]/20 animate-ping" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#8C6239]/60 shadow-sm" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C1E14] drop-shadow-sm">
              Click to Proceed
            </h2>

            <span className="font-mono text-[10px] text-[#8C6239]/70 tracking-widest uppercase">
              [ Click anywhere or press any key ]
            </span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

