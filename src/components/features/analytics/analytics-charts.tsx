"use client";

import {
  KeywordsByDifficultyChart,
  PostsEvolutionChart,
  PostStatusChart,
  KeywordScatterPlot,
  MetricsSummary,
  AnalyticsChartsLoading,
} from "./components/analytics-charts";

interface AnalyticsChartsProps {
  performanceData?: {
    keywords: any[];
    posts: any[];
    embeddings: any[];
    duplicates: any[];
  };
  isLoading?: boolean;
}

export function AnalyticsCharts({
  performanceData,
  isLoading,
}: AnalyticsChartsProps) {
  if (isLoading || !performanceData) {
    return <AnalyticsChartsLoading />;
  }

  const { keywords, posts } = performanceData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeywordsByDifficultyChart keywords={keywords} />
        <PostsEvolutionChart posts={posts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PostStatusChart posts={posts} />
        <KeywordScatterPlot keywords={keywords} />
      </div>

      <MetricsSummary keywords={keywords} posts={posts} />
    </div>
  );
}
