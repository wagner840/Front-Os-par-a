"use client";

import { AnimatedButton } from "@/components/ui/animated-button";
import { Building2, Plus } from "lucide-react";

export function NoBlogsFound() {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
      <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-400" />
      <h3 className="text-white font-medium mb-2">Nenhum blog encontrado</h3>
      <p className="text-slate-300 text-sm mb-4">
        Crie seu primeiro blog para começar
      </p>
      <AnimatedButton variant="primary" size="sm">
        <Plus className="w-4 h-4 mr-2" />
        Criar Blog
      </AnimatedButton>
    </div>
  );
}
