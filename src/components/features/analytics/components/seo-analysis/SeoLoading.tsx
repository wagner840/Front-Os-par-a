"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function SeoLoading() {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    </GlassCard>
  );
}
