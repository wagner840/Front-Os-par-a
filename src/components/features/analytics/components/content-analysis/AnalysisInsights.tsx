"use client";

interface Category {
  category: string;
  avg_seo_score: number;
}

interface Author {
  author_name: string;
  posts_count: number;
}

interface Trend {
  posts_count: number;
}

interface AnalysisInsightsProps {
  categoryPerformance: Category[];
  authorPerformance: Author[];
  publishingTrends: Trend[];
}

export function AnalysisInsights({
  categoryPerformance,
  authorPerformance,
  publishingTrends,
}: AnalysisInsightsProps) {
  const bestCategory = categoryPerformance?.[0];
  const mostProductiveAuthor = authorPerformance?.[0];
  const recentPostsCount = publishingTrends?.reduce(
    (sum, t) => sum + t.posts_count,
    0
  );

  return (
    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
      <h5 className="font-medium text-sm mb-2">Insights</h5>
      <div className="space-y-1 text-xs text-muted-foreground">
        {bestCategory && (
          <div>
            • Categoria com melhor performance: {bestCategory.category} (SEO:{" "}
            {bestCategory.avg_seo_score})
          </div>
        )}
        {mostProductiveAuthor && (
          <div>
            • Autor mais produtivo: {mostProductiveAuthor.author_name} (
            {mostProductiveAuthor.posts_count} posts)
          </div>
        )}
        {publishingTrends.length > 0 && (
          <div>• Total de posts recentes: {recentPostsCount}</div>
        )}
      </div>
    </div>
  );
}
