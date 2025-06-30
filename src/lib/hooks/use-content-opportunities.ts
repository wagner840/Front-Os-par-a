"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/stores/app-store";
import { useEffect } from "react";

const supabase = createClient();
import type { Json } from "@/lib/types/database";

// Tipos para Content Opportunities (baseados na estrutura real do banco)
interface ContentOpportunitiesCategories {
  id: string;
  blog_id: string;
  category_id: string;
  title: string;
  description?: string;
  priority_score?: number;
  estimated_traffic?: number;
  difficulty_score?: number;
  status: string;
  target_keywords?: string[];
  content_outline?: string;
  notes?: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  main_keyword_id?: string;

  // Dados da keyword relacionada (da view)
  main_keyword?: string;
  keyword_msv?: number;
  keyword_difficulty?: number;
  keyword_cpc?: number;
  keyword_competition?: string;
  keyword_search_intent?: string;
  keyword_is_used?: boolean;

  // Dados relacionados (da view)
  blog_name?: string;
  category_name?: string;
  assigned_author_name?: string;
  assigned_author_email?: string;
  calculated_opportunity_score?: number;
}

interface ContentOpportunitiesClusters {
  id: string;
  blog_id: string;
  cluster_id: string;
  title: string;
  description?: string;
  content_type?: string;
  priority_score?: number;
  estimated_traffic?: number;
  difficulty_score?: number;
  status: string;
  target_keywords?: string[];
  content_outline?: string;
  notes?: string;
  assigned_to?: string;
  due_date?: string;
  embedding?: number[];
  created_at: string;
  updated_at: string;
  final_title?: string;
  final_description?: string;
}

interface OpportunityFilters {
  blogId?: string;
  status?: string;
  categoryId?: string;
  assignedTo?: string;
  priority?: "high" | "medium" | "low";
  dateRange?: {
    start: string;
    end: string;
  };
}

interface ContentGap {
  keyword_id: string;
  keyword: string;
  msv?: number;
  kw_difficulty?: number;
  opportunity_count: number;
  content_gap_score: number;
  recommendation: string;
}

// Hook para Content Opportunities Categories com keywords relacionadas
export function useContentOpportunitiesCategories(
  filters: OpportunityFilters = {}
) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["content-opportunities-categories"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["content-opportunities-categories", selectedBlog, filters],
    queryFn: async () => {
      // Usar a nova view que inclui dados das keywords
      let query = supabase
        .from("vw_content_opportunities_with_keywords")
        .select("*");

      // Aplicar filtro de blog
      const currentBlogId = filters.blogId || selectedBlog;
      if (currentBlogId && currentBlogId !== "all") {
        query = query.eq("blog_id", currentBlogId);
      }

      // Aplicar outros filtros
      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.categoryId && filters.categoryId !== "all") {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters.assignedTo && filters.assignedTo !== "all") {
        query = query.eq("assigned_to", filters.assignedTo);
      }

      if (filters.dateRange) {
        query = query
          .gte("created_at", filters.dateRange.start)
          .lte("created_at", filters.dateRange.end);
      }

      // Filtro de prioridade baseado no score calculado
      if (filters.priority) {
        switch (filters.priority) {
          case "high":
            query = query.gte("calculated_opportunity_score", 70);
            break;
          case "medium":
            query = query
              .gte("calculated_opportunity_score", 40)
              .lt("calculated_opportunity_score", 70);
            break;
          case "low":
            query = query.lt("calculated_opportunity_score", 40);
            break;
        }
      }

      // Ordenar por score de oportunidade calculado
      query = query.order("calculated_opportunity_score", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching content opportunities:", error);
        throw error;
      }

      return (data || []) as ContentOpportunitiesCategories[];
    },
    enabled: !!selectedBlog,
  });
}

// Hook para Content Opportunities Clusters com reatividade
export function useContentOpportunitiesClusters(
  filters: OpportunityFilters = {}
) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["content-opportunities-clusters"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["content-opportunities-clusters", selectedBlog, filters],
    queryFn: async () => {
      let query = supabase.from("content_opportunities_clusters").select(`
          *,
          blog:blogs(name),
          cluster:keyword_clusters(cluster_name, description),
          assigned_to_author:authors(name, email)
        `);

      // Aplicar filtro de blog
      const blogFilter = filters.blogId || selectedBlog;
      if (blogFilter && blogFilter !== "all") {
        query = query.eq("blog_id", blogFilter);
      }

      // Aplicar outros filtros
      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.clusterId && filters.clusterId !== "all") {
        query = query.eq("cluster_id", filters.clusterId);
      }

      if (filters.assignedTo && filters.assignedTo !== "all") {
        query = query.eq("assigned_to", filters.assignedTo);
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      // Ordenação
      const sortBy = filters.sortBy || "priority_score";
      const sortOrder = filters.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching content opportunities clusters:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!selectedBlog, // Só executar se há um blog selecionado
  });
}

// Hook para busca semântica de opportunities
export function useSemanticOpportunitySearch(
  searchQuery: string,
  type: "categories" | "clusters" = "categories",
  threshold: number = 0.8,
  limit: number = 10
) {
  const { selectedBlog } = useAppStore();

  return useQuery({
    queryKey: [
      "semantic-opportunity-search",
      selectedBlog,
      searchQuery,
      type,
      threshold,
      limit,
    ],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      // Fallback para busca textual
      const table =
        type === "categories"
          ? "content_opportunities_categories"
          : "content_opportunities_clusters";

      let query = supabase
        .from(table)
        .select("*")
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(limit);

      // Filtrar por blog se selecionado
      if (selectedBlog && selectedBlog !== "all") {
        query = query.eq("blog_id", selectedBlog);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error in semantic search:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!searchQuery.trim() && !!selectedBlog,
  });
}

// Hook para análise de gaps de conteúdo
export function useContentGapsAnalysis(
  minMsv: number = 100,
  maxDifficulty: number = 50
) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["content-gaps-analysis"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["content-gaps-analysis", selectedBlog, minMsv, maxDifficulty],
    queryFn: async () => {
      if (!selectedBlog) {
        return [];
      }

      const { data, error } = await supabase.rpc("analyze_content_gaps", {
        target_blog_id: selectedBlog,
        min_msv: minMsv,
        max_difficulty: maxDifficulty,
      });

      if (error) {
        console.error("Error analyzing content gaps:", error);
        throw error;
      }

      return (data || []) as ContentGap[];
    },
    enabled: !!selectedBlog,
  });
}

// Hook para estatísticas de opportunities


// Mutation para gerar opportunities automaticamente baseadas em gaps
export function useGenerateOpportunitiesFromGaps() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blogId,
      minGapScore = 40,
      maxOpportunities = 10,
    }: {
      blogId: string;
      minGapScore?: number;
      maxOpportunities?: number;
    }) => {
      const { data, error } = await supabase.rpc(
        "generate_opportunities_from_gaps",
        {
          target_blog_id: blogId,
          min_gap_score: minGapScore,
          max_opportunities: maxOpportunities,
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidar caches relacionados
      queryClient.invalidateQueries({
        queryKey: ["content-opportunities-categories"],
      });
      queryClient.invalidateQueries({ queryKey: ["opportunities-stats"] });
      queryClient.invalidateQueries({ queryKey: ["content-gaps-analysis"] });
    },
  });
}

// Mutation para criar nova opportunity
export function useCreateContentOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      opportunity: Omit<
        ContentOpportunitiesCategories,
        "id" | "created_at" | "updated_at"
      >
    ) => {
      const { data, error } = await supabase
        .from("content_opportunities_categories")
        .insert(opportunity)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["content-opportunities-categories"],
      });
      queryClient.invalidateQueries({ queryKey: ["opportunities-stats"] });
    },
  });
}

// Mutation para atualizar opportunity
export function useUpdateContentOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ContentOpportunitiesCategories>;
    }) => {
      const { data, error } = await supabase
        .from("content_opportunities_categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["content-opportunities-categories"],
      });
      queryClient.invalidateQueries({ queryKey: ["opportunities-stats"] });
    },
  });
}

// Mutation para deletar opportunity
export function useDeleteContentOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("content_opportunities_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["content-opportunities-categories"],
      });
      queryClient.invalidateQueries({ queryKey: ["opportunities-stats"] });
    },
  });
}

// Hook para opportunities por keyword principal
export function useOpportunitiesByMainKeyword(mainKeywordId?: string) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["opportunities-by-keyword"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["opportunities-by-keyword", selectedBlog, mainKeywordId],
    queryFn: async () => {
      if (!mainKeywordId || mainKeywordId === "all") {
        return [];
      }

      let query = supabase
        .from("vw_content_opportunities_with_keywords")
        .select("*")
        .eq("main_keyword_id", mainKeywordId);

      if (selectedBlog && selectedBlog !== "all") {
        query = query.eq("blog_id", selectedBlog);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching opportunities by keyword:", error);
        throw error;
      }

      return (data || []) as ContentOpportunitiesCategories[];
    },
    enabled: !!mainKeywordId && mainKeywordId !== "all",
  });
}
