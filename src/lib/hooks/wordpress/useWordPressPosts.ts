"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wordpressService } from "@/lib/services/wordpress-integration";
import { useWordPressConfig } from "./useWordPressConfig";
import type {
  CreateWordPressPostData,
  UpdateWordPressPostData,
  WordPressConfig,
} from "@/lib/types/wordpress";

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
    staleTime: 2 * 60 * 1000,
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
    onSuccess: () => {
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
