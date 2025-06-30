"use client";

import { usePost } from "@/lib/hooks/use-posts";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  PostHeader,
  PostMetadata,
  PostSeoInfo,
  PostContent,
  PostTagsAndCategories,
  PostAdditionalInfo,
  PostLoading,
  PostNotFound,
} from "./components/post-viewer";
import type { Database } from "@/lib/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

interface PostViewerProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const parsePerformanceMetrics = (metrics: any) => {
  if (typeof metrics === "string") {
    try {
      return JSON.parse(metrics);
    } catch {
      return {};
    }
  }
  return metrics || {};
};

export function PostViewer({ postId, isOpen, onClose }: PostViewerProps) {
  const { data: post, isLoading } = usePost(postId);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby="post-viewer-description"
      >
        <DialogHeader>
          <PostHeader
            isLoading={isLoading}
            title={post?.title}
            onClose={onClose}
          />
        </DialogHeader>

        {isLoading ? (
          <PostLoading />
        ) : !post ? (
          <PostNotFound />
        ) : (
          <div className="space-y-6">
            <PostMetadata post={post} formatDate={formatDate} />
            <PostSeoInfo post={post} />
            <PostContent post={post} />
            <PostTagsAndCategories post={post} />
            <PostAdditionalInfo
              post={post}
              formatDate={formatDate}
              parsePerformanceMetrics={parsePerformanceMetrics}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
