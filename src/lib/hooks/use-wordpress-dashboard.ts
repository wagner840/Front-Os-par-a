
"use client";

import { useState } from "react";
import {
  useWordPressConfig,
  useWordPressPosts,
  useWordPressCategories,
  useWordPressTags,
  useWordPressMedia,
  useWordPressUsers,
  useWordPressIntegrationStats,
  useWordPressHealthCheck,
  useWordPressPerformanceMetrics,
  useSyncPostToWordPress,
  useSyncPostsFromWordPress,
  useCreateWordPressBackup,
  useTestWordPressConnection,
  useFullSyncFromWordPress,
  useSyncCategoriesFromWordPress,
  useSyncTagsFromWordPress,
  useSyncMediaFromWordPress,
} from "@/lib/hooks/use-wordpress-integration";
import { useAppStore } from "@/lib/stores/app-store";
import { toast } from "sonner";

export function useWordPressDashboard() {
  const { selectedBlog } = useAppStore();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastConnectionTest, setLastConnectionTest] = useState<{
    success: boolean;
    message: string;
    timestamp: Date;
  } | null>(null);

  // Hooks
  const { data: config, isLoading: configLoading } = useWordPressConfig(
    selectedBlog || undefined
  );
  const { data: posts, refetch: refetchPosts } = useWordPressPosts(
    selectedBlog || undefined,
    { per_page: 5 }
  );
  const { data: categories } = useWordPressCategories(
    selectedBlog || undefined
  );
  const { data: tags } = useWordPressTags(selectedBlog || undefined);
  const { data: media } = useWordPressMedia(selectedBlog || undefined, {
    per_page: 5,
  });
  const { data: users } = useWordPressUsers(selectedBlog || undefined);
  const { data: stats, refetch: refetchStats } = useWordPressIntegrationStats(
    selectedBlog || undefined
  );
  const { data: healthCheck } = useWordPressHealthCheck(
    selectedBlog || undefined
  );
  const { data: performance } = useWordPressPerformanceMetrics(
    selectedBlog || undefined
  );
  const testConnection = useTestWordPressConnection();

  // Mutations
  const syncToWordPress = useSyncPostToWordPress();
  const syncFromWordPress = useSyncPostsFromWordPress();
  const createBackup = useCreateWordPressBackup();
  const fullSync = useFullSyncFromWordPress();
  const syncCategories = useSyncCategoriesFromWordPress();
  const syncTags = useSyncTagsFromWordPress();
  const syncMedia = useSyncMediaFromWordPress();

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchPosts(), refetchStats()]);
      toast.success("Dashboard atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar dashboard");
    }
  };

  const handleSyncFromWordPress = async () => {
    if (!selectedBlog) return;
    try {
      await syncFromWordPress.mutateAsync(selectedBlog);
    } catch (error) {
      console.error("Erro na sincronização:", error);
    }
  };

  const handleCreateBackup = async () => {
    if (!selectedBlog || !config) return;

    try {
      await createBackup.mutateAsync(config);
    } catch (error) {
      console.error("Erro ao criar backup:", error);
    }
  };

  const handleFullSync = async () => {
    if (!selectedBlog) return;
    try {
      await fullSync.mutateAsync(selectedBlog);
      await refetchStats();
    } catch (error) {
      console.error("Erro na sincronização completa:", error);
    }
  };

  const handleSyncCategories = async () => {
    if (!selectedBlog) return;
    try {
      await syncCategories.mutateAsync(selectedBlog);
    } catch (error) {
      console.error("Erro ao sincronizar categorias:", error);
    }
  };

  const handleSyncTags = async () => {
    if (!selectedBlog) return;
    try {
      await syncTags.mutateAsync(selectedBlog);
    } catch (error) {
      console.error("Erro ao sincronizar tags:", error);
    }
  };

  const handleSyncMedia = async () => {
    if (!selectedBlog) return;
    try {
      await syncMedia.mutateAsync(selectedBlog);
    } catch (error) {
      console.error("Erro ao sincronizar mídia:", error);
    }
  };

  const handleTestConnection = async () => {
    if (!config) {
      toast.error("Configure a integração WordPress primeiro");
      return;
    }

    setIsTestingConnection(true);
    try {
      const result = await testConnection.mutateAsync(config);
      setLastConnectionTest({
        success: result.success,
        message: result.message,
        timestamp: new Date(),
      });

      if (result.success) {
        await refetchStats();
      }
    } catch (error) {
      console.error("Erro no teste:", error);
      setLastConnectionTest({
        success: false,
        message: "Erro ao testar conexão",
        timestamp: new Date(),
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return {
    selectedBlog,
    config,
    configLoading,
    posts,
    categories,
    tags,
    media,
    users,
    stats,
    healthCheck,
    performance,
    isTestingConnection,
    lastConnectionTest,
    syncToWordPress,
    syncFromWordPress,
    createBackup,
    fullSync,
    syncCategories,
    syncTags,
    syncMedia,
    handleRefresh,
    handleSyncFromWordPress,
    handleCreateBackup,
    handleFullSync,
    handleSyncCategories,
    handleSyncTags,
    handleSyncMedia,
    handleTestConnection,
  };
}
