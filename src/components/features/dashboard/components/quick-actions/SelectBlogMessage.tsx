"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Search } from "lucide-react";

export function SelectBlogMessage() {
  return (
    <GlassCard variant="subtle" className="p-6 text-center">
      <Search className="w-12 h-12 mx-auto mb-4 text-white/50" />
      <h3 className="text-white font-medium mb-2">Selecione um blog</h3>
      <p className="text-white/60 text-sm">
        Escolha um blog para ver as ações rápidas
      </p>
    </GlassCard>
  );
}
