"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wordpressService } from "@/lib/services/wordpress-integration";
import {
  getWordPressConfigByBlogId,
  getAllBlogConfigs,
  getBlogName,
  isValidBlogId,
  BLOG_IDS,
} from "@/lib/wordpress/config";
import type { WordPressConfig } from "@/lib/types/wordpress";

/**
 * Hook para obter configuração WordPress de um blog específico
 * Prioriza variáveis de ambiente sobre configurações do banco
 */
export function useWordPressConfigMulti(blogId?: string) {
  return useQuery({
    queryKey: ["wordpress-config-multi", blogId],
    queryFn: async () => {
      if (!blogId) return null;

      // Tentar primeiro pelas variáveis de ambiente
      const envConfig = getWordPressConfigByBlogId(blogId);
      if (envConfig) {
        return {
          source: "environment" as const,
          config: envConfig,
          blogName: getBlogName(blogId),
        };
      }

      // Se não encontrou nas variáveis, buscar do banco
      const dbConfig = await wordpressService.getWordPressConfig(blogId);
      return {
        source: "database" as const,
        config: dbConfig,
        blogName: getBlogName(blogId),
      };
    },
    enabled: !!blogId && isValidBlogId(blogId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obter todas as configurações WordPress disponíveis
 */
export function useAllWordPressConfigs() {
  return useQuery({
    queryKey: ["wordpress-configs-all"],
    queryFn: async () => {
      const configs = getAllBlogConfigs();

      // Para blogs sem config de ambiente, buscar do banco
      const configsWithDatabase = await Promise.all(
        configs.map(async ({ blogId, name, config }) => {
          if (config) {
            return {
              blogId,
              name,
              config,
              source: "environment" as const,
              isConfigured: true,
            };
          }

          // Buscar do banco
          const dbConfig = await wordpressService.getWordPressConfig(blogId);
          return {
            blogId,
            name,
            config: dbConfig,
            source: "database" as const,
            isConfigured: !!dbConfig,
          };
        })
      );

      return configsWithDatabase;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para salvar configuração WordPress no banco
 * Nota: Variáveis de ambiente têm prioridade e não podem ser alteradas via interface
 */
export function useSaveWordPressConfigMulti() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blogId,
      config,
    }: {
      blogId: string;
      config: WordPressConfig;
    }) => {
      // Verificar se já existe configuração de ambiente
      const envConfig = getWordPressConfigByBlogId(blogId);
      if (envConfig) {
        throw new Error(
          `Configuração do blog ${getBlogName(
            blogId
          )} está definida via variáveis de ambiente e não pode ser alterada pela interface.`
        );
      }

      return wordpressService.saveWordPressConfig(blogId, config);
    },
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries({
        queryKey: ["wordpress-config-multi", blogId],
      });
      queryClient.invalidateQueries({
        queryKey: ["wordpress-configs-all"],
      });
      toast.success("Configuração WordPress salva com sucesso!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao salvar configuração WordPress"
      );
    },
  });
}

/**
 * Hook para testar conexão WordPress
 */
export function useTestWordPressConnectionMulti() {
  return useMutation({
    mutationFn: async ({
      blogId,
      config,
    }: {
      blogId?: string;
      config?: WordPressConfig;
    }) => {
      let testConfig: WordPressConfig;

      if (config) {
        testConfig = config;
      } else if (blogId) {
        const existingConfig = await wordpressService.getWordPressConfig(
          blogId
        );
        if (!existingConfig) {
          throw new Error("Configuração WordPress não encontrada");
        }
        testConfig = existingConfig;
      } else {
        throw new Error("Forneça um blogId ou config para testar");
      }

      return wordpressService.testConnection(testConfig);
    },
    onSuccess: (result, { blogId }) => {
      if (result.success) {
        const blogName = blogId ? getBlogName(blogId) : "Blog";
        toast.success(`${blogName}: ${result.message}`);
      } else {
        const blogName = blogId ? getBlogName(blogId) : "Blog";
        toast.error(`${blogName}: ${result.message}`);
      }
    },
    onError: (error, { blogId }) => {
      const blogName = blogId ? getBlogName(blogId) : "Blog";
      toast.error(`${blogName}: Erro ao testar conexão`);
    },
  });
}

/**
 * Hook para verificar quais blogs estão configurados
 */
export function useWordPressConfigStatus() {
  return useQuery({
    queryKey: ["wordpress-config-status"],
    queryFn: async () => {
      const allConfigs = getAllBlogConfigs();

      const status = await Promise.all(
        allConfigs.map(async ({ blogId, name, config: envConfig }) => {
          let hasConfig = !!envConfig;
          let source: "environment" | "database" | "none" = envConfig
            ? "environment"
            : "none";

          if (!hasConfig) {
            const dbConfig = await wordpressService.getWordPressConfig(blogId);
            hasConfig = !!dbConfig;
            source = hasConfig ? "database" : "none";
          }

          return {
            blogId,
            name,
            hasConfig,
            source,
            canEdit: source !== "environment", // Não pode editar configs de ambiente
          };
        })
      );

      return {
        total: status.length,
        configured: status.filter((s) => s.hasConfig).length,
        fromEnvironment: status.filter((s) => s.source === "environment")
          .length,
        fromDatabase: status.filter((s) => s.source === "database").length,
        notConfigured: status.filter((s) => s.source === "none").length,
        blogs: status,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook utilitário para obter informações de um blog
 */
export function useBlogInfo(blogId?: string) {
  return {
    blogId,
    name: blogId ? getBlogName(blogId) : "Selecione um blog",
    isValid: blogId ? isValidBlogId(blogId) : false,
    isEinsof7: blogId === BLOG_IDS.EINSOF7,
    isOpetmil: blogId === BLOG_IDS.OPETMIL,
  };
}
