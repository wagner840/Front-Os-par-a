"use client";

import { BookOpen, Clock } from "lucide-react";
import type { Database } from "@/lib/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

interface PostAdditionalInfoProps {
  post: Post;
  formatDate: (date: string) => string;
  parsePerformanceMetrics: (metrics: any) => any;
}

export function PostAdditionalInfo({
  post,
  formatDate,
  parsePerformanceMetrics,
}: PostAdditionalInfoProps) {
  const performanceMetrics = parsePerformanceMetrics(post.performance_metrics);
  const readabilityScore = performanceMetrics.readability_score;
  const showInfo =
    readabilityScore ||
    (post.updated_at && post.updated_at !== post.created_at);

  if (!showInfo) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t">
      {readabilityScore && (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Legibilidade:</span>
          <span className="font-medium text-gray-900">{readabilityScore}%</span>
        </div>
      )}

      {post.updated_at && post.updated_at !== post.created_at && (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Última atualização:</span>
          <span className="font-medium text-gray-900">
            {formatDate(post.updated_at)}
          </span>
        </div>
      )}
    </div>
  );
}
