"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-deep-space">
      <DashboardSidebar />
      <main className="ml-64 flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
