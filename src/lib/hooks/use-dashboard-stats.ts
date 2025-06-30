"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/stores/app-store";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalKeywords: number;
  unusedKeywords: number;
  avgSeoScore: number;
  totalViews: number;
  conversionRate: number;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
  color: string;
}

export function useDashboardStats(blogId?: string) {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats", blogId],
    queryFn: async () => {
      // Simulated data - replace with real API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        totalPosts: 156,
        publishedPosts: 142,
        draftPosts: 14,
        totalKeywords: 739,
        unusedKeywords: 22,
        avgSeoScore: 87,
        totalViews: 245680,
        conversionRate: 3.2,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useQuickActions(): QuickAction[] {
  const { selectedBlog } = useAppStore();

  return [
    {
      id: "new-post",
      label: "Novo Post",
      description: "Criar um novo post",
      icon: "plus",
      action: () => {
        // Navigate to new post
      },
      color: "blue",
    },
    {
      id: "analyze-keywords",
      label: "Analisar Keywords",
      description: "Executar análise de keywords",
      icon: "search",
      action: () => {
        // Navigate to keyword analysis
      },
      color: "green",
    },
    {
      id: "seo-audit",
      label: "Auditoria SEO",
      description: "Executar auditoria completa",
      icon: "shield",
      action: () => {
        // Navigate to SEO audit
      },
      color: "purple",
    },
    {
      id: "export-data",
      label: "Exportar Dados",
      description: "Baixar relatório completo",
      icon: "download",
      action: () => {
        // Export data
      },
      color: "orange",
    },
  ];
}
