"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { LayoutProvider } from "@/components/layout-context";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useTheme } from "next-themes";
import { getTenantConfig, parseToHslChannels } from "@/utils/tenant";
import { getTenantSettings } from "@/app/actions";

interface ActiveConfig {
  name: string;
  primaryColor: string;
  theme?: "light" | "dark";
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");
  const { resolvedTheme } = useTheme();

  // State to hold the active branding configuration
  const [activeConfig, setActiveConfig] = React.useState<ActiveConfig | null>(null);

  // 1. Load configuration from localStorage instantly (or fall back to static mock configs)
  React.useEffect(() => {
    const fallback = getTenantConfig(tenantParam);
    const cacheKey = `tenant_config_${tenantParam || "default"}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setActiveConfig(JSON.parse(cached));
      } catch (e) {
        setActiveConfig(fallback);
      }
    } else {
      setActiveConfig(fallback);
    }
  }, [tenantParam]);

  // 2. Perform background sync from Supabase to update the local configuration
  React.useEffect(() => {
    async function syncSettings() {
      try {
        const settings = await getTenantSettings(tenantParam);
        const fallback = getTenantConfig(tenantParam);
        
        // If settings exist, parse the primary color and razon_social
        const dbColor = settings.color_primario || fallback.primaryColor;
        const channels = parseToHslChannels(dbColor);
        
        const syncedConfig: ActiveConfig = {
          name: settings.razon_social || fallback.name,
          primaryColor: channels,
          theme: tenantParam === "apex" ? "dark" : tenantParam === "acme" ? "light" : undefined
        };

        const cacheKey = `tenant_config_${tenantParam || "default"}`;
        const cachedStr = localStorage.getItem(cacheKey);
        
        // Update state and cache if different
        if (JSON.stringify(syncedConfig) !== cachedStr) {
          localStorage.setItem(cacheKey, JSON.stringify(syncedConfig));
          setActiveConfig(syncedConfig);
        }
      } catch (err) {
        console.error("Error syncing branding settings from Supabase:", err);
      }
    }
    syncSettings();
  }, [tenantParam]);

  // 3. Apply classes and custom style properties dynamically on DOM
  React.useEffect(() => {
    if (!activeConfig) return;
    const root = document.documentElement;
    const theme = activeConfig.theme;

    if (theme) {
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      root.style.setProperty("--primary", activeConfig.primaryColor);
      root.style.setProperty("--ring", activeConfig.primaryColor);
    } else {
      // Sync with global theme setting when default tenant
      if (resolvedTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
    }
  }, [activeConfig, resolvedTheme]);

  return (
    <LayoutProvider>
      {/* Dynamic CSS override for White Label primary colors, only for specific tenants */}
      {activeConfig && activeConfig.theme && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --primary: ${activeConfig.primaryColor} !important;
                --ring: ${activeConfig.primaryColor} !important;
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
