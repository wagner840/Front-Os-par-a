"use client";

import { GlassCard } from "@/components/ui/glass-card";
import type { SEOAnalytics } from "@/lib/hooks/use-analytics";
import { SeoCardHeader } from "./components/seo-analysis/SeoCardHeader";
import { ScoreDistribution } from "./components/seo-analysis/ScoreDistribution";
import { TopPerformingPosts } from "./components/seo-analysis/TopPerformingPosts";
import { UnderPerformingPosts } from "./components/seo-analysis/UnderPerformingPosts";
import { SeoActions } from "./components/seo-analysis/SeoActions";
import { SeoLoading } from "./components/seo-analysis/SeoLoading";
import { SeoEmpty } from "./components/seo-analysis/SeoEmpty";

interface SEOAnalysisCardProps {
  data?: SEOAnalytics;
  isLoading?: boolean;
}

export function SEOAnalysisCard({ data, isLoading }: SEOAnalysisCardProps) {
  if (isLoading) {
    return <SeoLoading />;
  }

  if (!data) {
    return <SeoEmpty />;
  }

  const totalPosts = Object.values(data.scoreDistribution).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <GlassCard className="p-6">
      <SeoCardHeader totalPosts={totalPosts} />
      <div className="space-y-6">
        <ScoreDistribution data={data.scoreDistribution} />
        <TopPerformingPosts posts={data.topPerformingPosts} />
        <UnderPerformingPosts posts={data.underPerformingPosts} />
        <SeoActions />
      </div>
    </GlassCard>
  );
}
