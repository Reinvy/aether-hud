"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Sun, Moon, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useData } from "@/lib/use-data";
import { useTheme } from "@/components/theme-provider";
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
  const { themePreset, setThemePreset } = useTheme();

  const { data: sections } = useData<Section[]>("/api/sections");
  const { data: config } = useData<SiteConfig>("/api/config");

  const siteName = config?.siteName || "AETHER";
  const sysVersion = config?.sysVersion || "v2.4.1";
  const sysStatus = config?.status || "ONLINE";

  const isNight = themePreset === "night-ops" || themePreset === "celestial-night";

  const toggleTheme = () => {
    if (isNight) {
      setThemePreset("obsidian"); // Maps to default Teyvat Codex
    } else {
      setThemePreset("night-ops"); // Maps to Inazuma Celestial Night
    }
  };

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-parchment-base focus:text-leather-dark focus:border focus:border-leather-caramel/60 focus:outline-none focus:ring-2 focus:ring-leather-caramel/40 chamfered-sm font-mono text-xs tracking-wider"
      >
        SKIP TO MAIN CONTENT [↓]
      </a>

      {/* Top thin accent line */}
      <div className="relative h-[2px] bg-gradient-to-r from-transparent via-leather-caramel/40 dark:via-gold-500/50 to-transparent" />

      <nav
        aria-label="Main Navigation"
        className="parchment-panel-strong dark:glass-panel-strong mx-4 mt-2 rounded-none chamfered-sm px-4 py-2.5 sm:mx-6 lg:mx-8 border border-leather-caramel/25 dark:border-gold-400/25 shadow-lg"
      >
        <div className="flex items-center justify-between">
          {/* Left: Logo + Status */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label={`${siteName} Home`}
              className="flex items-center gap-2.5 group focus-ring-gold chamfered-xs p-1"
            >
              {/* Teyvat Crest Icon */}
              <div className="relative w-7 h-7 rounded-full bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/40 dark:border-gold-400/40 flex items-center justify-center transition-transform group-hover:rotate-45">
                <Sparkles className="h-4 w-4 text-leather-caramel dark:text-gold-400" aria-hidden="true" />
                <StatusDot tone="active" pulse label="System online" className="absolute -top-0.5 -right-0.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold tracking-[0.18em] text-leather-dark dark:text-platinum-50 uppercase">
                  {siteName}
                </span>
                <span className="text-[9px] font-mono tracking-widest text-leather-muted dark:text-text-muted hidden sm:block">
                  TEYVAT CODEX
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-2 md:flex pl-3 border-l border-leather-caramel/20 dark:border-gold-400/20">
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
                    "group relative px-4 py-2 text-xs font-mono tracking-widest transition-all duration-300 hover-scale-sm press-scale focus-ring-gold chamfered-xs font-semibold",
                    isActive
                      ? "text-leather-dark dark:text-gold-400"
                      : "text-leather-muted dark:text-text-muted hover:text-leather-dark dark:hover:text-gold-400"
                  )}
                >
                  {item.label}
                  {/* Hover line */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-2 right-2 h-[1.5px] bg-gradient-to-r from-leather-caramel/0 via-leather-caramel to-leather-caramel/0 dark:from-gold-500/0 dark:via-gold-500 dark:to-gold-500/0",
                      "scale-x-0 transition-transform duration-300",
                      "group-hover:scale-x-100",
                      isActive && "scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right: Theme Switcher + Time + Auth Button */}
          <div className="flex items-center gap-3">
            {/* Dual Theme Switcher (Ivory ☀️ / Night 🌙) */}
            <button
              onClick={toggleTheme}
              aria-label={isNight ? "Switch to Ivory Codex theme" : "Switch to Celestial Night theme"}
              title={isNight ? "Switch to Ivory Codex" : "Switch to Celestial Night"}
              className="chamfered-xs p-2 bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/30 dark:border-gold-400/30 text-leather-dark dark:text-gold-400 hover:scale-105 transition-all focus-ring-gold"
            >
              {isNight ? (
                <Sun className="h-4 w-4 text-gold-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-leather-caramel transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>

            {/* Time readout */}
            <div className="hidden items-center gap-2 lg:flex" aria-live="polite">
              <div className="flex items-center gap-2 chamfered-sm border border-leather-caramel/20 dark:border-gold-400/20 bg-parchment-subtle/80 dark:bg-deep-space/50 px-3 py-1.5">
                <StatusDot tone="active" label="Clock online" />
                <span className="font-mono text-[10px] tracking-[0.15em] text-leather-dark dark:text-text-muted tabular-nums font-semibold">
                  {time || "SYNCING…"}
                </span>
                <span className="text-[9px] font-mono text-leather-muted/60 dark:text-text-muted/40">
                  WIB
                </span>
              </div>
            </div>

            {/* Login / Dashboard Link */}
            <Link
              href="/login"
              aria-label="Staff Login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 chamfered-xs bg-leather-caramel/15 dark:bg-gold-400/15 border border-leather-caramel/30 dark:border-gold-400/30 text-leather-dark dark:text-gold-400 text-xs font-mono tracking-wider hover:bg-leather-caramel dark:hover:bg-gold-400 hover:text-parchment-base dark:hover:text-deep-space transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>LOGIN</span>
            </Link>

            {/* Mobile toggle */}
            <IconButton
              size="md"
              label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-leather-dark dark:text-text-main"
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
            className="parchment-panel-strong dark:glass-panel-strong chamfered-sm mx-4 mt-2 px-4 py-4 sm:mx-6 lg:mx-8 border border-leather-caramel/30 dark:border-gold-400/30"
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
                        ? "bg-leather-caramel/15 text-leather-dark dark:text-gold-400 border-l-2 border-leather-caramel dark:border-gold-400"
                        : "text-leather-muted dark:text-text-muted hover:bg-leather-caramel/10 hover:text-leather-dark dark:hover:text-gold-400"
                    )}
                  >
                    <span className="font-semibold">{item.label}</span>
                    <span className="sys-label">{item.sysId}</span>
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-leather-caramel/20 dark:border-gold-400/20 flex items-center justify-between">
                <Link
                  href="/login"
                  className="text-xs font-mono tracking-wider text-leather-caramel dark:text-gold-400 py-2 inline-flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>DASHBOARD LOGIN</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
