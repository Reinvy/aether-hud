"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { CodexSessionGate } from "@/components/features/codex-session-gate";
import { IconButton } from "@/components/ui/icon-button";
import { Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { APP_NAME } from "@/lib/constants";

/**
 * DashboardShell — client-side dashboard chrome.
 *
 * Extracted from the route layout so the layout file can stay a server
 * component and export per-segment metadata (noindex + title template).
 * Holds all client concerns: session verification, sidebar context and
 * the per-route error boundary.
 */
function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggle } = useSidebar();

  return (
    <div className="flex min-h-screen bg-parchment-base">
      <DashboardSidebar />
      <main className="relative flex-1 overflow-auto lg:ml-64">
        {/* Mobile hamburger — sticky top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-border-subtle bg-parchment-base/85 px-4 py-3 backdrop-blur-xl lg:hidden">
          <IconButton
            size="md"
            label="Toggle sidebar"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
          </IconButton>
          <span className="font-display text-xs font-bold tracking-[0.15em] text-leather-dark">
            {APP_NAME}
          </span>
        </div>
        <ErrorBoundary section="dashboard">
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export function DashboardShell({
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
    return <CodexSessionGate label="Verifying session" />;
  }

  // Don't render dashboard content if not authenticated
  if (!isAuthenticated) {
    return <CodexSessionGate label="Redirecting to sign-in" />;
  }

  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
