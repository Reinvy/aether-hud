"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { HudLoader } from "@/components/ui/hud-loader";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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
            className="rounded p-2 text-text-muted transition-all duration-300 hover:text-gold-400 hover-scale-sm focus-ring-gold"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-xs font-bold tracking-[0.15em] text-text-main">
            AETHER // DASH
          </span>
        </div>
        <ErrorBoundary section="dashboard">
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-space">
        <HudLoader label="VERIFYING SESSION" size="lg" />
      </div>
    );
  }

  // Don't render dashboard content if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-space">
        <HudLoader label="REDIRECTING TO LOGIN" size="lg" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
