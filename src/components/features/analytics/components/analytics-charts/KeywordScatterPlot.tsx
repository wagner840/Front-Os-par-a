"use client";

import { useMemo } from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { GlassCard } from "@/components/ui/glass-card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Zap } from "lucide-react";

interface KeywordScatterPlotProps {
  keywords: any[];
}

export function KeywordScatterPlot({ keywords }: KeywordScatterPlotProps) {
  const chartData = useMemo(() => {
    if (!keywords) return [];

    return [
      {
        id: "keywords",
        data: keywords
          .filter((k) => k.msv && k.kw_difficulty)
          .map((k) => ({
            x: k.kw_difficulty,
            y: k.msv,
            keyword: k.keyword,
          })),
      },
    ];
  }, [keywords]);

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          MSV vs Dificuldade
        </CardTitle>
        <CardDescription>
          Análise de oportunidades: volume de busca vs dificuldade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveScatterPlot
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 70, left: 90 }}
            xScale={{ type: "linear", min: 0, max: 100 }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
            blendMode="multiply"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Dificuldade (%)",
              legendOffset: 46,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Volume de Busca (MSV)",
              legendOffset: -60,
              legendPosition: "middle",
            }}
            colors={["#3b82f6"]}
            nodeSize={8}
            animate={true}
            motionConfig="wobbly"
            theme={{
              background: "transparent",
              text: {
                fontSize: 12,
                fill: "#6b7280",
              },
              axis: {
                domain: {
                  line: {
                    stroke: "#e5e7eb",
                    strokeWidth: 1,
                  },
                },
                ticks: {
                  line: {
                    stroke: "#e5e7eb",
                    strokeWidth: 1,
                  },
                },
              },
              grid: {
                line: {
                  stroke: "#f3f4f6",
                  strokeWidth: 1,
                },
              },
            }}
          />
        </div>
      </CardContent>
    </GlassCard>
  );
}
