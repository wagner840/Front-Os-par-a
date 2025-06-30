"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/stores/app-store";
import type { AnalyticsFilters, KeywordAnalytics } from "@/lib/types/analytics";

const supabase = createClient();

export function useKeywordAnalytics(filters?: AnalyticsFilters) {
  const { selectedBlog } = useAppStore();

  return useQuery({
    queryKey: ["keyword-analytics", selectedBlog, filters],
    queryFn: async (): Promise<KeywordAnalytics> => {
      let query = supabase.from("main_keywords").select(`
          *,
          content_posts ( id, seo_score )
        `);

      if (selectedBlog) {
        query = query.eq("blog_id", selectedBlog);
      }

      const { data: keywords, error } = await query;
      if (error) throw error;

      const keywordsData = keywords || [];

      const topKeywords = keywordsData
        .filter((k) => k.content_posts && (k.content_posts as any[]).length > 0)
        .map((k) => {
          const posts = (k.content_posts as any[]) || [];
          return {
            keyword: k.keyword,
            search_volume: k.search_volume || 0,
            difficulty: k.difficulty || 0,
            posts_count: posts.length,
            avg_seo_score:
              posts.length > 0
                ? Math.round(
                    posts.reduce((sum, p) => sum + (p.seo_score || 0), 0) /
                      posts.length
                  )
                : 0,
          };
        })
        .sort((a, b) => b.search_volume - a.search_volume)
        .slice(0, 10);

      const difficultyRanges = [
        { min: 0, max: 20, label: "Muito Fácil (0-20)" },
        { min: 21, max: 40, label: "Fácil (21-40)" },
        { min: 41, max: 60, label: "Médio (41-60)" },
        { min: 61, max: 80, label: "Difícil (61-80)" },
        { min: 81, max: 100, label: "Muito Difícil (81-100)" },
      ];

      const difficultyDistribution = difficultyRanges.map((range) => ({
        range: range.label,
        count: keywordsData.filter(
          (k) =>
            (k.difficulty || 0) >= range.min && (k.difficulty || 0) <= range.max
        ).length,
      }));

      const unusedKeywords = keywordsData
        .filter(
          (k) => !k.content_posts || (k.content_posts as any[]).length === 0
        )
        .map((k) => ({
          keyword: k.keyword,
          search_volume: k.search_volume || 0,
          difficulty: k.difficulty || 0,
          priority: k.priority || 0,
        }))
        .sort((a, b) => b.search_volume - a.search_volume)
        .slice(0, 20);

      const competitionMap = new Map<
        string,
        { count: number; total_cpc: number }
      >();
      keywordsData.forEach((k) => {
        const comp = k.competition || "N/A";
        const existing = competitionMap.get(comp) || { count: 0, total_cpc: 0 };
        competitionMap.set(comp, {
          count: existing.count + 1,
          total_cpc: existing.total_cpc + (k.cpc || 0),
        });
      });

      const competitionAnalysis = Array.from(competitionMap.entries()).map(
        ([competition, data]) => ({
          competition,
          count: data.count,
          avg_cpc: data.count > 0 ? data.total_cpc / data.count : 0,
        })
      );

      return {
        topKeywords,
        difficultyDistribution,
        unusedKeywords,
        competitionAnalysis,
      };
    },
    enabled: !!selectedBlog,
  });
}
