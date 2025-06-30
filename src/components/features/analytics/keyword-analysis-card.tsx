"use client";

import { Target, TrendingUp, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { KeywordAnalytics } from "@/lib/hooks/use-analytics";

interface KeywordAnalysisCardProps {
  data?: KeywordAnalytics;
  isLoading?: boolean;
}

export function KeywordAnalysisCard({
  data,
  isLoading,
}: KeywordAnalysisCardProps) {
  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </GlassCard>
    );
  }

  if (!data) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-muted-foreground">
          Dados de keywords não disponíveis
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Análise de Keywords
          </h3>
          <p className="text-sm text-muted-foreground">
            Performance e oportunidades de keywords
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Keywords */}
        <div>
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Keywords
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.topKeywords.slice(0, 5).map((keyword) => (
              <div
                key={keyword.keyword}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {keyword.keyword}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Volume: {keyword.search_volume.toLocaleString()} •{" "}
                    {keyword.posts_count} posts
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Badge
                    variant={
                      keyword.difficulty <= 30
                        ? "default"
                        : keyword.difficulty <= 60
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    Dif: {keyword.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    SEO: {keyword.avg_seo_score}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuição de Dificuldade */}
        <div>
          <h4 className="font-medium mb-4">Distribuição de Dificuldade</h4>
          <div className="space-y-2">
            {data.difficultyDistribution.map((range) => (
              <div
                key={range.range}
                className="flex items-center justify-between p-2 rounded-lg bg-background/30"
              >
                <span className="text-sm">{range.range}</span>
                <Badge variant="outline" className="text-xs">
                  {range.count} keywords
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords Não Utilizadas */}
        {data.unusedKeywords.length > 0 && (
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Oportunidades ({data.unusedKeywords.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {data.unusedKeywords.slice(0, 5).map((keyword) => (
                <div
                  key={keyword.keyword}
                  className="flex items-center justify-between p-2 rounded-lg bg-yellow-50/50 border border-yellow-200/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {keyword.keyword}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Volume: {keyword.search_volume.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Badge
                      variant={
                        keyword.difficulty <= 30
                          ? "default"
                          : keyword.difficulty <= 60
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      Dif: {keyword.difficulty}
                    </Badge>
                    {keyword.priority > 0 && (
                      <Badge variant="outline" className="text-xs">
                        P: {keyword.priority}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <h5 className="font-medium text-sm mb-2">Insights</h5>
          <div className="space-y-1 text-xs text-muted-foreground">
            {data.topKeywords.length > 0 && (
              <div>
                • Keyword com maior volume: {data.topKeywords[0]?.keyword} (
                {data.topKeywords[0]?.search_volume.toLocaleString()})
              </div>
            )}
            {data.unusedKeywords.length > 0 && (
              <div>
                • {data.unusedKeywords.length} keywords não utilizadas
                disponíveis
              </div>
            )}
            <div>
              • Total de keywords analisadas:{" "}
              {data.topKeywords.length + data.unusedKeywords.length}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" size="sm" className="flex-1">
            Ver Todas
          </Button>
          <Button variant="default" size="sm" className="flex-1">
            Criar Post
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
