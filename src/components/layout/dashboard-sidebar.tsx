"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Boxes,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Gauge,
  Globe,
  Layout,
  LogOut,
  MessageCircle,
  Settings,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, PORTFOLIO_CONFIG } from "@/lib/constants";
import { DASHBOARD_NAV_GROUPS, isDashboardNavActive } from "@/lib/navigation";
import { useSidebar } from "@/lib/sidebar-context";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/use-data";
import { StatusDot } from "@/components/ui/status-dot";
import { IconButton } from "@/components/ui/icon-button";

/** Icon registry — every `DASHBOARD_NAV[].icon` must resolve here (e2e TEST 10). */
const iconMap: Record<string, React.ElementType> = {
  Activity,
  Boxes,
  Cpu,
  Settings,
  User,
  Briefcase,
  MessageCircle,
  Layout,
  Globe,
  Gauge,
};

interface SiteConfig {
  siteName: string;
  sysVersion: string;
}

const COLLAPSE_KEY = "aether_sidebar";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const { logout } = useAuth();
  const { data: config } = useData<SiteConfig>("/api/config");
  const [collapsed, setCollapsed] = useState(false);

  const siteName = config?.siteName || APP_NAME;
  const version = config?.sysVersion || PORTFOLIO_CONFIG.sysVersion;

  // Restore the operator's rail preference once, on mount.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "collapsed");
    } catch {
      // Storage can be unavailable (private mode) — keep the expanded default.
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((previous) => {
      const next = !previous;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "collapsed" : "expanded");
      } catch {
        // Preference simply does not persist.
      }
      return next;
    });
  }, []);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-5">
        <div className="relative shrink-0">
          <StatusDot tone="active" label="Console online" className="ml-1" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold tracking-[0.1em] text-text-main">
              {siteName}
            </p>
            <p className="codex-label text-[9px]">Codex Console</p>
          </div>
        )}
        <IconButton size="sm" label="Close dashboard sidebar" onClick={close} className="lg:hidden">
          <X className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </div>

      <nav aria-label="Codex console sections" className="flex-1 overflow-y-auto px-3 py-5">
        {DASHBOARD_NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4 last:mb-0">
            {!collapsed && (
              <p className="codex-label px-4 pb-2 text-[9px]">{group.label}</p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] || Activity;
                const isActive = isDashboardNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={isActive ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 codex-radius-sm px-4 py-3 text-xs font-semibold tracking-wider transition-all duration-200 hover-scale-sm press-scale codex-focus",
                        collapsed && "justify-center px-2",
                        isActive
                          ? "bg-leather-caramel/10 text-leather-dark border-l-2 border-leather-caramel dark:bg-gold-400/10 dark:text-gold-400 dark:border-gold-400"
                          : "text-text-muted hover:bg-glass-200 hover:text-leather-dark border-l-2 border-transparent dark:hover:text-gold-400"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border-subtle px-3 py-4">
        <Link
          href="/"
          onClick={close}
          title={collapsed ? "Return to the dossier" : undefined}
          className={cn(
            "flex items-center gap-3 codex-radius-sm px-4 py-3 text-xs font-semibold tracking-wider text-text-muted transition-all duration-200 hover:bg-glass-200 hover:text-leather-dark hover-scale-sm press-scale codex-focus dark:hover:text-gold-400",
            collapsed && "justify-center px-2"
          )}
        >
          <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Return to the dossier</span>}
        </Link>

        <button
          type="button"
          onClick={logout}
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex w-full items-center gap-3 codex-radius-sm px-4 py-3 text-xs font-semibold tracking-wider text-text-muted transition-all duration-200 hover:bg-hud-danger/10 hover:text-hud-danger hover-scale-sm press-scale codex-focus",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          {!collapsed && <span>Log out</span>}
        </button>

        {!collapsed && (
          <p className="codex-label px-4 pt-3 text-[9px] tabular-nums">Version {version}</p>
        )}

        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          className="mt-2 hidden w-full items-center justify-center gap-2 codex-radius-sm px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-leather-dark codex-focus lg:flex dark:hover:text-gold-400"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </>
  );

  const panelWidth = collapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside
        aria-label="Codex console sidebar"
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-full flex-col border-r border-border-subtle bg-surface-primary/95 backdrop-blur-xl transition-[width] duration-300 lg:flex",
          panelWidth
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — overlay with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-deep-space/60 backdrop-blur-sm lg:hidden"
              onClick={close}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              aria-label="Mobile console sidebar"
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-border-subtle bg-surface-primary/95 backdrop-blur-xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
