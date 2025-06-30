"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/stores/app-store";
import type { AnalyticsFilters, ContentAnalytics } from "@/lib/types/analytics";

const supabase = createClient();

export function useContentAnalytics(filters?: AnalyticsFilters) {
  const { selectedBlog } = useAppStore();

  return useQuery({
    queryKey: ["content-analytics", selectedBlog, filters],
    queryFn: async (): Promise<ContentAnalytics> => {
      let query = supabase.from("content_posts").select(`
          *,
          authors ( name )
        `);

      if (selectedBlog) {
        query = query.eq("blog_id", selectedBlog);
      }

      if (filters?.dateRange) {
        query = query
          .gte("created_at", filters.dateRange.start)
          .lte("created_at", filters.dateRange.end);
      }

      const { data: posts, error } = await query;
      if (error) throw error;

      const postsData = posts || [];

      // Performance por categoria
      const categoryMap = new Map<
        string,
        {
          posts_count: number;
          total_seo_score: number;
          total_word_count: number;
        }
      >();

      postsData.forEach((post) => {
        const categories = (post.categories as string[]) || ["Sem categoria"];
        categories.forEach((category) => {
          const existing = categoryMap.get(category) || {
            posts_count: 0,
            total_seo_score: 0,
            total_word_count: 0,
          };

          categoryMap.set(category, {
            posts_count: existing.posts_count + 1,
            total_seo_score: existing.total_seo_score + (post.seo_score || 0),
            total_word_count:
              existing.total_word_count + (post.word_count || 0),
          });
        });
      });

      const categoryPerformance = Array.from(categoryMap.entries()).map(
        ([category, data]) => ({
          category,
          posts_count: data.posts_count,
          avg_seo_score:
            Math.round(data.total_seo_score / data.posts_count) || 0,
          avg_word_count:
            Math.round(data.total_word_count / data.posts_count) || 0,
        })
      );

      // Performance por autor
      const authorMap = new Map<
        string,
        {
          posts_count: number;
          total_seo_score: number;
          total_word_count: number;
        }
      >();

      postsData.forEach((post) => {
        const authorName = (post.authors as any)?.name || "Autor desconhecido";
        const existing = authorMap.get(authorName) || {
          posts_count: 0,
          total_seo_score: 0,
          total_word_count: 0,
        };

        authorMap.set(authorName, {
          posts_count: existing.posts_count + 1,
          total_seo_score: existing.total_seo_score + (post.seo_score || 0),
          total_word_count: existing.total_word_count + (post.word_count || 0),
        });
      });

      const authorPerformance = Array.from(authorMap.entries()).map(
        ([author_name, data]) => ({
          author_name,
          posts_count: data.posts_count,
          avg_seo_score:
            Math.round(data.total_seo_score / data.posts_count) || 0,
          total_word_count: data.total_word_count,
        })
      );

      // Tendências de publicação
      const dateMap = new Map<
        string,
        { posts_count: number; total_seo_score: number }
      >();

      postsData.forEach((post) => {
        if (!post.published_at) return;
        const date = new Date(post.published_at).toISOString().split("T")[0];
        const existing = dateMap.get(date) || {
          posts_count: 0,
          total_seo_score: 0,
        };
        dateMap.set(date, {
          posts_count: existing.posts_count + 1,
          total_seo_score: existing.total_seo_score + (post.seo_score || 0),
        });
      });

      const publishingTrends = Array.from(dateMap.entries())
        .map(([date, data]) => ({
          date,
          posts_count: data.posts_count,
          avg_seo_score:
            Math.round(data.total_seo_score / data.posts_count) || 0,
        }))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      // Distribuição de contagem de palavras
      const wordCountRanges = [
        { range: "0-300", min: 0, max: 300 },
        { range: "301-700", min: 301, max: 700 },
        { range: "701-1200", min: 701, max: 1200 },
        { range: "1201+", min: 1201, max: Infinity },
      ];

      const wordCountDistribution = wordCountRanges.map((range) => ({
        range: range.range,
        count: postsData.filter(
          (p) =>
            (p.word_count || 0) >= range.min && (p.word_count || 0) <= range.max
        ).length,
      }));

      return {
        categoryPerformance,
        authorPerformance,
        publishingTrends,
        wordCountDistribution,
      };
    },
    enabled: !!selectedBlog,
  });
}
