"use client";

import { GlassCard } from "@/components/ui/glass-card";
import type { ContentAnalytics } from "@/lib/hooks/use-analytics";
import { AnalysisCardHeader } from "./components/content-analysis/AnalysisCardHeader";
import { CategoryPerformance } from "./components/content-analysis/CategoryPerformance";
import { AuthorPerformance } from "./components/content-analysis/AuthorPerformance";
import { PublishingTrends } from "./components/content-analysis/PublishingTrends";
import { AnalysisInsights } from "./components/content-analysis/AnalysisInsights";
import { AnalysisActions } from "./components/content-analysis/AnalysisActions";
import { AnalysisLoading } from "./components/content-analysis/AnalysisLoading";
import { AnalysisEmpty } from "./components/content-analysis/AnalysisEmpty";

interface ContentAnalysisCardProps {
  data?: ContentAnalytics;
  isLoading?: boolean;
}

export function ContentAnalysisCard({
  data,
  isLoading,
}: ContentAnalysisCardProps) {
  if (isLoading) {
    return <AnalysisLoading />;
  }

  if (!data) {
    return <AnalysisEmpty />;
  }

  return (
    <GlassCard className="p-6">
      <AnalysisCardHeader />
      <div className="space-y-6">
        <CategoryPerformance categories={data.categoryPerformance} />
        <AuthorPerformance authors={data.authorPerformance} />
        <PublishingTrends trends={data.publishingTrends} />
        <AnalysisInsights
          categoryPerformance={data.categoryPerformance}
          authorPerformance={data.authorPerformance}
          publishingTrends={data.publishingTrends}
        />
        <AnalysisActions />
      </div>
    </GlassCard>
  );
}
