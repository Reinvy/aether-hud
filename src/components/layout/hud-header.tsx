"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useData } from "@/lib/use-data";
import { useTheme } from "@/components/theme-provider";
import { StatusDot } from "@/components/ui/status-dot";
import { IconButton } from "@/components/ui/icon-button";
import { GENSHIN_UI_ICONS } from "@/lib/ui-icons";

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

  const isNight = themePreset === "celestial-night";

  const toggleTheme = () => {
    if (isNight) {
      setThemePreset("teyvat-codex");
    } else {
      setThemePreset("celestial-night");
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
          sysId: `TEYVAT//${String(idx + 1).padStart(2, "0")}`,
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
        className="bg-[#FAF7EE]/95 dark:bg-surface-primary/90 parchment-panel-strong dark:glass-panel-strong mx-4 mt-2 rounded-2xl px-4 py-2.5 sm:mx-6 lg:mx-8 border-2 border-leather-caramel/30 dark:border-gold-400/25 shadow-xl"
      >
        <div className="flex items-center justify-between">
          {/* Left: Logo + Status */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label={`${siteName} Home`}
              className="flex items-center gap-2.5 group focus-ring-gold rounded-xl p-1"
            >
              {/* Teyvat Crest Icon */}
              <div className="relative w-8 h-8 rounded-full bg-leather-caramel/15 dark:bg-gold-400/15 border border-leather-caramel/40 dark:border-gold-400/40 flex items-center justify-center p-1 shadow-sm">
                <Image
                  src={GENSHIN_UI_ICONS.characterAether}
                  alt="Aether Emblem"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <StatusDot tone="active" pulse label="System online" className="absolute -top-0.5 -right-0.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold tracking-[0.18em] text-[#1E1208] dark:text-platinum-50 uppercase">
                  {siteName}
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#5E412A] dark:text-text-muted hidden sm:block font-bold">
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
                    "group relative px-4 py-2 text-xs font-mono tracking-widest transition-all duration-300 hover-scale-sm press-scale focus-ring-gold rounded-full font-bold",
                    isActive
                      ? "text-[#1E1208] dark:text-gold-400"
                      : "text-[#5E412A] dark:text-text-muted hover:text-[#1E1208] dark:hover:text-gold-400"
                  )}
                >
                  {item.label}
                  {/* Hover line */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-2 right-2 h-[1.5px] bg-gradient-to-r from-leather-caramel/0 via-[#8C6239] to-leather-caramel/0 dark:from-gold-500/0 dark:via-gold-500 dark:to-gold-500/0",
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
              className="rounded-full p-2 bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/30 dark:border-gold-400/30 text-[#1E1208] dark:text-gold-400 hover:scale-105 transition-all focus-ring-gold"
            >
              {isNight ? (
                <Sun className="h-4 w-4 text-gold-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-[#8C6239] transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>

            {/* Time readout with Icon Time */}
            <div className="hidden items-center gap-2 lg:flex" aria-live="polite">
              <div className="flex items-center gap-2 rounded-full border border-leather-caramel/25 dark:border-gold-400/20 bg-[#FAF7EE] dark:bg-deep-space/50 px-3.5 py-1.5 shadow-sm">
                <div className="w-3.5 h-3.5 relative">
                  <Image
                    src={GENSHIN_UI_ICONS.time}
                    alt="Time"
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                </div>
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#1E1208] dark:text-text-muted tabular-nums font-bold">
                  {time || "SYNCING…"}
                </span>
                <span className="text-[9px] font-mono text-[#5E412A] dark:text-text-muted/40 font-bold">
                  WIB
                </span>
              </div>
            </div>

            {/* Auth Link */}
            <Link
              href="/login"
              aria-label="Staff Login"
              className="hidden items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono tracking-wider text-[#1E1208] dark:text-platinum-100 hover:text-[#8C6239] dark:hover:text-gold-400 bg-leather-caramel/10 dark:bg-gold-400/10 border border-leather-caramel/30 dark:border-gold-400/30 focus-ring-gold rounded-full transition-colors sm:inline-flex font-bold"
            >
              <Shield className="h-3.5 w-3.5 text-[#8C6239] dark:text-gold-400" aria-hidden="true" />
              <span>STAFF</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <IconButton
                label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                size="sm"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </IconButton>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="mt-3 pt-3 border-t border-leather-caramel/20 dark:border-gold-400/20 md:hidden space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-xs font-mono tracking-wider rounded-xl",
                    isActive
                      ? "bg-leather-caramel/15 text-[#1E1208] dark:text-gold-400 font-bold"
                      : "text-[#5E412A] dark:text-text-muted hover:bg-leather-caramel/10"
                  )}
                >
                  <span>{item.label}</span>
                  <span className="text-[9px] opacity-60 font-bold">{item.sysId}</span>
                </Link>
              );
            })}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-[#8C6239] dark:text-gold-400 font-bold"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>STAFF PORTAL</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
