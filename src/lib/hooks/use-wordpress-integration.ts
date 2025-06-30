"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wordpressService } from "@/lib/services/wordpress-integration";
import { useAppStore } from "@/lib/stores/app-store";
import { WordPressIntegrationService } from "../services/wordpress-integration";
import type {
  WordPressConfig,
  WordPressPost,
  WordPressCategory,
  WordPressTag,
  WordPressMedia,
  WordPressUser,
  WordPressComment,
  WordPressSyncResult,
  CreateWordPressPostData,
  UpdateWordPressPostData,
  WordPressPlugin,
  WordPressTheme,
  WordPressSettings,
  WordPressBackup,
  WordPressIntegrationStats,
  PostSyncMapping,
  WordPressActivityLog,
  WordPressAutoSyncConfig,
} from "@/lib/types/wordpress";

// Definir tipos que estavam faltando
interface BulkUpdateResult {
  postId: number;
  success: boolean;
  error: string | null;
}

// ==================== CONFIGURAÇÃO ====================

export function useWordPressConfig(blogId?: string) {
  return useQuery({
    queryKey: ["wordpress-config", blogId],
    queryFn: () =>
      blogId ? wordpressService.getWordPressConfig(blogId) : null,
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useSaveWordPressConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      config,
    }: {
      blogId: string;
      config: WordPressConfig;
    }) => wordpressService.saveWordPressConfig(blogId, config),
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-config", blogId] });
      toast.success("Configuração WordPress salva com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao salvar configuração WordPress");
    },
  });
}

export function useTestWordPressConnection() {
  return useMutation({
    mutationFn: (config: WordPressConfig) =>
      wordpressService.testConnection(config),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Erro ao testar conexão");
    },
  });
}

// ==================== POSTS ====================

export function useWordPressPosts(
  blogId?: string,
  params: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    order?: "asc" | "desc";
    orderby?: string;
  } = {}
) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-posts", blogId, params],
    queryFn: () =>
      config ? wordpressService.getWordPressPosts(config, params) : [],
    enabled: !!config && !!blogId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

export function useCreateWordPressPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      config,
      postData,
    }: {
      config: WordPressConfig;
      postData: CreateWordPressPostData;
    }) => wordpressService.createWordPressPost(config, postData),
    onSuccess: (_, { config }) => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts"] });
      toast.success("Post criado no WordPress com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar post no WordPress");
    },
  });
}

export function useUpdateWordPressPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      config,
      postId,
      postData,
    }: {
      config: WordPressConfig;
      postId: number;
      postData: UpdateWordPressPostData;
    }) => wordpressService.updateWordPressPost(config, postId, postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts"] });
      toast.success("Post atualizado no WordPress com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar post no WordPress");
    },
  });
}

export function useDeleteWordPressPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      config,
      postId,
      force,
    }: {
      config: WordPressConfig;
      postId: number;
      force?: boolean;
    }) => wordpressService.deleteWordPressPost(config, postId, force),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts"] });
      toast.success("Post deletado do WordPress com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao deletar post do WordPress");
    },
  });
}

// ==================== CATEGORIAS ====================

export function useWordPressCategories(blogId?: string) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-categories", blogId],
    queryFn: () =>
      config ? wordpressService.getWordPressCategories(config) : [],
    enabled: !!config && !!blogId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useCreateWordPressCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      config,
      categoryData,
    }: {
      config: WordPressConfig;
      categoryData: {
        name: string;
        description?: string;
        slug?: string;
        parent?: number;
      };
    }) => wordpressService.createWordPressCategory(config, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-categories"] });
      toast.success("Categoria criada no WordPress com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar categoria no WordPress");
    },
  });
}

// ==================== TAGS ====================

export function useWordPressTags(blogId?: string) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-tags", blogId],
    queryFn: () => (config ? wordpressService.getWordPressTags(config) : []),
    enabled: !!config && !!blogId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useCreateWordPressTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      config,
      tagData,
    }: {
      config: WordPressConfig;
      tagData: { name: string; description?: string; slug?: string };
    }) => wordpressService.createWordPressTag(config, tagData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-tags"] });
      toast.success("Tag criada no WordPress com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar tag no WordPress");
    },
  });
}

// ==================== MÍDIA ====================

export function useWordPressMedia(
  blogId?: string,
  params: {
    page?: number;
    per_page?: number;
    media_type?: string;
    parent?: number;
  } = {}
) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-media", blogId, params],
    queryFn: () =>
      config ? wordpressService.getWordPressMedia(config, params) : [],
    enabled: !!config && !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useUploadWordPressMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      config,
      file,
      title,
      alt,
    }: {
      config: WordPressConfig;
      file: File;
      title?: string;
      alt?: string;
    }) => wordpressService.uploadWordPressMedia(config, file, title, alt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-media"] });
      toast.success("Mídia enviada para o WordPress com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao enviar mídia para o WordPress");
    },
  });
}

// ==================== USUÁRIOS ====================

export function useWordPressUsers(blogId?: string) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-users", blogId],
    queryFn: () => (config ? wordpressService.getWordPressUsers(config) : []),
    enabled: !!config && !!blogId,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
}

// ==================== COMENTÁRIOS ====================

export function useWordPressComments(
  blogId?: string,
  params: {
    post?: number;
    page?: number;
    per_page?: number;
    status?: string;
  } = {}
) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-comments", blogId, params],
    queryFn: () =>
      config ? wordpressService.getWordPressComments(config, params) : [],
    enabled: !!config && !!blogId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

export function useModerateWordPressComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      config,
      commentId,
      status,
    }: {
      config: WordPressConfig;
      commentId: number;
      status: "approve" | "hold" | "spam" | "trash";
    }) => wordpressService.moderateComment(config, commentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-comments"] });
      toast.success("Comentário moderado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao moderar comentário");
    },
  });
}

// ==================== PLUGINS ====================

export function useWordPressPlugins(blogId?: string) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-plugins", blogId],
    queryFn: () => (config ? wordpressService.getWordPressPlugins(config) : []),
    enabled: !!config && !!blogId,
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
}

// ==================== TEMAS ====================

export function useWordPressThemes(blogId?: string) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-themes", blogId],
    queryFn: () => (config ? wordpressService.getWordPressThemes(config) : []),
    enabled: !!config && !!blogId,
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
}

// ==================== CONFIGURAÇÕES ====================

export function useWordPressSettings(blogId?: string) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-settings", blogId],
    queryFn: () =>
      config ? wordpressService.getWordPressSettings(config) : null,
    enabled: !!config && !!blogId,
    staleTime: 60 * 60 * 1000, // 1 hora
  });
}

export function useUpdateWordPressSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      config,
      settings,
    }: {
      config: WordPressConfig;
      settings: Partial<WordPressSettings>;
    }) => wordpressService.updateWordPressSettings(config, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-settings"] });
      toast.success("Configurações do WordPress atualizadas com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar configurações do WordPress");
    },
  });
}

// ==================== SINCRONIZAÇÃO ====================

export function useSyncPostToWordPress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogId, postId }: { blogId: string; postId: string }) =>
      wordpressService.syncPostToWordPress(blogId, postId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Erro na sincronização do post");
    },
  });
}

export function useSyncPostsFromWordPress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogId: string) =>
      wordpressService.syncPostsFromWordPress(blogId),
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      const successCount = results.filter((r) => r.success).length;
      const errorCount = results.filter((r) => !r.success).length;

      if (successCount > 0) {
        toast.success(`${successCount} posts sincronizados com sucesso!`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} posts falharam na sincronização`);
      }
    },
    onError: () => {
      toast.error("Erro na sincronização em lote");
    },
  });
}

// ==================== BACKUP ====================

export function useCreateWordPressBackup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: WordPressConfig) =>
      wordpressService.createWordPressBackup(config),
    onSuccess: (backup) => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-backups"] });
      if (backup) {
        toast.success(
          `Backup criado com sucesso! Tamanho: ${(
            backup.size /
            1024 /
            1024
          ).toFixed(2)} MB`
        );
      } else {
        toast.error("Erro ao criar backup");
      }
    },
    onError: () => {
      toast.error("Erro ao criar backup do WordPress");
    },
  });
}

// ==================== ESTATÍSTICAS ====================

export function useWordPressIntegrationStats(blogId?: string) {
  return useQuery({
    queryKey: ["wordpress-stats", blogId],
    queryFn: () =>
      blogId ? wordpressService.getIntegrationStats(blogId) : null,
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 30 * 1000, // Atualizar a cada 30 segundos
  });
}

// ==================== SINCRONIZAÇÃO AUTOMÁTICA ====================

export function useAutoSync(blogId?: string) {
  const { selectedBlog } = useAppStore();
  const targetBlogId = blogId || selectedBlog;

  const { data: config } = useWordPressConfig(targetBlogId || undefined);
  const syncPostToWordPress = useSyncPostToWordPress();
  const syncPostsFromWordPress = useSyncPostsFromWordPress();

  const startAutoSync = () => {
    if (!config?.sync_enabled || !targetBlogId) return;

    const interval = setInterval(() => {
      // Sincronizar posts pendentes para WordPress
      syncPostToWordPress.mutate({ blogId: targetBlogId, postId: "pending" });

      // Sincronizar posts do WordPress para Supabase
      syncPostsFromWordPress.mutate(targetBlogId);
    }, (config.auto_sync_interval || 30) * 60 * 1000);

    return () => clearInterval(interval);
  };

  return {
    config,
    isEnabled: config?.sync_enabled || false,
    interval: config?.auto_sync_interval || 30,
    startAutoSync,
    syncPostToWordPress: syncPostToWordPress.mutate,
    syncPostsFromWordPress: syncPostsFromWordPress.mutate,
    isLoading:
      syncPostToWordPress.isPending || syncPostsFromWordPress.isPending,
  };
}

// ==================== MONITORAMENTO E LOGS ====================

export function useWordPressPerformanceMetrics(blogId?: string) {
  return useQuery({
    queryKey: ["wordpress-performance", blogId],
    queryFn: async () => {
      if (!blogId) return null;

      // Implementar lógica de coleta de métricas
      const config = await wordpressService.getWordPressConfig(blogId);
      if (!config) return null;

      const startTime = Date.now();
      const testResult = await wordpressService.testConnection(config);
      const responseTime = Date.now() - startTime;

      const metrics: WordPressPerformanceMetrics = {
        blog_id: blogId,
        response_time: responseTime,
        success_rate: testResult.success ? 100 : 0,
        error_rate: testResult.success ? 0 : 100,
        requests_per_minute: 0,
        bandwidth_usage: 0,
        uptime_percentage: testResult.success ? 100 : 0,
        last_check: new Date().toISOString(),
        alerts: testResult.success
          ? []
          : [
              {
                type: "error" as const,
                message: testResult.message,
                timestamp: new Date().toISOString(),
              },
            ],
      };

      return metrics;
    },
    enabled: !!blogId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });
}

export function useWordPressActivityLogs(blogId?: string) {
  return useQuery({
    queryKey: ["wordpress-activity-logs", blogId],
    queryFn: async () => {
      // Implementar busca de logs de atividade
      // Por enquanto retorna array vazio
      return [] as WordPressActivityLog[];
    },
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// ==================== CONFIGURAÇÃO AVANÇADA ====================

export function useWordPressAutoSyncConfig(blogId?: string) {
  return useQuery({
    queryKey: ["wordpress-auto-sync-config", blogId],
    queryFn: async () => {
      if (!blogId) return null;

      const config = await wordpressService.getWordPressConfig(blogId);
      if (!config) return null;

      const autoSyncConfig: WordPressAutoSyncConfig = {
        enabled: config.sync_enabled || false,
        interval: config.auto_sync_interval || 30,
        sync_posts: true,
        sync_categories: config.sync_categories || false,
        sync_tags: config.sync_tags || false,
        sync_media: config.sync_media || false,
        sync_comments: config.sync_comments || false,
        sync_users: false,
        conflict_resolution: "wordpress_wins",
        errors_count: 0,
        max_errors: 10,
      };

      return autoSyncConfig;
    },
    enabled: !!blogId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// ==================== UTILITÁRIOS ====================

export function useWordPressHealthCheck(blogId?: string) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-health", blogId],
    queryFn: async () => {
      if (!config) return null;

      const [connectionTest, stats] = await Promise.all([
        wordpressService.testConnection(config),
        wordpressService.getIntegrationStats(blogId!),
      ]);

      return {
        connection: connectionTest,
        stats,
        overall_health:
          connectionTest.success && stats.connection_status === "connected"
            ? "healthy"
            : "unhealthy",
        last_check: new Date().toISOString(),
      };
    },
    enabled: !!config && !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 10 * 60 * 1000, // Verificar a cada 10 minutos
  });
}

// Hook para sincronização completa
export function useFullSyncFromWordPress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogId: string) =>
      wordpressService.fullSyncFromWordPress(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["wordpress-categories"] });
      queryClient.invalidateQueries({ queryKey: ["wordpress-tags"] });
      queryClient.invalidateQueries({ queryKey: ["wordpress-media"] });
      queryClient.invalidateQueries({
        queryKey: ["wordpress-integration-stats"],
      });
      toast.success("Sincronização completa realizada com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro na sincronização completa:", error);
      toast.error("Erro na sincronização completa");
    },
  });
}

// Hook para sincronizar categorias do WordPress
export function useSyncCategoriesFromWordPress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogId: string) =>
      wordpressService.syncCategoriesFromWordPress(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-categories"] });
      toast.success("Categorias sincronizadas com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao sincronizar categorias:", error);
      toast.error("Erro ao sincronizar categorias");
    },
  });
}

// Hook para sincronizar tags do WordPress
export function useSyncTagsFromWordPress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogId: string) =>
      wordpressService.syncTagsFromWordPress(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-tags"] });
      toast.success("Tags sincronizadas com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao sincronizar tags:", error);
      toast.error("Erro ao sincronizar tags");
    },
  });
}

// Hook para sincronizar mídia do WordPress
export function useSyncMediaFromWordPress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogId: string) =>
      wordpressService.syncMediaFromWordPress(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-media"] });
      toast.success("Mídia sincronizada com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao sincronizar mídia:", error);
      toast.error("Erro ao sincronizar mídia");
    },
  });
}

export function useBulkWordPressOperations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      config,
      operation,
      items,
    }: {
      config: WordPressConfig;
      operation: "publish" | "draft" | "trash" | "sync";
      items: Array<{ id: number; type: "post" | "page" }>;
    }) => {
      const results = [];

      for (const item of items) {
        try {
          if (operation === "publish" || operation === "draft") {
            const result = await wordpressService.updateWordPressPost(
              config,
              item.id,
              {
                status: operation === "publish" ? "publish" : "draft",
              }
            );
            results.push({ id: item.id, success: !!result, result });
          } else if (operation === "trash") {
            const result = await wordpressService.deleteWordPressPost(
              config,
              item.id,
              false
            );
            results.push({ id: item.id, success: result });
          }
        } catch (error) {
          results.push({
            id: item.id,
            success: false,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts"] });

      const successCount = results.filter((r) => r.success).length;
      const errorCount = results.filter((r) => !r.success).length;

      if (successCount > 0) {
        toast.success(`${successCount} itens processados com sucesso!`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} itens falharam no processamento`);
      }
    },
    onError: () => {
      toast.error("Erro na operação em lote");
    },
  });
}

interface UseWordPressIntegrationOptions {
  blogId?: string;
  autoSync?: boolean;
  syncInterval?: number;
}

interface BulkAction {
  action: "status" | "categories" | "tags" | "author" | "delete";
  value?: any;
}

export function useWordPressIntegration(
  options?: UseWordPressIntegrationOptions
) {
  const wpService = new WordPressIntegrationService();
  const queryClient = useQueryClient();
  const blogId = options?.blogId || "";

  // Buscar posts com filtros avançados
  const posts = useQuery({
    queryKey: ["wordpress-posts", blogId],
    queryFn: async () => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) return [];

      return wpService.getWordPressPosts(config, {
        per_page: 100,
        status: "_any", // Busca todos os status
        orderby: "modified",
        order: "desc",
      });
    },
    enabled: !!blogId,
    refetchInterval: options?.autoSync
      ? (options.syncInterval || 30) * 60 * 1000
      : false,
  });

  // Buscar categorias
  const categories = useQuery({
    queryKey: ["wordpress-categories", blogId],
    queryFn: async () => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) return [];
      return wpService.getWordPressCategories(config);
    },
    enabled: !!blogId,
  });

  // Buscar tags
  const tags = useQuery({
    queryKey: ["wordpress-tags", blogId],
    queryFn: async () => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) return [];
      return wpService.getWordPressTags(config);
    },
    enabled: !!blogId,
  });

  // Buscar mídia
  const media = useQuery({
    queryKey: ["wordpress-media", blogId],
    queryFn: async () => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) return [];
      return wpService.getWordPressMedia(config, { per_page: 100 });
    },
    enabled: !!blogId,
  });

  // Buscar usuários
  const users = useQuery({
    queryKey: ["wordpress-users", blogId],
    queryFn: async () => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) return [];
      return wpService.getWordPressUsers(config);
    },
    enabled: !!blogId,
  });

  // Buscar comentários
  const comments = useQuery({
    queryKey: ["wordpress-comments", blogId],
    queryFn: async () => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) return [];
      return wpService.getWordPressComments(config, {
        status: "hold", // Apenas comentários pendentes
        per_page: 50,
      });
    },
    enabled: !!blogId,
  });

  // Mutation para criar post
  const createPost = useMutation({
    mutationFn: async (data: CreateWordPressPostData) => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");
      return wpService.createWordPressPost(config, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts", blogId] });
    },
  });

  // Mutation para atualizar post
  const updatePost = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateWordPressPostData;
    }) => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");
      return wpService.updateWordPressPost(config, id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts", blogId] });
    },
  });

  // Mutation para deletar post
  const deletePost = useMutation({
    mutationFn: async (postId: number) => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");
      return wpService.deleteWordPressPost(config, postId, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts", blogId] });
    },
  });

  // Mutation para ações em massa
  const bulkUpdatePosts = useMutation({
    mutationFn: async ({
      postIds,
      action,
    }: {
      postIds: number[];
      action: BulkAction;
    }) => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");

      const results: BulkUpdateResult[] = [];

      for (const postId of postIds) {
        try {
          let success = false;
          let result = null;

          switch (action.action) {
            case "status":
              result = await wpService.updateWordPressPost(config, postId, {
                status: action.value,
              });
              success = !!result;
              break;

            case "categories":
              result = await wpService.updateWordPressPost(config, postId, {
                categories: action.value,
              });
              success = !!result;
              break;

            case "tags":
              result = await wpService.updateWordPressPost(config, postId, {
                tags: action.value,
              });
              success = !!result;
              break;

            case "author":
              result = await wpService.updateWordPressPost(config, postId, {
                author: action.value,
              });
              success = !!result;
              break;

            case "delete":
              success = await wpService.deleteWordPressPost(
                config,
                postId,
                action.value
              );
              break;
          }

          results.push({ postId, success, error: null });
        } catch (error) {
          results.push({
            postId,
            success: false,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          });
        }
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts", blogId] });
    },
  });

  // Mutation para upload de mídia
  const uploadMedia = useMutation({
    mutationFn: async ({
      file,
      title,
      alt,
    }: {
      file: File;
      title?: string;
      alt?: string;
    }) => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");
      return wpService.uploadWordPressMedia(config, file, title, alt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-media", blogId] });
    },
  });

  // Mutation para moderar comentário
  const moderateComment = useMutation({
    mutationFn: async ({
      commentId,
      status,
    }: {
      commentId: number;
      status: "approve" | "hold" | "spam" | "trash";
    }) => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");
      return wpService.moderateComment(config, commentId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wordpress-comments", blogId],
      });
    },
  });

  // Mutation para sincronizar taxonomias
  const syncTaxonomies = useMutation({
    mutationFn: async () => {
      const [categoriesResult, tagsResult] = await Promise.all([
        wpService.syncCategoriesFromWordPress(blogId),
        wpService.syncTagsFromWordPress(blogId),
      ]);

      return {
        categories: categoriesResult,
        tags: tagsResult,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wordpress-categories", blogId],
      });
      queryClient.invalidateQueries({ queryKey: ["wordpress-tags", blogId] });
    },
  });

  // Mutation para criar categoria
  const createCategory = useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      slug?: string;
      parent?: number;
    }) => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");
      return wpService.createWordPressCategory(config, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wordpress-categories", blogId],
      });
    },
  });

  // Mutation para criar tag
  const createTag = useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      slug?: string;
    }) => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");
      return wpService.createWordPressTag(config, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-tags", blogId] });
    },
  });

  // Mutation para sincronização completa
  const fullSync = useMutation({
    mutationFn: async () => {
      return wpService.fullSyncFromWordPress(blogId);
    },
    onSuccess: () => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts", blogId] });
      queryClient.invalidateQueries({
        queryKey: ["wordpress-categories", blogId],
      });
      queryClient.invalidateQueries({ queryKey: ["wordpress-tags", blogId] });
      queryClient.invalidateQueries({ queryKey: ["wordpress-media", blogId] });
    },
  });

  // Mutation para backup
  const createBackup = useMutation({
    mutationFn: async () => {
      const config = await wpService.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");
      return wpService.createWordPressBackup(config);
    },
  });

  // Estado de loading combinado
  const isLoading = posts.isLoading || categories.isLoading || tags.isLoading;

  // Estado de erro combinado
  const error = posts.error || categories.error || tags.error;

  return {
    // Dados
    posts: posts.data,
    categories: categories.data,
    tags: tags.data,
    media: media.data,
    users: users.data,
    comments: comments.data,

    // Estados
    isLoading,
    error,
    isPostsLoading: posts.isLoading,
    isCategoriesLoading: categories.isLoading,
    isTagsLoading: tags.isLoading,
    isMediaLoading: media.isLoading,
    isUsersLoading: users.isLoading,
    isCommentsLoading: comments.isLoading,

    // Mutations
    createPost,
    updatePost,
    deletePost,
    bulkUpdatePosts,
    uploadMedia,
    moderateComment,
    syncTaxonomies,
    createCategory,
    createTag,
    fullSync,
    createBackup,

    // Refetch functions
    refetchPosts: posts.refetch,
    refetchCategories: categories.refetch,
    refetchTags: tags.refetch,
    refetchMedia: media.refetch,
    refetchUsers: users.refetch,
    refetchComments: comments.refetch,
  };
}

// Hook específico para dashboard WordPress
export function useWordPressDashboard(blogId?: string) {
  const wpService = new WordPressIntegrationService();

  return useQuery({
    queryKey: ["wordpress-dashboard", blogId],
    queryFn: async () => {
      if (!blogId) return null;

      const stats = await wpService.getIntegrationStats(blogId);
      const config = await wpService.getWordPressConfig(blogId);

      return {
        stats,
        config,
        isConnected: !!config,
      };
    },
    enabled: !!blogId,
  });
}
