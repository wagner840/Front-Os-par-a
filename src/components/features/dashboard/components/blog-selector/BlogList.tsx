"use client";

import { motion } from "framer-motion";
import { AllBlogsListItem } from "./AllBlogsListItem";
import { BlogListItem } from "./BlogListItem";
import { BlogSelectorActions } from "./BlogSelectorActions";

interface Blog {
  id: string;
  name: string;
  domain?: string | null;
  is_active?: boolean;
  niche?: string | null;
}

interface BlogListProps {
  blogs: Blog[];
  selectedBlogId: string | null;
  onSelectBlog: (id: string | null) => void;
}

export function BlogList({
  blogs,
  selectedBlogId,
  onSelectBlog,
}: BlogListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 z-50 mt-2"
    >
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-2 max-h-80 overflow-y-auto">
        <div className="space-y-1">
          <AllBlogsListItem
            isSelected={!selectedBlogId}
            blogCount={blogs.length}
            onClick={() => onSelectBlog(null)}
          />
          {blogs.map((blog, index) => (
            <BlogListItem
              key={blog.id}
              blog={blog}
              isSelected={selectedBlogId === blog.id}
              onClick={() => onSelectBlog(blog.id)}
              index={index}
            />
          ))}
        </div>
        <BlogSelectorActions />
      </div>
    </motion.div>
  );
}
