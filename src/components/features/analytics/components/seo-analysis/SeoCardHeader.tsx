"use client";

import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SeoCardHeaderProps {
  totalPosts: number;
}

export function SeoCardHeader({ totalPosts }: SeoCardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Análise SEO
        </h3>
        <p className="text-sm text-muted-foreground">
          Performance e distribuição de SEO Score
        </p>
      </div>
      <Badge variant="outline" className="text-xs">
        {totalPosts} posts
      </Badge>
    </div>
  );
}
