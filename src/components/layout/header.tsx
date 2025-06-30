"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/stores/app-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Header() {
  const { user, selectedBlog, setSelectedBlog, blogs, signOut } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Simular notificações (em produção, viria de uma API)
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "success",
        title: "Post Publicado",
        message: 'Seu post "Como otimizar SEO" foi publicado com sucesso!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        read: false,
      },
      {
        id: "2",
        type: "warning",
        title: "Sync WordPress",
        message: "Alguns posts não foram sincronizados com o WordPress.",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        read: false,
        action: {
          label: "Sincronizar",
          onClick: () => {
            toast.info("Iniciando sincronização...");
            // Implementar lógica de sincronização
          },
        },
      },
      {
        id: "3",
        type: "info",
        title: "Nova Keyword",
        message: "Encontramos 5 novas oportunidades de keywords para você.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        read: true,
      },
      {
        id: "4",
        type: "error",
        title: "Erro de Conexão",
        message:
          "Falha ao conectar com o WordPress. Verifique suas credenciais.",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hora atrás
        read: false,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Agora mesmo";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">
              Content Hub
            </span>
          </div>
        </div>

        {/* Seletor de Blog */}
        <div className="flex-1 max-w-xs mx-4">
          <select
            value={selectedBlog || ""}
            onChange={(e) => setSelectedBlog(e.target.value || null)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
          >
            <option value="">Selecione um blog</option>
            {blogs.map((blog) => (
              <option key={blog.id} value={blog.id}>
                {blog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notificações */}
          <DropdownMenu
            open={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-3 border-b">
                <h4 className="font-semibold">Notificações</h4>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhuma notificação
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-sm truncate">
                              {notification.title}
                            </h5>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() =>
                                  removeNotification(notification.id)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          {notification.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                notification.action!.onClick();
                                markAsRead(notification.id);
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Marcar como lida
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Configurações */}
          <Button variant="ghost" size="icon" asChild>
            <a href="/settings">
              <Settings className="h-5 w-5" />
            </a>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url}
                    alt={user?.email}
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.email}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.user_metadata?.full_name || "Usuário"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-background md:hidden"
          >
            <div className="container py-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/dashboard">Dashboard</a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/posts">Posts</a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/keywords">Keywords</a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/analytics">Analytics</a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/wordpress">WordPress</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
