"use client";

import { useState } from "react";
import { useBlogs } from "@/lib/hooks/use-blogs";
import { useAppStore } from "@/lib/stores/app-store";
import { AnimatePresence } from "framer-motion";
import { CollapsedSelector } from "./components/blog-selector/CollapsedSelector";
import { BlogList } from "./components/blog-selector/BlogList";
import { BlogSelectorLoading } from "./components/blog-selector/BlogSelectorLoading";
import { NoBlogsFound } from "./components/blog-selector/NoBlogsFound";

function BlogSelectorContent() {
  const { data: blogs, isLoading } = useBlogs();
  const { selectedBlog: selectedBlogId, setSelectedBlog: setSelectedBlogId } =
    useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedBlog = blogs?.find((blog) => blog.id === selectedBlogId);

  const handleSelectBlog = (id: string | null) => {
    setSelectedBlogId(id);
    setIsExpanded(false);
  };

  if (isLoading) {
    return <BlogSelectorLoading />;
  }

  if (!blogs || blogs.length === 0) {
    return <NoBlogsFound />;
  }

  return (
    <div className="relative">
      <div
        className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:bg-slate-800/80 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CollapsedSelector
          isExpanded={isExpanded}
          selectedBlog={selectedBlog}
          blogCount={blogs.length}
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <BlogList
            blogs={blogs}
            selectedBlogId={selectedBlogId}
            onSelectBlog={handleSelectBlog}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function BlogSelector() {
  return (
    <div suppressHydrationWarning>
      <BlogSelectorContent />
    </div>
  );
}

// Componente para estatísticas rápidas do blog selecionado
export function BlogQuickStats() {
  const { data: blogs } = useBlogs();
  const { selectedBlog: selectedBlogId } = useAppStore();

  if (!blogs) return null;

  const selectedBlog = blogs.find((blog) => blog.id === selectedBlogId);
  const statsData = selectedBlog
    ? {
        name: selectedBlog.name,
        posts: 0, // Seria obtido de uma query específica
        keywords: 0, // Seria obtido de uma query específica
        views: 0, // Seria obtido de uma query específica
      }
    : {
        name: "Todos os Blogs",
        posts: 0, // Soma de todos os posts
        keywords: 0, // Soma de todas as keywords
        views: 0, // Soma de todas as views
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
