"use client";

import { Hash } from "lucide-react";
import type { Database } from "@/lib/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

interface PostSeoInfoProps {
  post: Post;
}

export function PostSeoInfo({ post }: PostSeoInfoProps) {
  if (!post.seo_title && !post.meta_description) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Hash className="w-5 h-5 text-gray-500" />
        Informações SEO
      </h4>

      {post.seo_title && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <label className="text-sm font-medium text-blue-700 block mb-1">
            Meta Título
          </label>
          <p className="text-blue-900">{post.seo_title}</p>
        </div>
      )}

      {post.meta_description && (
        <div className="p-4 bg-green-50 rounded-lg">
          <label className="text-sm font-medium text-green-700 block mb-1">
            Meta Descrição
          </label>
          <p className="text-green-900">{post.meta_description}</p>
        </div>
      )}
    </div>
  );
}
