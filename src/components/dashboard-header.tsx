"use client";

import * as React from "react";
import Headroom from "react-headroom";
import { Menu, Bell, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useLayout } from "./layout-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function DashboardHeader() {
  const { toggleMobileOpen } = useLayout();

  return (
    <Headroom className="z-40">
      <header className="flex items-center justify-between h-16 px-4 border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-200">
        {/* Left Side: Mobile Menu Button & Search Placeholder */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileOpen}
            className="p-2 -ml-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground lg:hidden cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar (Responsive) */}
          <div className="relative hidden sm:flex items-center w-64 md:w-80">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right Side: Actions (Notifications, ThemeToggle, Profile) */}
        <div className="flex items-center gap-3">
          {/* Notifications Button */}
          <button
            className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer relative"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Dropdown Placeholder */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src="" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-foreground">Administrador</span>
              <span className="text-[10px] text-muted-foreground">Admin Tenant</span>
            </div>
          </div>
        </div>
      </header>
    </Headroom>
  );
}
