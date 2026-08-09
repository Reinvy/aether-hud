"use client";

import { motion } from "framer-motion";

/**
 * HeroStatusBadge — HUD status pill for the hero section.
 *
 * Reusable variant of the AETHER-HUD "system status" indicator: an
 * LED-active dot, an all-caps mono status label and the running system
 * version, framed in a chamfered tactical border. Extracted from the
 * hero section so other surfaces (profile headers, system banners) can
 * reuse the same status chrome.
 */
interface HeroStatusBadgeProps {
  /** Operator status, e.g. "ONLINE" — rendered after `STATUS:`. */
  status: string;
  /** Running system version, e.g. "v2.4.1". */
  sysVersion: string;
  /** Optional decorative node id shown after the version. */
  sysId?: string;
}

export function HeroStatusBadge({
  status,
  sysVersion,
  sysId = "SYS_READY",
}: HeroStatusBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="flex justify-center"
    >
      <div className="inline-flex items-center gap-2 rounded-none border border-border-glass bg-[rgba(242,201,76,0.06)] px-4 py-1.5 tactical-btn">
        <span className="led-active" />
        <span className="sys-label-active text-[10px]">
          STATUS: {status} // {sysId}
        </span>
        <span className="sys-label text-[10px]">{sysVersion}</span>
      </div>
    </motion.div>
  );
}
