"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { getTenantConfig } from "@/utils/tenant";

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");
  const config = getTenantConfig(tenantParam);

  React.useEffect(() => {
    if (config.theme) {
      const root = document.documentElement;
      if (config.theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [config]);

  return (
    <>
      {/* Inline script to prevent theme flickering on page refresh (White Label dark/light) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              const params = new URLSearchParams(window.location.search);
              const tenant = params.get('tenant');
              if (tenant === 'apex') {
                document.documentElement.classList.add('dark');
              } else if (tenant === 'acme') {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          `,
        }}
      />

      {/* Dynamic CSS override for White Label primary colors */}
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

      <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors duration-300">
        <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-lg transition-all duration-300">
          <div className="flex flex-col text-center mb-6">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground transition-all duration-300">
              {config.name}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Portal de Acceso Autorizado
            </span>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-sans">
          Cargando Portal de Acceso...
        </div>
      }
    >
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </React.Suspense>
  );
}
