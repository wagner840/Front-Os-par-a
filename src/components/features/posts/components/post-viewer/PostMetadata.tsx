"use client";

import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  FileText,
  Clock,
  Calendar,
  Globe,
  Target,
  Folder,
} from "lucide-react";
import type { Database } from "@/lib/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

interface PostMetadataProps {
  post: Post;
  formatDate: (date: string) => string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "secondary";
    case "scheduled":
      return "outline";
    case "archived":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "published":
      return "Publicado";
    case "draft":
      return "Rascunho";
    case "scheduled":
      return "Agendado";
    case "archived":
      return "Arquivado";
    default:
      return status;
  }
};

export function PostMetadata({ post, formatDate }: PostMetadataProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge
          variant={getStatusColor(post.status)}
          className="flex items-center gap-1"
        >
          {getStatusLabel(post.status)}
        </Badge>

        {post.seo_score && (
          <div className="flex items-center gap-1 text-sm bg-green-50 text-green-700 px-2 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">SEO {post.seo_score}%</span>
          </div>
        )}

        {post.word_count && (
          <div className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            <FileText className="w-4 h-4" />
            <span className="font-medium">
              {post.word_count.toLocaleString()} palavras
            </span>
          </div>
        )}

        {post.reading_time && (
          <div className="flex items-center gap-1 text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{post.reading_time} min</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div>
            <span className="text-gray-600">Criado em:</span>
            <div className="font-medium text-gray-900">
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>

        {post.published_at && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Globe className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-gray-600">Publicado em:</span>
              <div className="font-medium text-gray-900">
                {formatDate(post.published_at)}
              </div>
            </div>
          </div>
        )}

        {post.main_keyword_id && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Target className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-gray-600">Keyword principal:</span>
              <div className="font-medium text-gray-900">
                {post.main_keyword_id}
              </div>
            </div>
          </div>
        )}

        {"blogs" in post && post.blogs && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Folder className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-gray-600">Blog:</span>
              <div className="font-medium text-gray-900">
                {(post.blogs as any).name}
              </div>
              {(post.blogs as any).domain && (
                <div className="text-xs text-gray-500">
                  {(post.blogs as any).domain}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
