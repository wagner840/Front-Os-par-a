"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function BlogSelectorLoading() {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <LoadingSpinner size="sm" />
        <span className="text-slate-300">Carregando blogs...</span>
      </div>
    </div>
  );
}
