"use client";

import { GlassCard } from "@/components/ui/glass-card";

export function AnalysisEmpty() {
  return (
    <GlassCard className="p-6">
      <div className="text-center text-muted-foreground h-64 flex items-center justify-center">
        Dados de conteúdo não disponíveis
      </div>
    </GlassCard>
  );
}
