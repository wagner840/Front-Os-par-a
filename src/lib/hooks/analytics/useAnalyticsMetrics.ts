"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/stores/app-store";
import type { AnalyticsFilters, AnalyticsMetric } from "@/lib/types/analytics";

const supabase = createClient();

export function useAnalyticsMetrics(filters: AnalyticsFilters = {}) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["analytics-metrics"] });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["analytics-metrics", selectedBlog, filters],
    queryFn: async () => {
      let query = supabase.from("analytics_metrics").select(`
          *,
          blog:blogs(name),
          post:content_posts(title, slug)
        `);

      const currentBlogId = filters.blogId || selectedBlog;
      if (currentBlogId && currentBlogId !== "all") {
        query = query.eq("blog_id", currentBlogId);
      }
      if (filters.postId && filters.postId !== "all") {
        query = query.eq("post_id", filters.postId);
      }
      if (filters.metricType && filters.metricType !== "all") {
        query = query.eq("metric_type", filters.metricType);
      }
      if (filters.startDate) {
        query = query.gte("metric_date", filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte("metric_date", filters.endDate);
      }

      query = query.order("metric_date", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedBlog,
  });
}

export function useAnalyticsStats(filters: AnalyticsFilters = {}) {
  const { selectedBlog } = useAppStore();

  return useQuery({
    queryKey: ["analytics-stats", selectedBlog, filters],
    queryFn: async () => {
      // Lógica de cálculo...
    },
    enabled: !!selectedBlog,
  });
}

// ... outros hooks relacionados ...

export function useCreateAnalyticsMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metric: Omit<AnalyticsMetric, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("analytics_metrics")
        .insert(metric)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-stats"] });
    },
  });
}

export function useBulkCreateAnalyticsMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      metrics: Omit<AnalyticsMetric, "id" | "created_at">[]
    ) => {
      const { data, error } = await supabase
        .from("analytics_metrics")
        .insert(metrics)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-stats"] });
    },
  });
}
