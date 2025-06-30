"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/stores/app-store";
import { useEffect } from "react";

const supabase = createClient();

interface AnalyticsFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  blogId?: string;
  status?: "draft" | "published" | "scheduled" | "archived" | "all";
}

// Hook reativo para análises e relatórios
export function useAnalyticsData(filters: AnalyticsFilters = {}) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["analytics-data"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["analytics-data", selectedBlog, filters],
    queryFn: async () => {
      const currentBlogId = filters.blogId || selectedBlog;

      if (!currentBlogId || currentBlogId === "all") {
        return {
          posts: [],
          keywords: [],
          categories: [],
          authors: [],
          stats: {
            totalPosts: 0,
            publishedPosts: 0,
            avgSeoScore: 0,
            avgWordCount: 0,
          },
        };
      }

      // Buscar dados de posts
      let postsQuery = supabase
        .from("content_posts")
        .select(
          `
          id,
          title,
          slug,
          status,
          seo_score,
          word_count,
          reading_time,
          published_at,
          created_at,
          main_keyword_id,
          category_id,
          author_id,
          authors(name),
          keyword_categories(name)
        `
        )
        .eq("blog_id", currentBlogId);

      // Buscar keywords
      let keywordsQuery = supabase
        .from("main_keywords")
        .select("*")
        .eq("blog_id", currentBlogId);

      // Aplicar filtros
      if (filters.status && filters.status !== "all") {
        postsQuery = postsQuery.eq("status", filters.status);
      }

      if (filters.dateRange) {
        postsQuery = postsQuery
          .gte("created_at", filters.dateRange.start)
          .lte("created_at", filters.dateRange.end);
      }

      const [postsResult, keywordsResult] = await Promise.all([
        postsQuery,
        keywordsQuery,
      ]);

      if (postsResult.error) {
        console.error("Error fetching posts:", postsResult.error);
        throw postsResult.error;
      }

      if (keywordsResult.error) {
        console.error("Error fetching keywords:", keywordsResult.error);
        throw keywordsResult.error;
      }

      const posts = postsResult.data || [];
      const keywords = keywordsResult.data || [];

      // Calcular estatísticas
      const publishedPosts = posts.filter((p) => p.status === "published");
      const totalPosts = posts.length;
      const avgSeoScore =
        posts.length > 0
          ? Math.round(
              posts.reduce((sum, p) => sum + (p.seo_score || 0), 0) /
                posts.length
            )
          : 0;
      const avgWordCount =
        posts.length > 0
          ? Math.round(
              posts.reduce((sum, p) => sum + (p.word_count || 0), 0) /
                posts.length
            )
          : 0;

      // Agrupar por categoria
      const categoryStats = posts.reduce((acc, post) => {
        const categoryName =
          (post.keyword_categories as any)?.name || "Sem categoria";
        if (!acc[categoryName]) {
          acc[categoryName] = {
            name: categoryName,
            count: 0,
            avgSeoScore: 0,
            totalSeoScore: 0,
          };
        }
        acc[categoryName].count++;
        acc[categoryName].totalSeoScore += post.seo_score || 0;
        acc[categoryName].avgSeoScore = Math.round(
          acc[categoryName].totalSeoScore / acc[categoryName].count
        );
        return acc;
      }, {} as Record<string, any>);

      // Agrupar por autor
      const authorStats = posts.reduce((acc, post) => {
        const authorName = (post.authors as any)?.name || "Sem autor";
        if (!acc[authorName]) {
          acc[authorName] = {
            name: authorName,
            count: 0,
            avgSeoScore: 0,
            totalSeoScore: 0,
            totalWordCount: 0,
          };
        }
        acc[authorName].count++;
        acc[authorName].totalSeoScore += post.seo_score || 0;
        acc[authorName].totalWordCount += post.word_count || 0;
        acc[authorName].avgSeoScore = Math.round(
          acc[authorName].totalSeoScore / acc[authorName].count
        );
        return acc;
      }, {} as Record<string, any>);

      // Distribuição de SEO Score
      const seoDistribution = {
        excellent: posts.filter((p) => (p.seo_score || 0) >= 80).length,
        good: posts.filter(
          (p) => (p.seo_score || 0) >= 60 && (p.seo_score || 0) < 80
        ).length,
        fair: posts.filter(
          (p) => (p.seo_score || 0) >= 40 && (p.seo_score || 0) < 60
        ).length,
        poor: posts.filter((p) => (p.seo_score || 0) < 40).length,
      };

      // Top performing posts
      const topPosts = posts
        .filter((p) => p.seo_score !== null)
        .sort((a, b) => (b.seo_score || 0) - (a.seo_score || 0))
        .slice(0, 10);

      // Posts que precisam de melhoria
      const improvementPosts = posts
        .filter((p) => (p.seo_score || 0) < 60)
        .sort((a, b) => (a.seo_score || 0) - (b.seo_score || 0))
        .slice(0, 10);

      return {
        posts,
        keywords,
        categories: Object.values(categoryStats),
        authors: Object.values(authorStats),
        stats: {
          totalPosts,
          publishedPosts: publishedPosts.length,
          avgSeoScore,
          avgWordCount,
          totalKeywords: keywords.length,
          activeKeywords: keywords.filter((k) => k.is_used).length,
        },
        seoDistribution,
        topPosts,
        improvementPosts,
      };
    },
    enabled: !!selectedBlog,
  });
}
