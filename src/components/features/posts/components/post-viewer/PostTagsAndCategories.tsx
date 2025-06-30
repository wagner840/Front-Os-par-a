"use client";

import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import type { Database } from "@/lib/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

interface PostTagsAndCategoriesProps {
  post: Post;
}

export function PostTagsAndCategories({ post }: PostTagsAndCategoriesProps) {
  const tags = post.tags as string[] | null;
  const categories = post.categories as string[] | null;

  if (!tags?.length && !categories?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Tag className="w-5 h-5 text-gray-500" />
        Tags e Categorias
      </h4>

      <div className="flex flex-wrap gap-2">
        {tags?.map((tag: string, index: number) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}

        {categories?.map((category: string, index: number) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
