"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check, Filter } from "lucide-react";

interface AllBlogsListItemProps {
  isSelected: boolean;
  blogCount: number;
  onClick: () => void;
}

export function AllBlogsListItem({
  isSelected,
  blogCount,
  onClick,
}: AllBlogsListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0 }}
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
      <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
        <Filter className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-white">Todos os Blogs</h4>
          {isSelected && (
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
          )}
        </div>
        <div className="text-xs text-slate-300 mt-1">
          Visualizar dados de todos os {blogCount} blogs
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Badge
          variant="secondary"
          className="text-xs px-2 py-0 bg-blue-600 text-white"
        >
          Global
        </Badge>
      </div>
    </motion.div>
  );
}
