"use client";

import { useAppStore } from "@/lib/stores/app-store";
import { BlogSelector } from "@/components/features/dashboard/blog-selector";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Search,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  DollarSign,
  Lightbulb,
  Globe,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Keywords", href: "/keywords", icon: Search },
  {
    name: "Content Opportunities",
    href: "/content-opportunities",
    icon: Lightbulb,
  },
  { name: "WordPress", href: "/wordpress", icon: Globe },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Monetização", href: "/monetization", icon: DollarSign },
  { name: "Settings", href: "/settings", icon: Settings },
];

// Adicionando Automações dinamicamente
navigation.splice(6, 0, {
  name: "Automações",
  href: "/automations",
  icon: Sparkles,
});

export function DashboardSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 z-40",
        sidebarCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Content Hub</span>
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-white"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Blog Selector */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b border-slate-700/50">
          <BlogSelector />
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200",
                "hover:bg-slate-800/60 hover:shadow-lg group",
                "text-slate-300 hover:text-white border border-transparent hover:border-slate-600/50"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-sm text-slate-300 font-medium">
              Frutiger Aero Design
            </div>
            <div className="text-xs text-slate-400 mt-1">v1.0.0</div>
          </div>
        </div>
      )}
    </div>
  );
}
