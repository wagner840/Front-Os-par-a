"use client";

import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";

interface Post {
  id: string;
  title: string;
  word_count: number;
  seo_score: number;
}

interface TopPerformingPostsProps {
  posts: Post[];
}

export function TopPerformingPosts({ posts }: TopPerformingPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium mb-4">Top Performance</h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {posts.slice(0, 5).map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{post.title}</div>
              <div className="text-xs text-muted-foreground">
                {post.word_count} palavras
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <ProgressRing
                value={post.seo_score}
                max={100}
                size="sm"
                className="text-xs"
              />
              <Badge
                variant={
                  post.seo_score >= 80
                    ? "default"
                    : post.seo_score >= 60
                    ? "secondary"
                    : "destructive"
                }
                className="text-xs"
              >
                {post.seo_score}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
