"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Boxes,
  Cpu,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Activity,
  Boxes,
  Cpu,
  Settings,
};

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-border-subtle bg-surface-primary/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="angled-bar flex items-center gap-3 border-b border-border-subtle px-6 py-5">
        <div className="relative">
          <LayoutDashboard className="h-5 w-5 text-gold-400" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-hud-active shadow-[0_0_6px_rgba(0,255,135,0.6)]" />
        </div>
        <div>
          <h1 className="font-display text-xs font-bold tracking-[0.15em] text-text-main">
            AETHER // DASH
          </h1>
          <p className="sys-label text-[9px]">CONTROL PANEL // v2.4</p>
        </div>
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
              className={cn(
                "flex items-center gap-3 rounded px-4 py-3 text-xs font-mono tracking-wider transition-all duration-200",
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
          className="flex items-center gap-3 rounded px-4 py-3 text-xs font-mono tracking-wider text-text-muted transition-colors hover:bg-glass-200 hover:text-gold-400"
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
    </aside>
  );
}
