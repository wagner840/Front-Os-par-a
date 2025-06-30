"use client";

import { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { GlassCard } from "@/components/ui/glass-card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface KeywordsByDifficultyChartProps {
  keywords: any[];
}

export function KeywordsByDifficultyChart({
  keywords,
}: KeywordsByDifficultyChartProps) {
  const chartData = useMemo(() => {
    if (!keywords) return [];

    const ranges = [
      { range: "0-20", min: 0, max: 20, color: "#10b981" },
      { range: "21-40", min: 21, max: 40, color: "#3b82f6" },
      { range: "41-60", min: 41, max: 60, color: "#f59e0b" },
      { range: "61-80", min: 61, max: 80, color: "#ef4444" },
      { range: "81-100", min: 81, max: 100, color: "#7c3aed" },
    ];

    return ranges.map((range) => ({
      range: range.range,
      count: keywords.filter(
        (k) => k.kw_difficulty >= range.min && k.kw_difficulty <= range.max
      ).length,
      color: range.color,
    }));
  }, [keywords]);

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Keywords por Dificuldade
        </CardTitle>
        <CardDescription>
          Distribuição das keywords por faixa de dificuldade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveBar
            data={chartData}
            keys={["count"]}
            indexBy="range"
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={({ data }) => data.color}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Dificuldade (%)",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Quantidade",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
