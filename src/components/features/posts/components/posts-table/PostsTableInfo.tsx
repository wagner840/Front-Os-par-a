"use client";

import { Badge } from "@/components/ui/badge";

interface PostsTableInfoProps {
  postCount: number;
  isBlogSelected: boolean;
}

export function PostsTableInfo({
  postCount,
  isBlogSelected,
}: PostsTableInfoProps) {
  return (
    <div className="p-4 border-b border-white/20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-gray-900">Posts</h3>
        <Badge variant="secondary" className="text-xs">
          {postCount} encontrados
        </Badge>
      </div>

      {isBlogSelected ? (
        <Badge variant="outline" className="text-xs">
          Blog específico
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-xs">
          Todos os blogs
        </Badge>
      )}
    </div>
  );
}
