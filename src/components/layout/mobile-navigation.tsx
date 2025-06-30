"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FileText,
  Key,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
  Bell,
  Search,
  Globe,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    color: "text-blue-400",
  },
  {
    name: "Posts",
    href: "/posts",
    icon: FileText,
    color: "text-green-400",
  },
  {
    name: "Keywords",
    href: "/keywords",
    icon: Key,
    color: "text-purple-400",
  },
  {
    name: "WordPress",
    href: "/wordpress",
    icon: Globe,
    color: "text-cyan-400",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    color: "text-orange-400",
  },
  {
    name: "Automações",
    href: "/automations",
    icon: Sparkles,
    color: "text-pink-400",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-gray-400",
  },
];

export function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/15 backdrop-blur-2xl border-b border-white/20">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <span className="text-white font-semibold">Content Hub</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2 relative"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10 p-2"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/15 backdrop-blur-2xl border-l border-white/20 z-50"
            >
              <div className="p-6 space-y-6">
                {/* User Profile */}
                <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Usuário</p>
                    <p className="text-white/60 text-sm">user@example.com</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                          "min-h-[48px]", // Touch target
                          active
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/30"
                            : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            active ? "text-white" : item.color
                          )}
                        />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Quick Actions */}
                <div className="space-y-3 pt-4 border-t border-white/20">
                  <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">
                    Ações Rápidas
                  </h3>

                  <Button className="w-full btn-primary justify-start gap-3">
                    <FileText className="h-4 w-4" />
                    Novo Post
                  </Button>

                  <Button className="w-full btn-secondary justify-start gap-3">
                    <Key className="h-4 w-4" />
                    Nova Keyword
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/15 backdrop-blur-2xl border-t border-white/20">
        <div className="flex items-center justify-around py-2">
          {/* Dashboard */}
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300",
              "min-h-[56px] min-w-[56px]",
              isActive("/")
                ? "text-white bg-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
            aria-label="Dashboard"
          >
            <Home
              className={cn(
                "h-5 w-5",
                isActive("/") ? "text-white" : "text-blue-400"
              )}
            />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>

          {/* Posts */}
          <Link
            href="/posts"
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300",
              "min-h-[56px] min-w-[56px]",
              isActive("/posts")
                ? "text-white bg-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
            aria-label="Posts"
          >
            <FileText
              className={cn(
                "h-5 w-5",
                isActive("/posts") ? "text-white" : "text-green-400"
              )}
            />
            <span className="text-xs font-medium">Posts</span>
          </Link>

          {/* Keywords */}
          <Link
            href="/keywords"
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300",
              "min-h-[56px] min-w-[56px]",
              isActive("/keywords")
                ? "text-white bg-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
            aria-label="Keywords"
          >
            <Key
              className={cn(
                "h-5 w-5",
                isActive("/keywords") ? "text-white" : "text-purple-400"
              )}
            />
            <span className="text-xs font-medium">Keywords</span>
          </Link>

          {/* Automações */}
          <Link
            href="/automations"
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300",
              "min-h-[56px] min-w-[56px]",
              isActive("/automations")
                ? "text-white bg-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
            aria-label="Automações"
          >
            <Sparkles
              className={cn(
                "h-5 w-5",
                isActive("/automations") ? "text-white" : "text-pink-400"
              )}
            />
            <span className="text-xs font-medium">Automações</span>
          </Link>

          {/* More button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300",
              "min-h-[56px] min-w-[56px]",
              "text-white/60 hover:text-white hover:bg-white/5"
            )}
            aria-label="Mais opções"
          >
            <Menu className="h-5 w-5 text-gray-400" />
            <span className="text-xs font-medium">Mais</span>
          </button>
        </div>
      </nav>
      {/* Spacer for content */}
      <div className="md:hidden h-16" /> {/* Top spacer */}
      <div className="md:hidden h-20" /> {/* Bottom spacer */}
    </>
  );
}
