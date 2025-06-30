"use client";

import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

interface Category {
  category: string;
  posts_count: number;
  avg_word_count: number;
  avg_seo_score: number;
}

interface CategoryPerformanceProps {
  categories: Category[];
}

export function CategoryPerformance({ categories }: CategoryPerformanceProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        Performance por Categoria
      </h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {categories.slice(0, 5).map((category) => (
          <div
            key={category.category}
            className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {category.category}
              </div>
              <div className="text-xs text-muted-foreground">
                {category.posts_count} posts • {category.avg_word_count}{" "}
                palavras/post
              </div>
            </div>

            <Badge
              variant={
                category.avg_seo_score >= 80
                  ? "default"
                  : category.avg_seo_score >= 60
                  ? "secondary"
                  : "destructive"
              }
              className="text-xs"
            >
              SEO: {category.avg_seo_score}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
