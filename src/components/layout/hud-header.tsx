"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, PORTFOLIO_CONFIG } from "@/lib/constants";
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

export function HudHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState("");

  const { data: sections } = useData<Section[]>("/api/sections");

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
      ? [
          ...enabledSections.map((s) => ({
            label: s.title.toUpperCase(),
            href: `/#${s.key}`,
            sysId: `NODE//${String(s.order + 1).padStart(2, "0")}`,
          })),
        ]
      : [...NAV_ITEMS];

  const navItems = dynamicNavItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Top thin accent line */}
      <div className="relative h-[2px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      <nav className="glass-panel-strong mx-4 mt-2 rounded-none chamfered-sm px-4 py-2.5 sm:mx-6 lg:mx-8">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Status */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Activity className="h-5 w-5 text-gold-400 transition-transform group-hover:scale-110" />
                <StatusDot tone="active" pulse label="System online" className="absolute -top-1 -right-1" />
              </div>
              <span className="font-display text-sm font-bold tracking-[0.15em] text-text-main hidden sm:block">
                AETHER
              </span>
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <span className="led-active" />
              <span className="sys-label-active text-[10px]">
                STATUS: ONLINE
              </span>
              <span className="sys-label text-[10px]">
                // {PORTFOLIO_CONFIG.sysVersion}
              </span>
            </div>
          </div>

          {/* Center: Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.sysId}
                  href={item.href}
                  className={cn(
                    "group relative px-4 py-2 text-xs font-mono tracking-widest transition-all duration-300 focus-ring-gold",
                    isActive
                      ? "text-gold-400"
                      : "text-text-muted hover:text-gold-400"
                  )}
                >
                  {item.label}
                  {/* Hover line */}
                  <span
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
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 chamfered-sm border border-border-subtle bg-deep-space/50 px-3 py-1.5">
                <StatusDot tone="active" label="Clock online" />
                <span className="font-mono text-[10px] tracking-[0.15em] text-text-muted">
                  {time || "LOADING..."}
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-muted/30">
                WIB
              </span>
            </div>

            {/* Mobile toggle — md size gives a 40px touch target (the
                dashboard hamburger already uses size="md"; the header
                previously used sm, an inconsistent ~28px hit area). */}
            <IconButton
              size="md"
              label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.sysId}
                    href={item.href}
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
