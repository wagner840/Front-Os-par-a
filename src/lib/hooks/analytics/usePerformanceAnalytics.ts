"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/stores/app-store";
import type {
  AnalyticsFilters,
  PerformanceMetrics,
  SEOAnalytics,
  ContentAnalytics,
  KeywordAnalytics,
} from "@/lib/types/analytics";

const supabase = createClient();

export function useOverallPerformance(blogId: string) {
  return useQuery({
    queryKey: ["performance-analytics", blogId],
    queryFn: async () => {
      const [
        { data: keywordsData },
        { data: postsData },
        { data: embeddingsData },
        { data: duplicatesData },
      ] = await Promise.all([
        supabase.from("main_keywords").select("*").eq("blog_id", blogId),
        supabase.from("content_posts").select("*").eq("blog_id", blogId),
        supabase.rpc("check_embeddings_stats"),
        supabase.rpc("detect_semantic_duplicates", {
          table_name: "content_posts",
          similarity_threshold: 0.85,
        }),
      ]);

      return {
        keywords: keywordsData || [],
        posts: postsData || [],
        embeddings: embeddingsData || [],
        duplicates: duplicatesData || [],
      };
    },
    enabled: !!blogId,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePerformanceMetrics(filters?: AnalyticsFilters) {
  const { selectedBlog } = useAppStore();

  return useQuery({
    queryKey: ["performance-metrics", selectedBlog, filters],
    queryFn: async (): Promise<PerformanceMetrics> => {
      let postsQuery = supabase.from("content_posts").select("*");
      let keywordsQuery = supabase.from("main_keywords").select("*");

      if (selectedBlog) {
        postsQuery = postsQuery.eq("blog_id", selectedBlog);
        keywordsQuery = keywordsQuery.eq("blog_id", selectedBlog);
      }

      if (filters?.dateRange) {
        postsQuery = postsQuery
          .gte("created_at", filters.dateRange.start)
          .lte("created_at", filters.dateRange.end);
      }

      if (filters?.status && filters.status !== "all") {
        postsQuery = postsQuery.eq("status", filters.status);
      }

      const [postsResult, keywordsResult] = await Promise.all([
        postsQuery,
        keywordsQuery,
      ]);

      if (postsResult.error) throw postsResult.error;
      if (keywordsResult.error) throw keywordsResult.error;

      const posts = postsResult.data || [];
      const keywords = keywordsResult.data || [];

      const publishedPosts = posts.filter((p) => p.status === "published");
      const activeKeywords = keywords.filter((k) => k.status === "active");

      const totalPosts = posts.length;
      const avgSeoScore =
        posts.length > 0
          ? posts.reduce((sum, p) => sum + (p.seo_score || 0), 0) / posts.length
          : 0;
      const avgWordCount =
        posts.length > 0
          ? posts.reduce((sum, p) => sum + (p.word_count || 0), 0) /
            posts.length
          : 0;
      const avgReadingTime =
        posts.length > 0
          ? posts.reduce((sum, p) => sum + (p.reading_time || 0), 0) /
            posts.length
          : 0;
      const avgKeywordDifficulty =
        keywords.length > 0
          ? keywords.reduce((sum, k) => sum + (k.difficulty || 0), 0) /
            keywords.length
          : 0;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const recentPosts = posts.filter(
        (p) => new Date(p.created_at) > thirtyDaysAgo
      );
      const previousPosts = posts.filter(
        (p) =>
          new Date(p.created_at) > sixtyDaysAgo &&
          new Date(p.created_at) <= thirtyDaysAgo
      );

      const contentGrowthRate =
        previousPosts.length > 0
          ? ((recentPosts.length - previousPosts.length) /
              previousPosts.length) *
            100
          : recentPosts.length > 0
          ? 100
          : 0;

      const recentAvgSeo =
        recentPosts.length > 0
          ? recentPosts.reduce((sum, p) => sum + (p.seo_score || 0), 0) /
            recentPosts.length
          : 0;
      const previousAvgSeo =
        previousPosts.length > 0
          ? previousPosts.reduce((sum, p) => sum + (p.seo_score || 0), 0) /
            previousPosts.length
          : 0;

      const seoImprovementRate =
        previousAvgSeo > 0
          ? ((recentAvgSeo - previousAvgSeo) / previousAvgSeo) * 100
          : recentAvgSeo > 0
          ? 100
          : 0;

      return {
        totalPosts,
        publishedPosts: publishedPosts.length,
        avgSeoScore: Math.round(avgSeoScore),
        avgWordCount: Math.round(avgWordCount),
        avgReadingTime: Math.round(avgReadingTime),
        totalKeywords: keywords.length,
        activeKeywords: activeKeywords.length,
        avgKeywordDifficulty: Math.round(avgKeywordDifficulty),
        contentGrowthRate: Math.round(contentGrowthRate * 100) / 100,
        seoImprovementRate: Math.round(seoImprovementRate * 100) / 100,
      };
    },
    enabled: !!selectedBlog,
  });
}

// Outros hooks de performance serão adicionados aqui
