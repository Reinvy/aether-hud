"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context";
import { Menu } from "lucide-react";

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggle } = useSidebar();

  return (
    <div className="flex min-h-screen bg-deep-space">
      <DashboardSidebar />
      <main className="relative flex-1 overflow-auto lg:ml-64">
        {/* Mobile hamburger — sticky top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border-subtle bg-deep-space/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            onClick={toggle}
            className="rounded p-1.5 text-text-muted transition-colors hover:text-gold-400"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-xs font-bold tracking-[0.15em] text-text-main">
            AETHER // DASH
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
