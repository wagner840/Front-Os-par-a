"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface SemanticSearchFilters {
  blogId?: string;
  threshold?: number;
  limit?: number;
  includeKeywords?: boolean;
  includePosts?: boolean;
  includeClusters?: boolean;
  includeOpportunities?: boolean;
}

interface SemanticSearchResult {
  type: "keyword" | "post" | "cluster" | "opportunity";
  id: string;
  title: string;
  description?: string;
  similarity: number;
  metadata: Record<string, any>;
}

// Hook para busca semântica híbrida
export function useSemanticSearch(
  query: string,
  filters: SemanticSearchFilters = {}
) {
  return useQuery({
    queryKey: ["semantic-search", query, filters],
    queryFn: async (): Promise<SemanticSearchResult[]> => {
      if (!query.trim()) return [];

      const {
        blogId,
        threshold = 0.7,
        limit = 20,
        includeKeywords = true,
        includePosts = true,
        includeClusters = true,
        includeOpportunities = true,
      } = filters;

      const results: SemanticSearchResult[] = [];

      try {
        // Busca híbrida usando a função do banco
        const { data: hybridResults, error: hybridError } = await supabase.rpc(
          "hybrid_search_posts",
          {
            search_query: query,
            query_embedding: null, // Será gerado pela função
            blog_id_filter: blogId || null,
            match_count: limit,
          }
        );

        if (!hybridError && hybridResults) {
          results.push(
            ...hybridResults.map((result: any) => ({
              type: "post" as const,
              id: result.id,
              title: result.title,
              description: result.excerpt,
              similarity: result.similarity || 0.8,
              metadata: {
                author: result.author_name,
                status: result.status,
                seo_score: result.seo_score,
                word_count: result.word_count,
                published_at: result.published_at,
              },
            }))
          );
        }

        // Busca keywords similares se habilitado
        if (includeKeywords) {
          const { data: keywordResults, error: keywordError } =
            await supabase.rpc("find_similar_keywords", {
              query_text: query,
              match_threshold: threshold,
              match_count: Math.min(limit, 10),
            });

          if (!keywordError && keywordResults) {
            results.push(
              ...keywordResults.map((result: any) => ({
                type: "keyword" as const,
                id: result.id,
                title: result.keyword,
                description: `MSV: ${result.msv || 0} | Difficulty: ${
                  result.difficulty || 0
                }`,
                similarity: result.similarity || 0.8,
                metadata: {
                  msv: result.msv,
                  difficulty: result.difficulty,
                  competition: result.competition,
                  is_used: result.is_used,
                },
              }))
            );
          }
        }

        // Busca clusters se habilitado
        if (includeClusters) {
          const { data: clusterResults, error: clusterError } = await supabase
            .from("keyword_clusters")
            .select("*")
            .textSearch("cluster_name", query)
            .limit(5);

          if (!clusterError && clusterResults) {
            results.push(
              ...clusterResults.map((result: any) => ({
                type: "cluster" as const,
                id: result.id,
                title: result.cluster_name,
                description: result.description,
                similarity: 0.7, // Fallback para busca textual
                metadata: {
                  cluster_score: result.cluster_score,
                  main_keyword_id: result.main_keyword_id,
                },
              }))
            );
          }
        }

        // Fallback para busca textual simples se não há resultados
        if (results.length === 0) {
          const fallbackResults = await performFallbackSearch(query, filters);
          results.push(...fallbackResults);
        }
      } catch (error) {
        console.warn("Semantic search failed, using fallback", error);

        // Fallback para busca textual
        const fallbackResults = await performFallbackSearch(query, filters);
        results.push(...fallbackResults);
      }

      // Ordenar por similaridade e aplicar limite
      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
}

// Função de fallback para busca textual
async function performFallbackSearch(
  query: string,
  filters: SemanticSearchFilters
): Promise<SemanticSearchResult[]> {
  const results: SemanticSearchResult[] = [];
  const { blogId, limit = 20 } = filters;

  // Busca em posts
  const { data: posts } = await supabase
    .from("content_posts")
    .select("*, authors(name)")
    .or(
      `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`
    )
    .eq(blogId ? "blog_id" : "id", blogId || "any")
    .limit(Math.min(limit, 10));

  if (posts) {
    results.push(
      ...posts.map((post: any) => ({
        type: "post" as const,
        id: post.id,
        title: post.title,
        description: post.excerpt,
        similarity: 0.6, // Similaridade baseada em texto
        metadata: {
          author: post.authors?.name,
          status: post.status,
          seo_score: post.seo_score,
        },
      }))
    );
  }

  // Busca em keywords
  const { data: keywords } = await supabase
    .from("main_keywords")
    .select("*")
    .ilike("keyword", `%${query}%`)
    .eq(blogId ? "blog_id" : "id", blogId || "any")
    .limit(5);

  if (keywords) {
    results.push(
      ...keywords.map((keyword: any) => ({
        type: "keyword" as const,
        id: keyword.id,
        title: keyword.keyword,
        description: `Volume: ${keyword.search_volume || 0}`,
        similarity: 0.6,
        metadata: {
          search_volume: keyword.search_volume,
          difficulty: keyword.difficulty,
        },
      }))
    );
  }

  return results;
}

// Hook para busca por similaridade de embedding
export function useEmbeddingSimilarity(
  referenceId: string,
  referenceType: "post" | "keyword" | "cluster",
  threshold: number = 0.8,
  limit: number = 10
) {
  return useQuery({
    queryKey: [
      "embedding-similarity",
      referenceId,
      referenceType,
      threshold,
      limit,
    ],
    queryFn: async () => {
      if (!referenceId) return [];

      try {
        let functionName: string;
        let params: Record<string, any> = {
          match_threshold: threshold,
          match_count: limit,
        };

        switch (referenceType) {
          case "post":
            functionName = "find_similar_posts";
            params.query_post_id = referenceId;
            break;
          case "keyword":
            functionName = "find_similar_keywords";
            params.query_keyword_id = referenceId;
            break;
          case "cluster":
            functionName = "find_similar_clusters";
            params.query_cluster_id = referenceId;
            break;
          default:
            return [];
        }

        const { data, error } = await supabase.rpc(functionName, params);

        if (error) {
          console.warn(`Similarity search failed for ${referenceType}:`, error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Embedding similarity search failed:", error);
        return [];
      }
    },
    enabled: !!referenceId,
  });
}

// Hook para análise de gaps de conteúdo
export function useContentGapAnalysis(blogId: string, threshold: number = 0.7) {
  return useQuery({
    queryKey: ["content-gap-analysis", blogId, threshold],
    queryFn: async () => {
      if (!blogId) return null;

      try {
        const { data, error } = await supabase.rpc("analyze_content_gaps", {
          p_blog_id: blogId,
          gap_threshold: threshold,
        });

        if (error) {
          console.warn("Content gap analysis failed:", error);
          return null;
        }

        return data;
      } catch (error) {
        console.error("Content gap analysis error:", error);
        return null;
      }
    },
    enabled: !!blogId,
    staleTime: 1000 * 60 * 10, // Cache por 10 minutos
  });
}

// Hook para recomendações de keywords para um post
export function useKeywordRecommendations(
  postId: string,
  threshold: number = 0.8,
  maxRecommendations: number = 10
) {
  return useQuery({
    queryKey: [
      "keyword-recommendations",
      postId,
      threshold,
      maxRecommendations,
    ],
    queryFn: async () => {
      if (!postId) return [];

      try {
        const { data, error } = await supabase.rpc(
          "recommend_keywords_for_post",
          {
            p_post_id: postId,
            similarity_threshold: threshold,
            max_recommendations: maxRecommendations,
          }
        );

        if (error) {
          console.warn("Keyword recommendations failed:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Keyword recommendations error:", error);
        return [];
      }
    },
    enabled: !!postId,
  });
}

// Hook para detectar duplicatas semânticas
export function useSemanticDuplicates(
  table: "keyword_variations" | "content_posts",
  threshold: number = 0.95
) {
  return useQuery({
    queryKey: ["semantic-duplicates", table, threshold],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc(
          "detect_semantic_duplicates",
          {
            table_name: table,
            similarity_threshold: threshold,
          }
        );

        if (error) {
          console.warn("Semantic duplicates detection failed:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Semantic duplicates detection error:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 15, // Cache por 15 minutos
  });
}

// Mutation para gerar embedding
export function useGenerateEmbedding() {
  return useMutation({
    mutationFn: async (data: {
      text: string;
      table: string;
      recordId: string;
    }) => {
      // Em produção, isso seria feito via edge function ou API route
      // Por ora, simular o processo

      try {
        const { data: result, error } = await supabase.rpc(
          "generate_embedding",
          {
            input_text: data.text,
            target_table: data.table,
            target_id: data.recordId,
          }
        );

        if (error) throw error;
        return result;
      } catch (error) {
        console.error("Embedding generation failed:", error);
        throw error;
      }
    },
  });
}
