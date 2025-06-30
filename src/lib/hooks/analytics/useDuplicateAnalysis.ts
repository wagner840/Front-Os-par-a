"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { DuplicateAnalysis } from "@/lib/types/analytics";

const supabase = createClient();

export function useDuplicateAnalysis() {
  return useQuery({
    queryKey: ["duplicate-analysis"],
    queryFn: async (): Promise<DuplicateAnalysis> => {
      const { data: duplicateKeywords, error: keywordError } =
        await supabase.rpc("analyze_keyword_duplicates");

      if (keywordError) throw keywordError;

      const { data: posts, error: postsError } = await supabase
        .from("content_posts")
        .select("id, title")
        .eq("status", "published");

      if (postsError) throw postsError;

      const similarPosts: Array<{
        post1: { id: string; title: string };
        post2: { id: string; title: string };
        similarity: number;
      }> = [];

      for (let i = 0; i < (posts || []).length; i++) {
        for (let j = i + 1; j < (posts || []).length; j++) {
          const post1 = posts![i];
          const post2 = posts![j];

          const words1 = post1.title
            .toLowerCase()
            .split(" ")
            .filter((w) => w.length > 3);
          const words2 = post2.title
            .toLowerCase()
            .split(" ")
            .filter((w) => w.length > 3);
          const commonWords = words1.filter((w) => words2.includes(w));
          const similarity =
            commonWords.length / Math.max(words1.length, words2.length, 1);

          if (similarity > 0.5) {
            similarPosts.push({
              post1: { id: post1.id, title: post1.title },
              post2: { id: post2.id, title: post2.title },
              similarity: Math.round(similarity * 100) / 100,
            });
          }
        }
      }

      return {
        duplicateKeywords: duplicateKeywords || [],
        similarPosts: similarPosts.slice(0, 10),
      };
    },
  });
}
