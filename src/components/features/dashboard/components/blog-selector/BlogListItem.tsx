"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Check } from "lucide-react";

interface Blog {
  id: string;
  name: string;
  domain?: string | null;
  is_active?: boolean;
  niche?: string | null;
}

interface BlogListItemProps {
  blog: Blog;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function BlogListItem({
  blog,
  isSelected,
  onClick,
  index,
}: BlogListItemProps) {
  return (
    <motion.div
      key={blog.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (index + 1) * 0.05 }}
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "bg-blue-600/20 border border-blue-500/50"
            : "hover:bg-slate-700/50"
        }
      `}
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
        <Building2 className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-white truncate">{blog.name}</h4>
          {isSelected && (
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-3 mt-1">
          {blog.domain && (
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <Globe className="w-3 h-3" />
              <span className="truncate">{blog.domain}</span>
            </div>
          )}
          {blog.niche && (
            <Badge
              variant="secondary"
              className="text-xs px-2 py-0 bg-slate-600 text-slate-200"
            >
              {blog.niche}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {blog.is_active ? (
          <div className="w-2 h-2 rounded-full bg-green-400" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-gray-400" />
        )}
      </div>
    </motion.div>
  );
}
