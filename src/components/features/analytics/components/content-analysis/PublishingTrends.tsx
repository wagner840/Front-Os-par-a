"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface Trend {
  date: string;
  posts_count: number;
  avg_seo_score: number;
}

interface PublishingTrendsProps {
  trends: Trend[];
}

export function PublishingTrends({ trends }: PublishingTrendsProps) {
  if (!trends || trends.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Atividade Recente
      </h4>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {trends.slice(0, 7).map((trend) => (
          <div
            key={trend.date}
            className="flex items-center justify-between p-2 rounded-lg bg-background/30"
          >
            <div className="text-sm">
              {new Date(trend.date).toLocaleDateString("pt-BR")}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {trend.posts_count} posts
              </Badge>
              <Badge variant="secondary" className="text-xs">
                SEO: {trend.avg_seo_score}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
