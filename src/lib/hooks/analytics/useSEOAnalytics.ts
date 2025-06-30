"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/stores/app-store";
import type { AnalyticsFilters, SEOAnalytics } from "@/lib/types/analytics";

const supabase = createClient();

export function useSEOAnalytics(filters?: AnalyticsFilters) {
  const { selectedBlog } = useAppStore();

  return useQuery({
    queryKey: ["seo-analytics", selectedBlog, filters],
    queryFn: async (): Promise<SEOAnalytics> => {
      let query = supabase.from("content_posts").select(`
          id,
          title,
          seo_score,
          word_count,
          published_at,
          main_keyword_id
        `);

      if (selectedBlog) {
        query = query.eq("blog_id", selectedBlog);
      }

      // Adicionar filtros de data se existirem
      if (filters?.dateRange) {
        query = query
          .gte("published_at", filters.dateRange.start)
          .lte("published_at", filters.dateRange.end);
      }

      const { data: posts, error } = await query;
      if (error) throw error;

      const postsData = posts || [];

      const scoreDistribution = {
        excellent: postsData.filter((p) => (p.seo_score || 0) >= 80).length,
        good: postsData.filter(
          (p) => (p.seo_score || 0) >= 60 && (p.seo_score || 0) < 80
        ).length,
        fair: postsData.filter(
          (p) => (p.seo_score || 0) >= 40 && (p.seo_score || 0) < 60
        ).length,
        poor: postsData.filter((p) => (p.seo_score || 0) < 40).length,
      };

      const topPerformingPosts = postsData
        .filter((p) => p.seo_score !== null)
        .sort((a, b) => (b.seo_score || 0) - (a.seo_score || 0))
        .slice(0, 10)
        .map((p) => ({
          id: p.id,
          title: p.title,
          seo_score: p.seo_score || 0,
          word_count: p.word_count || 0,
          published_at: p.published_at || "",
        }));

      const underPerformingPosts = postsData
        .filter((p) => (p.seo_score || 0) < 60)
        .sort((a, b) => (a.seo_score || 0) - (b.seo_score || 0))
        .slice(0, 10)
        .map((p) => ({
          id: p.id,
          title: p.title,
          seo_score: p.seo_score || 0,
          issues: [
            ...((p.seo_score || 0) < 40 ? ["SEO Score muito baixo"] : []),
            ...((p.word_count || 0) < 300 ? ["Conteúdo muito curto"] : []),
            ...(!p.main_keyword_id ? ["Sem keyword principal"] : []),
          ],
        }));

      return {
        scoreDistribution,
        topPerformingPosts,
        underPerformingPosts,
        keywordOpportunities: [], // Placeholder
      };
    },
    enabled: !!selectedBlog,
  });
}
