"use client";

import { useState } from "react";
import { BarChart3, PieChart, TrendingUp, Activity } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ChartData } from "@/lib/hooks/use-analytics";

interface PerformanceChartsProps {
  chartData?: ChartData;
  isLoading?: boolean;
}

export function PerformanceCharts({
  chartData,
  isLoading,
}: PerformanceChartsProps) {
  const [activeChart, setActiveChart] = useState<"seo" | "keywords" | "trends">(
    "seo"
  );

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </GlassCard>
    );
  }

  if (!chartData) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-muted-foreground">
          Dados de gráficos não disponíveis
        </div>
      </GlassCard>
    );
  }

  const charts = [
    {
      id: "seo" as const,
      title: "SEO Score",
      icon: TrendingUp,
      data: chartData.seoScoreChart,
    },
    {
      id: "keywords" as const,
      title: "Keywords",
      icon: BarChart3,
      data: chartData.keywordDifficultyChart,
    },
    {
      id: "trends" as const,
      title: "Tendências",
      icon: Activity,
      data: chartData.publishingTrendChart,
    },
  ];

  const activeChartData = charts.find((chart) => chart.id === activeChart);

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Gráficos de Performance
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Visualização dos dados de análise
          </p>
        </div>

        <div className="flex gap-2">
          {charts.map((chart) => (
            <Button
              key={chart.id}
              variant={activeChart === chart.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart(chart.id)}
              className="gap-2"
            >
              <chart.icon className="h-4 w-4" />
              {chart.title}
            </Button>
          ))}
        </div>
      </div>

      {activeChartData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{activeChartData.data.title}</h4>
            <Badge variant="outline" className="text-xs">
              {activeChartData.data.data.length} itens
            </Badge>
          </div>

          {/* Chart Placeholder - Aqui seria integrado com MCP Charts */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 border-2 border-dashed border-primary/20">
            <div className="text-center space-y-4">
              <activeChartData.icon className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h5 className="font-medium">{activeChartData.data.title}</h5>
                <p className="text-sm text-muted-foreground">
                  Gráfico será renderizado aqui usando MCP Charts
                </p>
              </div>

              {/* Dados em formato tabular temporário */}
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {activeChartData.data.data.slice(0, 6).map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-2 bg-background/50 rounded"
                    >
                      <span className="truncate">
                        {"category" in item
                          ? item.category
                          : "time" in item
                          ? item.time
                          : "Item"}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas resumidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {activeChartData.data.data.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Total de Itens
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {Math.max(...activeChartData.data.data.map((d) => d.value))}
              </div>
              <div className="text-xs text-muted-foreground">Valor Máximo</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {Math.min(...activeChartData.data.data.map((d) => d.value))}
              </div>
              <div className="text-xs text-muted-foreground">Valor Mínimo</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-primary">
                {Math.round(
                  activeChartData.data.data.reduce(
                    (sum, d) => sum + d.value,
                    0
                  ) / activeChartData.data.data.length
                )}
              </div>
              <div className="text-xs text-muted-foreground">Média</div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
