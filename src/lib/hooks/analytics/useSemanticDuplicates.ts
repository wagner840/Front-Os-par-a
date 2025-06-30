"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { SemanticDuplicate } from "@/lib/types/analytics";

const supabase = createClient();

export function useSemanticDuplicates(
  tableType: "keyword_variations" | "content_posts",
  similarityThreshold: number = 0.9
) {
  return useQuery({
    queryKey: ["semantic-duplicates", tableType, similarityThreshold],
    queryFn: async (): Promise<SemanticDuplicate[]> => {
      const { data, error } = await supabase.rpc("detect_semantic_duplicates", {
        table_name: tableType,
        similarity_threshold: similarityThreshold,
      });

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}
