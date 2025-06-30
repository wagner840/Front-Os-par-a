"use client";

import { Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
}

export function DashboardHeader({
  title = "Dashboard",
  description,
}: DashboardHeaderProps) {
  return (
    <header className="bg-white/15 backdrop-blur-2xl border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
          {description && (
            <p className="text-white/70 text-sm">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 bg-white/10 backdrop-blur-lg border border-white/20 focus:border-primary/50 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-white/80 hover:text-white hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
