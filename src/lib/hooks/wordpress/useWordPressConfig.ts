"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wordpressService } from "@/lib/services/wordpress-integration";
import type { WordPressConfig } from "@/lib/types/wordpress";

export function useWordPressConfig(blogId?: string) {
  return useQuery({
    queryKey: ["wordpress-config", blogId],
    queryFn: () =>
      blogId ? wordpressService.getWordPressConfig(blogId) : null,
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000,
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
