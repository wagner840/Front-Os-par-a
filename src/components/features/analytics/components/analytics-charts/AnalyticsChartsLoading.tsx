"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function AnalyticsChartsLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <GlassCard key={i} className="h-80 flex items-center justify-center">
          <LoadingSpinner />
        </GlassCard>
      ))}
    </div>
  );
}
