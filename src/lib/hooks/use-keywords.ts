"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/stores/app-store";
import { useEffect } from "react";
import { toast } from "sonner";

const supabase = createClient();

export interface MainKeyword {
  id: string;
  blog_id: string;
  keyword: string;
  msv: number | null; // Corrigido: era search_volume
  kw_difficulty: number | null; // Corrigido: era difficulty
  cpc: number | null;
  competition: string | null;
  search_intent: string | null;
  is_used: boolean;
  location: string;
  language: string;
  Search_limit: number;
  created_at: string;
  updated_at: string;
}

export interface KeywordVariation {
  id: string;
  main_keyword_id: string;
  keyword: string;
  variation_type: string | null;
  msv: number | null; // Corrigido: era search_volume
  kw_difficulty: number | null; // Corrigido: era difficulty
  cpc: number | null;
  competition: string | null;
  search_intent: string | null;
  answer: string | null;
  embedding: number[] | null;
  created_at: string;
  updated_at: string;
}

// Hook para Main Keywords com reatividade
export function useMainKeywords(
  blogId?: string,
  filters?: {
    search?: string;
    competition?: string;
    search_intent?: string;
    is_used?: boolean;
    sortBy?: keyof MainKeyword;
    sortOrder?: "asc" | "desc";
    limit?: number;
  }
) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["main-keywords"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["main-keywords", selectedBlog, blogId, filters],
    queryFn: async () => {
      let query = supabase.from("main_keywords").select("*");

      // Aplicar filtro de blog
      const currentBlogId = blogId || selectedBlog;
      if (currentBlogId && currentBlogId !== "all") {
        query = query.eq("blog_id", currentBlogId);
      }

      // Aplicar filtros
      if (filters?.search) {
        query = query.ilike("keyword", `%${filters.search}%`);
      }

      if (filters?.competition && filters.competition !== "all") {
        query = query.eq("competition", filters.competition);
      }

      if (filters?.search_intent && filters.search_intent !== "all") {
        query = query.eq("search_intent", filters.search_intent);
      }

      if (filters?.is_used !== undefined) {
        query = query.eq("is_used", filters.is_used);
      }

      // Ordenação
      const sortBy = filters?.sortBy || "msv";
      const sortOrder = filters?.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Limite
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching main keywords:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!selectedBlog, // Só executar se há um blog selecionado
  });
}

// Hook para Keyword Variations com reatividade
export function useKeywordVariations(
  mainKeywordId?: string,
  filters?: {
    search?: string;
    variation_type?: string;
    sortBy?: keyof KeywordVariation;
    sortOrder?: "asc" | "desc";
    limit?: number;
  }
) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["keyword-variations"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["keyword-variations", selectedBlog, mainKeywordId, filters],
    queryFn: async () => {
      let query = supabase.from("keyword_variations").select(`
          *,
          main_keyword:main_keywords(keyword, blog_id)
        `);

      // Filtrar por main keyword se especificado
      if (mainKeywordId && mainKeywordId !== "all") {
        query = query.eq("main_keyword_id", mainKeywordId);
      }

      // Filtrar por blog através da main keyword
      if (selectedBlog && selectedBlog !== "all") {
        query = query.eq("main_keyword.blog_id", selectedBlog);
      }

      // Aplicar filtros
      if (filters?.search) {
        query = query.ilike("keyword", `%${filters.search}%`);
      }

      if (filters?.variation_type && filters.variation_type !== "all") {
        query = query.eq("variation_type", filters.variation_type);
      }

      // Ordenação
      const sortBy = filters?.sortBy || "msv";
      const sortOrder = filters?.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Limite
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching keyword variations:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!selectedBlog,
  });
}

// Hook para Keywords não utilizadas
export function useUnusedKeywords(blogId?: string) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["unused-keywords"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["unused-keywords", selectedBlog, blogId],
    queryFn: async () => {
      let query = supabase
        .from("main_keywords")
        .select("*")
        .eq("is_used", false);

      // Aplicar filtro de blog
      const currentBlogId = blogId || selectedBlog;
      if (currentBlogId && currentBlogId !== "all") {
        query = query.eq("blog_id", currentBlogId);
      }

      // Ordenar por MSV (volume de busca) decrescente
      query = query.order("msv", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching unused keywords:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!selectedBlog,
  });
}

// Hook para estatísticas de keywords
export function useKeywordStats(blogId?: string) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["keyword-stats"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["keyword-stats", selectedBlog, blogId],
    queryFn: async () => {
      const currentBlogId = blogId || selectedBlog;

      if (!currentBlogId || currentBlogId === "all") {
        return {
          total: 0,
          used: 0,
          unused: 0,
          high_volume: 0,
          medium_volume: 0,
          low_volume: 0,
          avg_difficulty: 0,
          total_variations: 0,
        };
      }

      // Buscar main keywords
      const { data: mainKeywords, error: mainError } = await supabase
        .from("main_keywords")
        .select("msv, kw_difficulty, is_used")
        .eq("blog_id", currentBlogId);

      if (mainError) {
        console.error("Error fetching keyword stats:", mainError);
        throw mainError;
      }

      // Buscar total de variations
      const { count: variationsCount, error: variationsError } = await supabase
        .from("keyword_variations")
        .select("*", { count: "exact", head: true })
        .in("main_keyword_id", mainKeywords?.map((k) => k.id) || []);

      if (variationsError) {
        console.warn("Error counting variations:", variationsError);
      }

      const keywords = mainKeywords || [];

      return {
        total: keywords.length,
        used: keywords.filter((k) => k.is_used).length,
        unused: keywords.filter((k) => !k.is_used).length,
        high_volume: keywords.filter((k) => (k.msv || 0) >= 1000).length,
        medium_volume: keywords.filter(
          (k) => (k.msv || 0) >= 100 && (k.msv || 0) < 1000
        ).length,
        low_volume: keywords.filter((k) => (k.msv || 0) < 100).length,
        avg_difficulty:
          keywords.length > 0
            ? keywords.reduce((sum, k) => sum + (k.kw_difficulty || 0), 0) /
              keywords.length
            : 0,
        total_variations: variationsCount || 0,
      };
    },
    enabled: !!selectedBlog,
  });
}

// Hook para busca semântica de keywords
export function useSemanticKeywordSearch(
  searchQuery: string,
  threshold: number = 0.8,
  limit: number = 10
) {
  const { selectedBlog } = useAppStore();

  return useQuery({
    queryKey: [
      "semantic-keyword-search",
      selectedBlog,
      searchQuery,
      threshold,
      limit,
    ],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      // Fallback para busca textual
      let query = supabase
        .from("keyword_variations")
        .select(
          `
          *,
          main_keyword:main_keywords(keyword, blog_id)
        `
        )
        .or(`keyword.ilike.%${searchQuery}%,answer.ilike.%${searchQuery}%`)
        .limit(limit);

      // Filtrar por blog se selecionado
      if (selectedBlog && selectedBlog !== "all") {
        query = query.eq("main_keyword.blog_id", selectedBlog);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error in semantic keyword search:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!searchQuery.trim() && !!selectedBlog,
  });
}

// Mutation para criar main keyword
export function useCreateMainKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      keyword: Omit<MainKeyword, "id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await supabase
        .from("main_keywords")
        .insert(keyword)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-keywords"] });
      queryClient.invalidateQueries({ queryKey: ["keyword-stats"] });
      toast.success("Palavra-chave principal criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar palavra-chave principal");
    },
  });
}

// Mutation para atualizar main keyword
export function useUpdateMainKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<MainKeyword>;
    }) => {
      const { data, error } = await supabase
        .from("main_keywords")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-keywords"] });
      queryClient.invalidateQueries({ queryKey: ["keyword-stats"] });
      toast.success("Palavra-chave atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar palavra-chave");
    },
  });
}

// Mutation para deletar main keyword
export function useDeleteMainKeyword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("main_keywords")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["main-keywords"] });
      queryClient.invalidateQueries({ queryKey: ["keyword-stats"] });
      toast.success("Palavra-chave deletada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao deletar palavra-chave");
    },
  });
}

// Mutation para marcar keyword como usada/não usada
export function useToggleKeywordUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_used }: { id: string; is_used: boolean }) => {
      const { data, error } = await supabase
        .from("main_keywords")
        .update({ is_used })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["main-keywords"] });
      queryClient.invalidateQueries({ queryKey: ["unused-keywords"] });
      queryClient.invalidateQueries({ queryKey: ["keyword-stats"] });
      toast.success(
        `Palavra-chave marcada como ${data.is_used ? "usada" : "não usada"}!`
      );
    },
    onError: () => {
      toast.error("Erro ao atualizar status da palavra-chave");
    },
  });
}

// Mutation para importar keywords em lote
export function useBulkImportKeywords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      keywords: Omit<MainKeyword, "id" | "created_at" | "updated_at">[]
    ) => {
      const { data, error } = await supabase
        .from("main_keywords")
        .insert(keywords)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["main-keywords"] });
      queryClient.invalidateQueries({ queryKey: ["keyword-stats"] });
      toast.success(`${data.length} palavras-chave importadas com sucesso!`);
    },
    onError: () => {
      toast.error("Erro ao importar palavras-chave");
    },
  });
}
