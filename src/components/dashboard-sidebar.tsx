"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useLayout } from "./layout-context";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clientes", icon: Users },
  { href: "/dashboard/jobs", label: "Trabajos", icon: Briefcase },
  { href: "/dashboard/inventory", label: "Inventario", icon: Package },
  { href: "/dashboard/invoices", label: "Facturación", icon: FileText },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse, isMobileOpen, closeMobile } = useLayout();

  // Desktop sidebar rendering
  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* MOBILE DRAWER BACKDROP */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-card border-r border-border shadow-2xl lg:hidden"
          >
            {/* Header Mobile */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-display text-xl font-bold tracking-tight text-primary">
                B2B ERP Premium
              </span>
              <button
                onClick={closeMobile}
                className="p-1.5 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links Mobile */}
            <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary rounded-l-none pl-2"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen sticky top-0 bg-card border-r border-border shrink-0 transition-all duration-300 z-30",
          sidebarWidth
        )}
      >
        {/* Header Desktop */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
          {!isCollapsed ? (
            <span className="font-display text-lg font-bold tracking-tight text-foreground whitespace-nowrap">
              B2B ERP Premium
            </span>
          ) : (
            <span className="font-display text-lg font-bold tracking-tight text-primary mx-auto">
              B2B
            </span>
          )}
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-md border border-border hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Colapsar menú"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed Toggle Button when closed */}
        {isCollapsed && (
          <div className="flex justify-center py-2 border-b border-border shrink-0">
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-md border border-border hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Expandir menú"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Links Desktop */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200",
                  isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5 text-sm",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary rounded-l-none pl-2"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn("shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
