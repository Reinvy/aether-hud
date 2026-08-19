"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { TEYVAT_ELEMENTS } from "@/lib/element-assets";

export function IntroGate() {
  const [open, setOpen] = useState(false);
  const [activeElementIndex, setActiveElementIndex] = useState(0);

  useEffect(() => {
    // Check if user already dismissed gate this session
    const dismissed = sessionStorage.getItem("aether_gate_dismissed");
    if (!dismissed) {
      setOpen(true);
    }

    const interval = setInterval(() => {
      setActiveElementIndex((prev) => (prev + 1) % TEYVAT_ELEMENTS.length);
    }, 1200);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleProceed();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleProceed = () => {
    sessionStorage.setItem("aether_gate_dismissed", "true");
    setOpen(false);
  };

  if (!open) return null;

  const currentElement = TEYVAT_ELEMENTS[activeElementIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="intro-gate-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0A0D1A] text-parchment-base select-none px-4"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 30%, rgba(201, 154, 78, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 50% 80%, rgba(13, 17, 34, 0.95) 0%, #070913 100%)
          `,
        }}
      >
        {/* Subtle Constellation Star Background */}
        <div className="absolute inset-0 bg-starfield opacity-40 pointer-events-none" />

        {/* Outer Ornate Filigree Corner Accents */}
        <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-gold-400/40 pointer-events-none" />
        <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-gold-400/40 pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-gold-400/40 pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-gold-400/40 pointer-events-none" />

        {/* Central Content Box */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
          {/* Top Latin Crest Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 mb-3"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="font-display tracking-[0.3em] text-xs uppercase text-gold-400/90 font-semibold">
              TEYVAT CODEX // REINVY DOSSIER
            </span>
            <Sparkles className="w-4 h-4 text-gold-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl font-bold tracking-widest text-platinum-50 uppercase drop-shadow-[0_2px_12px_rgba(201,154,78,0.3)] mb-2"
          >
            THE TRAVELER
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-display italic text-sm text-gold-400/80 tracking-wider mb-8"
          >
            旅人 — Architectural Records of Seven Realms
          </motion.p>

          {/* 7 Elemental Glyphs Row using Official Gilded & Glow Assets */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-3 sm:gap-4 my-6 p-4 rounded-full bg-black/40 border border-gold-400/30 backdrop-blur-md shadow-[0_0_30px_rgba(201,154,78,0.15)]"
          >
            {TEYVAT_ELEMENTS.map((elem, idx) => {
              const isActive = idx === activeElementIndex;
              return (
                <motion.div
                  key={elem.key}
                  animate={{
                    scale: isActive ? 1.25 : 1,
                    filter: isActive
                      ? `drop-shadow(0 0 12px ${elem.color})`
                      : "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center cursor-pointer transition-transform"
                  onClick={() => setActiveElementIndex(idx)}
                >
                  <Image
                    src={isActive ? elem.glowIcon : elem.gildedIcon}
                    alt={elem.name}
                    width={44}
                    height={44}
                    className="object-contain"
                    unoptimized
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Active Element Info */}
          <motion.div
            key={currentElement.key}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="h-8 mb-8 flex items-center gap-2"
          >
            <span
              className="font-mono text-xs font-bold tracking-widest uppercase"
              style={{ color: currentElement.color }}
            >
              [VISION: {currentElement.name.toUpperCase()}]
            </span>
            <span className="font-mono text-xs text-platinum-400">
              — {currentElement.domain}
            </span>
          </motion.div>

          {/* Glowing "Click to Proceed" CTA Button */}
          <motion.button
            type="button"
            onClick={handleProceed}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group relative px-8 py-3.5 chamfered bg-gradient-to-r from-[#8C6239] via-[#C99A4E] to-[#8C6239] text-[#1A1208] font-display font-bold tracking-[0.2em] text-sm uppercase shadow-[0_0_25px_rgba(201,154,78,0.4)] hover:shadow-[0_0_35px_rgba(201,154,78,0.7)] transition-all cursor-pointer flex items-center gap-3 border border-[#FAF7EE]/60"
          >
            <span>CLICK TO PROCEED</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Keyboard hint & Skip */}
          <div className="mt-8 flex items-center gap-4 text-[11px] font-mono text-platinum-400/60">
            <span>PRESS [ENTER] OR [SPACE]</span>
            <span>•</span>
            <button
              type="button"
              onClick={handleProceed}
              className="hover:text-gold-400 underline underline-offset-4 transition-colors"
            >
              SKIP GATE [ESC]
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
