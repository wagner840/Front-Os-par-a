"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { KeywordRecommendation } from "@/lib/types/analytics";

const supabase = createClient();

export function useKeywordRecommendations(
  postId: string,
  similarityThreshold: number = 0.8,
  maxRecommendations: number = 10
) {
  return useQuery({
    queryKey: [
      "keyword-recommendations",
      postId,
      similarityThreshold,
      maxRecommendations,
    ],
    queryFn: async (): Promise<KeywordRecommendation[]> => {
      const { data, error } = await supabase.rpc(
        "recommend_keywords_for_post",
        {
          p_post_id: postId,
          similarity_threshold: similarityThreshold,
          max_recommendations: maxRecommendations,
        }
      );

      if (error) throw error;
      return data || [];
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
