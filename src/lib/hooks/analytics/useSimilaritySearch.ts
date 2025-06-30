"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { SimilarItem } from "@/lib/types/analytics";

const supabase = createClient();

export function useSimilarPosts(
  queryEmbedding: number[],
  matchThreshold: number = 0.8,
  matchCount: number = 10
) {
  return useQuery({
    queryKey: ["similar-posts", queryEmbedding, matchThreshold, matchCount],
    queryFn: async (): Promise<SimilarItem[]> => {
      const { data, error } = await supabase.rpc("find_similar_posts", {
        query_embedding: `[${queryEmbedding.join(",")}]`,
        match_threshold: matchThreshold,
        match_count: matchCount,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: queryEmbedding.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSimilarKeywords(
  queryEmbedding: number[],
  matchThreshold: number = 0.8,
  matchCount: number = 10
) {
  return useQuery({
    queryKey: ["similar-keywords", queryEmbedding, matchThreshold, matchCount],
    queryFn: async (): Promise<SimilarItem[]> => {
      const { data, error } = await supabase.rpc("find_similar_keywords", {
        query_embedding: `[${queryEmbedding.join(",")}]`,
        match_threshold: matchThreshold,
        match_count: matchCount,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: queryEmbedding.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
