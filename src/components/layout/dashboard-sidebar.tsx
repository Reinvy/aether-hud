"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Boxes,
  Cpu,
  Settings,
  LayoutDashboard,
  LogOut,
  X,
  User,
  Briefcase,
  MessageCircle,
  Layout,
  Globe,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV } from "@/lib/constants";
import { useSidebar } from "@/lib/sidebar-context";
import { StatusDot } from "@/components/ui/status-dot";
import { IconButton } from "@/components/ui/icon-button";

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

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="angled-bar flex items-center gap-3 border-b border-border-subtle px-6 py-5">
        <div className="relative">
          <LayoutDashboard className="h-5 w-5 text-gold-400" />
          <StatusDot tone="active" label="Dashboard online" className="absolute -top-1 -right-1" />
        </div>
        <div className="flex-1">
          <h1 className="font-display text-xs font-bold tracking-[0.15em] text-text-main">
            AETHER // DASH
          </h1>
          <p className="sys-label text-[9px]">CONTROL PANEL // v2.4</p>
        </div>
        <IconButton
          size="sm"
          label="Close sidebar"
          onClick={close}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </IconButton>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {DASHBOARD_NAV.map((item) => {
          const Icon = iconMap[item.icon] || Activity;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.sysId}
              href={item.href}
              onClick={close}
              className={cn(
                "flex items-center gap-3 chamfered-sm px-4 py-3 text-xs font-mono tracking-wider transition-all duration-200 hover-scale-sm press-scale focus-ring-gold",
                isActive
                  ? "bg-[rgba(242,201,76,0.08)] text-gold-400 border-l-2 border-gold-400"
                  : "text-text-muted hover:bg-glass-200 hover:text-gold-400 border-l-2 border-transparent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              <span className="sys-label text-[8px] opacity-50">{item.sysId}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border-subtle px-3 py-4">
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-3 chamfered-sm px-4 py-3 text-xs font-mono tracking-wider text-text-muted transition-colors hover:bg-glass-200 hover:text-gold-400 focus-ring-gold"
        >
          <LogOut className="h-4 w-4" />
          <span>RETURN TO PORTAL</span>
        </Link>
        <div className="mt-3 px-4">
          <div className="flex items-center gap-2">
            <span className="led-active" />
            <span className="sys-label-active text-[9px]">SYS_READY</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 flex-col border-r border-border-subtle bg-surface-primary/95 backdrop-blur-xl lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — overlay with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-deep-space/60 backdrop-blur-sm lg:hidden"
              onClick={close}
            />
            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
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
