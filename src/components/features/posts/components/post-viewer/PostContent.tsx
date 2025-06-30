"use client";

import { BookOpen } from "lucide-react";
import type { Database } from "@/lib/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

interface PostContentProps {
  post: Post;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-gray-500" />
        Conteúdo do Post
      </h4>

      <div className="p-6 bg-gray-50 rounded-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <div className="text-lg text-gray-600 mb-6 italic border-l-4 border-gray-300 pl-4">
            {post.excerpt}
          </div>
        )}

        {post.featured_image && (
          <div className="mb-6">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div
            className="content-area text-gray-800 leading-relaxed"
            style={{
              fontFamily: "Georgia, serif",
              lineHeight: "1.8",
              fontSize: "16px",
            }}
            dangerouslySetInnerHTML={{
              __html:
                post.content ||
                '<p class="text-gray-500">Conteúdo não disponível</p>',
            }}
          />
        </div>
      </div>
    </div>
  );
}
