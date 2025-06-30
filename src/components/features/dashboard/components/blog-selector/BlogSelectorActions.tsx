"use client";

import { AnimatedButton } from "@/components/ui/animated-button";
import { Plus, Settings } from "lucide-react";

export function BlogSelectorActions() {
  return (
    <div className="border-t border-slate-700/50 mt-3 pt-3">
      <div className="grid grid-cols-2 gap-2">
        <AnimatedButton
          variant="glass"
          size="sm"
          className="justify-center text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Novo Blog
        </AnimatedButton>
        <AnimatedButton
          variant="glass"
          size="sm"
          className="justify-center text-xs"
        >
          <Settings className="w-3 h-3 mr-1" />
          Configurar
        </AnimatedButton>
      </div>
    </div>
  );
}
