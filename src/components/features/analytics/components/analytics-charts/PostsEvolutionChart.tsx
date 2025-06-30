"use client";

import { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { GlassCard } from "@/components/ui/glass-card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface PostsEvolutionChartProps {
  posts: any[];
}

export function PostsEvolutionChart({ posts }: PostsEvolutionChartProps) {
  const chartData = useMemo(() => {
    if (!posts) return [];

    const monthlyData = posts.reduce((acc: any, post: any) => {
      const date = new Date(post.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { count: 0 };
      }

      acc[monthKey].count += 1;
      return acc;
    }, {});

    const sortedData = Object.entries(monthlyData)
      .map(([month, data]: [string, any]) => ({
        x: month,
        y: data.count,
      }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

    return [{ id: "posts", data: sortedData }];
  }, [posts]);

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Evolução de Posts
        </CardTitle>
        <CardDescription>
          Crescimento da produção de conteúdo ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
            }}
            curve="cardinal"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Período",
              legendOffset: 45,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Quantidade",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            colors={["#3b82f6"]}
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
