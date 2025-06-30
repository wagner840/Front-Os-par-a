"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wordpressService } from "@/lib/services/wordpress-integration";
import { useWordPressConfig } from "./useWordPressConfig";
import type { WordPressConfig } from "@/lib/types/wordpress";

// ===== CATEGORIAS =====
export function useWordPressCategories(blogId?: string) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-categories", blogId],
    queryFn: () =>
      config ? wordpressService.getWordPressCategories(config) : [],
    enabled: !!config && !!blogId,
    staleTime: 10 * 60 * 1000,
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

// ===== TAGS =====
export function useWordPressTags(blogId?: string) {
  const { data: config } = useWordPressConfig(blogId);

  return useQuery({
    queryKey: ["wordpress-tags", blogId],
    queryFn: () => (config ? wordpressService.getWordPressTags(config) : []),
    enabled: !!config && !!blogId,
    staleTime: 10 * 60 * 1000,
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
