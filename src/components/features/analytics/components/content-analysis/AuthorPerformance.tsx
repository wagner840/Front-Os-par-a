"use client";

import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface Author {
  author_name: string;
  posts_count: number;
  total_word_count: number;
  avg_seo_score: number;
}

interface AuthorPerformanceProps {
  authors: Author[];
}

export function AuthorPerformance({ authors }: AuthorPerformanceProps) {
  if (!authors || authors.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium mb-4 flex items-center gap-2">
        <Users className="h-4 w-4" />
        Performance por Autor
      </h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {authors.slice(0, 5).map((author) => (
          <div
            key={author.author_name}
            className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {author.author_name}
              </div>
              <div className="text-xs text-muted-foreground">
                {author.posts_count} posts •{" "}
                {author.total_word_count.toLocaleString()} palavras total
              </div>
            </div>

            <Badge
              variant={
                author.avg_seo_score >= 80
                  ? "default"
                  : author.avg_seo_score >= 60
                  ? "secondary"
                  : "destructive"
              }
              className="text-xs"
            >
              SEO: {author.avg_seo_score}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
