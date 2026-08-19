"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useData } from "@/lib/use-data";
import { StatusDot } from "@/components/ui/status-dot";
import { IconButton } from "@/components/ui/icon-button";

interface Section {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  enabled: boolean;
  order: number;
}

interface SiteConfig {
  siteName: string;
  sysVersion: string;
  status: string;
}

export function HudHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState("");

  const { data: sections } = useData<Section[]>("/api/sections");
  const { data: config } = useData<SiteConfig>("/api/config");

  const siteName = config?.siteName || "AETHER";
  const sysVersion = config?.sysVersion || "v2.4.1";
  const sysStatus = config?.status || "ONLINE";

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Build nav items from API sections or fall back to constants
  const enabledSections = (sections ?? [])
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const dynamicNavItems =
    enabledSections.length > 0
      ? enabledSections.map((s, idx) => ({
          label: s.title.toUpperCase(),
          href: `/#${s.key}`,
          sysId: `NODE//${String(idx + 1).padStart(2, "0")}`,
        }))
      : [...NAV_ITEMS];

  const navItems = dynamicNavItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface-primary focus:text-gold-400 focus:border focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-400/40 chamfered-sm font-mono text-xs tracking-wider"
      >
        SKIP TO MAIN CONTENT [↓]
      </a>

      {/* Top thin accent line */}
      <div className="relative h-[2px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      <nav aria-label="Main Navigation" className="glass-panel-strong mx-4 mt-2 rounded-none chamfered-sm px-4 py-2.5 sm:mx-6 lg:mx-8">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Status */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label={`${siteName} Home`}
              className="flex items-center gap-3 group focus-ring-gold chamfered-xs p-1"
            >
              <div className="relative">
                <Activity className="h-5 w-5 text-gold-400 transition-transform group-hover:scale-110" aria-hidden="true" />
                <StatusDot tone="active" pulse label="System online" className="absolute -top-1 -right-1" />
              </div>
              <span className="font-display text-sm font-bold tracking-[0.15em] text-text-main hidden sm:block">
                {siteName}
              </span>
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <span className="led-active" aria-hidden="true" />
              <span className="sys-label-active text-[10px]">
                STATUS: {sysStatus}
              </span>
              <span className="sys-label text-[10px] font-mono tabular-nums">
                // {sysVersion}
              </span>
            </div>
          </div>

          {/* Center: Navigation */}
          <div className="hidden items-center gap-1 md:flex" role="menubar">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className={cn(
                    "group relative px-4 py-2 text-xs font-mono tracking-widest transition-all duration-300 hover-scale-sm press-scale focus-ring-gold chamfered-xs",
                    isActive
                      ? "text-gold-400"
                      : "text-text-muted hover:text-gold-400"
                  )}
                >
                  {item.label}
                  {/* Hover line */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-gold-500/0 via-gold-500 to-gold-500/0",
                      "scale-x-0 transition-transform duration-300",
                      "group-hover:scale-x-100",
                      isActive && "scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right: Time + Menu Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 md:flex" aria-live="polite">
              <div className="flex items-center gap-2 chamfered-sm border border-border-subtle bg-deep-space/50 px-3 py-1.5">
                <StatusDot tone="active" label="Clock online" />
                <span className="font-mono text-[10px] tracking-[0.15em] text-text-muted tabular-nums">
                  {time || "SYNCING…"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-muted/40">
                WIB
              </span>
            </div>

            {/* Mobile toggle */}
            <IconButton
              size="md"
              label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel-strong chamfered-sm mx-4 mt-2 px-4 py-4 sm:mx-6 lg:mx-8"
          >
            <div className="flex flex-col gap-1" role="menu">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className={cn(
                      "flex items-center justify-between chamfered-sm px-4 py-3 text-xs font-mono tracking-widest transition-all duration-300 hover-scale-sm press-scale focus-ring-gold",
                      isActive
                        ? "bg-[rgba(242,201,76,0.08)] text-gold-400 border-l-2 border-gold-400"
                        : "text-text-muted hover:bg-glass-200 hover:text-gold-400"
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="sys-label">{item.sysId}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
