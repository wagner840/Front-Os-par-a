"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/stores/app-store";
import {
  useContentOpportunitiesCategories,
  useContentOpportunitiesClusters,
  useOpportunitiesByMainKeyword,
} from "@/lib/hooks/use-content-opportunities";
import { useSemanticSearch } from "@/lib/hooks/use-semantic-search";
import { useMainKeywords } from "@/lib/hooks/use-keywords";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface OpportunityFilters {
  blogId?: string;
  status?: string;
  categoryId?: string;
  assignedTo?: string;
  priority?: "high" | "medium" | "low";
  dateRange?: {
    start: string;
    end: string;
  };
}

export function useOpportunityStats(filters: OpportunityFilters = {}) {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  // Invalidar cache quando o blog muda
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["opportunities-stats"],
    });
  }, [selectedBlog, queryClient]);

  return useQuery({
    queryKey: ["opportunities-stats", selectedBlog, filters],
    queryFn: async () => {
      const currentBlogId = filters.blogId || selectedBlog;

      if (!currentBlogId || currentBlogId === "all") {
        return {
          total: 0,
          byStatus: {},
          byPriority: {},
          withKeywords: 0,
          avgScore: 0,
        };
      }

      let query = supabase
        .from("vw_content_opportunities_with_keywords")
        .select("*")
        .eq("blog_id", currentBlogId);

      if (filters.dateRange) {
        query = query
          .gte("created_at", filters.dateRange.start)
          .lte("created_at", filters.dateRange.end);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching opportunities stats:", error);
        throw error;
      }

      const opportunities = data || [];

      // Calcular estatísticas
      const byStatus = opportunities.reduce((acc, opp) => {
        acc[opp.status] = (acc[opp.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byPriority = opportunities.reduce((acc, opp) => {
        const score = opp.calculated_opportunity_score || 0;
        const priority = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const withKeywords = opportunities.filter(
        (opp) => opp.main_keyword_id
      ).length;

      const avgScore =
        opportunities.length > 0
          ? opportunities.reduce(
              (sum, opp) => sum + (opp.calculated_opportunity_score || 0),
              0
            ) / opportunities.length
          : 0;

      return {
        total: opportunities.length,
        byStatus,
        byPriority,
        withKeywords,
        avgScore: Math.round(avgScore * 100) / 100,
      };
    },
    enabled: !!selectedBlog,
  });
}

export function useContentOpportunitiesDashboard(blogId?: string) {
  const { selectedBlog } = useAppStore();
  const currentBlogId = blogId || selectedBlog;

  // States
  const [activeTab, setActiveTab] = useState<"categories" | "clusters">(
    "categories"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [semanticSearch, setSemanticSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedMainKeyword, setSelectedMainKeyword] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("priority_score");
  const [showSemanticResults, setShowSemanticResults] = useState(false);

  // Queries
  const { data: stats } = useOpportunityStats(currentBlogId || undefined);
  const { data: mainKeywords } = useMainKeywords({
    blogId: currentBlogId || undefined,
  });

  const opportunityFilters = {
    blogId: currentBlogId || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchTerm,
    sortBy: sortBy as any,
    sortOrder: "desc" as const,
  };

  const { data: categoriesOpportunities, isLoading: loadingCategories } =
    useContentOpportunitiesCategories(opportunityFilters);

  const { data: clustersOpportunities, isLoading: loadingClusters } =
    useContentOpportunitiesClusters(opportunityFilters);

  const { data: keywordOpportunities } = useOpportunitiesByMainKeyword(
    selectedMainKeyword || undefined
  );

  const { data: semanticResults, isLoading: semanticLoading } =
    useSemanticSearch(semanticSearch, {
      blogId: currentBlogId || undefined,
      includeOpportunities: true,
      includePosts: false,
      includeKeywords: false,
      includeClusters: false,
      threshold: 0.7,
      limit: 10,
    });

  const handleSemanticSearch = () => {
    if (semanticSearch.trim()) {
      setShowSemanticResults(true);
      toast.info(`Buscando conteúdo similar a: "${semanticSearch}"`);
    }
  };

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    semanticSearch,
    setSemanticSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    selectedMainKeyword,
    setSelectedMainKeyword,
    sortBy,
    setSortBy,
    showSemanticResults,
    setShowSemanticResults,
    stats,
    mainKeywords,
    categoriesOpportunities,
    loadingCategories,
    clustersOpportunities,
    loadingClusters,
    keywordOpportunities,
    semanticResults,
    semanticLoading,
    handleSemanticSearch,
  };
}