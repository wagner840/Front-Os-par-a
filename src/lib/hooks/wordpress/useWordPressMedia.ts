"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wordpressService } from "@/lib/services/wordpress-integration";
import { useWordPressConfig } from "./useWordPressConfig";
import type { WordPressConfig } from "@/lib/types/wordpress";

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
    staleTime: 5 * 60 * 1000,
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
