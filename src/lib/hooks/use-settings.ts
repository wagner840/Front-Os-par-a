"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./use-supabase";
import { useAppStore } from "../stores/app-store";
import { toast } from "sonner";

// Interfaces
export interface UserSettings {
  id: string;
  user_id: string;
  // Perfil
  display_name: string;
  bio?: string;
  avatar_url?: string;
  timezone: string;
  language: string;

  // Notificações
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  weekly_digest: boolean;

  // Aparência
  theme: "light" | "dark" | "system";
  sidebar_collapsed: boolean;
  compact_mode: boolean;

  // Segurança
  two_factor_enabled: boolean;
  session_timeout: number;

  // Configurações do sistema
  auto_save: boolean;
  analytics_enabled: boolean;

  created_at: string;
  updated_at: string;
}

export interface SettingsUpdate {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  timezone?: string;
  language?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  marketing_emails?: boolean;
  weekly_digest?: boolean;
  theme?: "light" | "dark" | "system";
  sidebar_collapsed?: boolean;
  compact_mode?: boolean;
  two_factor_enabled?: boolean;
  session_timeout?: number;
  auto_save?: boolean;
  analytics_enabled?: boolean;
}

export interface SystemInfo {
  version: string;
  last_backup: string;
  storage_used: number;
  storage_limit: number;
  api_calls_today: number;
  api_limit: number;
}

// Hook principal para configurações
export function useUserSettings() {
  const supabase = useSupabase();
  const { user } = useAppStore();

  return useQuery({
    queryKey: ["user-settings", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      // Se não existe configuração, criar uma padrão
      if (!data) {
        const defaultSettings = {
          user_id: user.id,
          display_name: user.email?.split("@")[0] || "Usuário",
          timezone: "America/Sao_Paulo",
          language: "pt-BR",
          email_notifications: true,
          push_notifications: true,
          marketing_emails: false,
          weekly_digest: true,
          theme: "system" as const,
          sidebar_collapsed: false,
          compact_mode: false,
          two_factor_enabled: false,
          session_timeout: 3600,
          auto_save: true,
          analytics_enabled: true,
        };

        const { data: newSettings, error: createError } = await supabase
          .from("user_settings")
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) throw createError;
        return newSettings as UserSettings;
      }

      return data as UserSettings;
    },
    enabled: !!user,
  });
}

// Hook para atualizar configurações
export function useUpdateSettings() {
  const supabase = useSupabase();
  const { user } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: SettingsUpdate) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("user_settings")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      toast.success("Configurações atualizadas com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar configurações:", error);
      toast.error("Erro ao atualizar configurações");
    },
  });
}

// Hook para informações do sistema
export function useSystemInfo() {
  return useQuery({
    queryKey: ["system-info"],
    queryFn: async () => {
      // Simular dados do sistema (em produção viria do backend)
      const systemInfo: SystemInfo = {
        version: "1.0.0",
        last_backup: new Date().toISOString(),
        storage_used: 1250000, // bytes
        storage_limit: 5000000, // bytes
        api_calls_today: 1247,
        api_limit: 10000,
      };

      return systemInfo;
    },
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });
}

// Hook para exportar dados
export function useExportData() {
  const supabase = useSupabase();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Usuário não autenticado");

      // Buscar todos os dados do usuário
      const [blogs, posts, keywords] = await Promise.all([
        supabase.from("blogs").select("*").eq("user_id", user.id),
        supabase.from("content_posts").select("*").eq("author_id", user.id),
        supabase.from("main_keywords").select("*").eq("blog_id", user.id),
      ]);

      const exportData = {
        user_id: user.id,
        export_date: new Date().toISOString(),
        blogs: blogs.data || [],
        posts: posts.data || [],
        keywords: keywords.data || [],
      };

      // Criar arquivo para download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return exportData;
    },
    onSuccess: () => {
      toast.success("Dados exportados com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao exportar dados:", error);
      toast.error("Erro ao exportar dados");
    },
  });
}

// Hook para limpar cache
export function useClearCache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Limpar cache do React Query
      queryClient.clear();

      // Limpar localStorage se houver dados em cache
      const cacheKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("content-hub-")
      );

      cacheKeys.forEach((key) => localStorage.removeItem(key));

      return true;
    },
    onSuccess: () => {
      toast.success("Cache limpo com sucesso!");
      // Recarregar a página para garantir estado limpo
      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error) => {
      console.error("Erro ao limpar cache:", error);
      toast.error("Erro ao limpar cache");
    },
  });
}

// Hook para regenerar API keys (simulado)
export function useRegenerateApiKeys() {
  return useMutation({
    mutationFn: async () => {
      // Em produção, isso faria uma chamada real para regenerar as chaves
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        api_key: `ck_${Math.random().toString(36).substring(2, 15)}`,
        secret_key: `cs_${Math.random().toString(36).substring(2, 15)}`,
        generated_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      toast.success("API Keys regeneradas com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao regenerar API keys:", error);
      toast.error("Erro ao regenerar API keys");
    },
  });
}
