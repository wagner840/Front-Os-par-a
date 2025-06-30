"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Filter } from "lucide-react";

interface Blog {
  id: string;
  name: string;
  domain?: string | null;
  is_active?: boolean;
  niche?: string | null;
}

interface CollapsedSelectorProps {
  isExpanded: boolean;
  selectedBlog: Blog | undefined;
  blogCount: number;
}

export function CollapsedSelector({
  isExpanded,
  selectedBlog,
  blogCount,
}: CollapsedSelectorProps) {
  const displayText = selectedBlog?.name || "Todos os Blogs";
  const displaySubtext = selectedBlog
    ? selectedBlog.domain || "Blog individual"
    : `${blogCount} blogs disponíveis`;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          {selectedBlog ? (
            <Building2 className="w-5 h-5 text-white" />
          ) : (
            <Filter className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white">{displayText}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <Globe className="w-3 h-3" />
              {displaySubtext}
            </div>
            {selectedBlog?.is_active && (
              <Badge
                variant="default"
                className="text-xs px-2 py-0 bg-green-600 text-white"
              >
                Ativo
              </Badge>
            )}
            {!selectedBlog && (
              <Badge
                variant="default"
                className="text-xs px-2 py-0 bg-blue-600 text-white"
              >
                Todos
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">
          {blogCount} blog{blogCount !== 1 ? "s" : ""}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
