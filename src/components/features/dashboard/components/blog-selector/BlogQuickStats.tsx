"use client";

import { useBlogs } from "@/lib/hooks/use-blogs";
import { useAppStore } from "@/lib/stores/app-store";

// Este componente pode ser melhorado para buscar dados reais
export function BlogQuickStats() {
  const { data: blogs } = useBlogs();
  const { selectedBlog: selectedBlogId } = useAppStore();

  if (!blogs) return null;

  const selectedBlog = blogs.find((blog) => blog.id === selectedBlogId);

  // Dados mockados - em um cenário real, seriam obtidos de uma query
  const statsData = selectedBlog
    ? {
        name: selectedBlog.name,
        posts: 0,
        keywords: 0,
        views: 0,
      }
    : {
        name: "Todos os Blogs",
        posts: 0,
        keywords: 0,
        views: 0,
      };

  return (
    <div
      className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-lg p-3"
      suppressHydrationWarning
    >
      <div className="text-xs text-slate-400 mb-2">
        Estatísticas - {statsData.name}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{statsData.posts}</div>
          <div className="text-xs text-slate-400">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {statsData.keywords}
          </div>
          <div className="text-xs text-slate-400">Keywords</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{statsData.views}</div>
          <div className="text-xs text-slate-400">Views</div>
        </div>
      </div>
    </div>
  );
}
