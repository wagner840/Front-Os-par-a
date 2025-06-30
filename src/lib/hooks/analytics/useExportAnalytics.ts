"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useExportAnalytics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (format: "csv" | "json") => {
      const performanceData = queryClient.getQueryData(["performance-metrics"]);
      const seoData = queryClient.getQueryData(["seo-analytics"]);
      const contentData = queryClient.getQueryData(["content-analytics"]);
      const keywordData = queryClient.getQueryData(["keyword-analytics"]);

      const exportData = {
        performance: performanceData,
        seo: seoData,
        content: contentData,
        keywords: keywordData,
        exportedAt: new Date().toISOString(),
      };

      if (format === "json") {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === "csv") {
        // Exemplo simplificado de CSV
        const csvData = [
          ["Métrica", "Valor"],
          ["Total de Posts", (performanceData as any)?.totalPosts || 0],
          ["Posts Publicados", (performanceData as any)?.publishedPosts || 0],
          ["SEO Score Médio", (performanceData as any)?.avgSeoScore || 0],
        ];

        const csvContent = csvData.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      return { success: true, format };
    },
  });
}
