"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { ContentGap } from "@/lib/types/analytics";

const supabase = createClient();

export function useContentGaps(blogId: string, gapThreshold: number = 0.7) {
  return useQuery({
    queryKey: ["content-gaps", blogId, gapThreshold],
    queryFn: async (): Promise<ContentGap[]> => {
      const { data, error } = await supabase.rpc("analyze_content_gaps", {
        p_blog_id: blogId,
        gap_threshold: gapThreshold,
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
