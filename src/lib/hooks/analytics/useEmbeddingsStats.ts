"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { EmbeddingStats } from "@/lib/types/analytics";

const supabase = createClient();

export function useEmbeddingsStats() {
  return useQuery({
    queryKey: ["embeddings-stats"],
    queryFn: async (): Promise<EmbeddingStats[]> => {
      const { data, error } = await supabase.rpc("check_embeddings_stats");

      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}
