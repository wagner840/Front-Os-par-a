"use client";

import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface UnderperformingPost {
  id: string;
  title: string;
  seo_score: number;
  issues: string[];
}

interface UnderPerformingPostsProps {
  posts: UnderperformingPost[];
}

export function UnderPerformingPosts({ posts }: UnderPerformingPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        Precisam de Atenção
      </h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {posts.slice(0, 3).map((post) => (
          <div
            key={post.id}
            className="p-3 rounded-lg bg-yellow-50/50 border border-yellow-200/50"
          >
            <div className="text-sm font-medium truncate mb-1">
              {post.title}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive" className="text-xs">
                SEO: {post.seo_score}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {post.issues.map((issue, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {issue}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
