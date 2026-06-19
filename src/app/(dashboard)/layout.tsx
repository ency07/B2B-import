"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { LayoutProvider } from "@/components/layout-context";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useTheme } from "next-themes";
import { getTenantConfig } from "@/utils/tenant";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");
  const config = getTenantConfig(tenantParam);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    const root = document.documentElement;
    if (config.theme) {
      if (config.theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      root.style.setProperty("--primary", config.primaryColor);
      root.style.setProperty("--ring", config.primaryColor);
    } else {
      // Sync with next-themes and clean up styling when default tenant is active
      if (resolvedTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
    }
  }, [config, resolvedTheme]);

  return (
    <LayoutProvider>
      {/* Dynamic CSS override for White Label primary colors, only for specific tenants */}
      {config.theme && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --primary: ${config.primaryColor} !important;
                --ring: ${config.primaryColor} !important;
              }
            `,
          }}
        />
      )}

      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <DashboardSidebar />
        <div className="flex-grow flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-sans">
          Cargando Dashboard...
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </React.Suspense>
  );
}
