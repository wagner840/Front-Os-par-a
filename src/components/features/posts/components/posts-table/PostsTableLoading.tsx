"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function PostsTableLoading() {
  return (
    <GlassCard className="p-8">
      <div className="flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Carregando posts...</span>
      </div>
    </GlassCard>
  );
}
