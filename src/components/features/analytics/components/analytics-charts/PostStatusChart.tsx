"use client";

import { useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import { GlassCard } from "@/components/ui/glass-card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Target } from "lucide-react";

interface PostStatusChartProps {
  posts: any[];
}

export function PostStatusChart({ posts }: PostStatusChartProps) {
  const chartData = useMemo(() => {
    if (!posts) return [];

    const statusCount = posts.reduce((acc: any, post: any) => {
      acc[post.status] = (acc[post.status] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      published: "#10b981",
      draft: "#f59e0b",
      scheduled: "#3b82f6",
      archived: "#6b7280",
    };

    return Object.entries(statusCount).map(
      ([status, count]: [string, any]) => ({
        id: status,
        label:
          status === "published"
            ? "Publicados"
            : status === "draft"
            ? "Rascunhos"
            : status === "scheduled"
            ? "Agendados"
            : "Arquivados",
        value: count,
        color: colors[status as keyof typeof colors] || "#6b7280",
      })
    );
  }, [posts]);

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Status dos Posts
        </CardTitle>
        <CardDescription>
          Distribuição dos posts por status de publicação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsivePie
            data={chartData}
            margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#6b7280"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
            colors={({ data }) => data.color}
            animate={true}
            motionConfig="wobbly"
            theme={{
              background: "transparent",
              text: {
                fontSize: 12,
                fill: "#6b7280",
              },
            }}
          />
        </div>
      </CardContent>
    </GlassCard>
  );
}
