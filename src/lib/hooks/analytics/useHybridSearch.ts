"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useHybridSearchPosts(
  searchQuery: string,
  queryEmbedding?: number[],
  blogIdFilter?: string,
  matchCount: number = 20
) {
  return useQuery({
    queryKey: [
      "hybrid-search-posts",
      searchQuery,
      queryEmbedding,
      blogIdFilter,
      matchCount,
    ],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("hybrid_search_posts", {
        search_query: searchQuery,
        query_embedding: queryEmbedding
          ? `[${queryEmbedding.join(",")}]`
          : null,
        blog_id_filter: blogIdFilter || null,
        match_count: matchCount,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!searchQuery,
    staleTime: 2 * 60 * 1000,
  });
}
