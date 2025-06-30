"use client";

import { Button } from "@/components/ui/button";

export function AnalysisActions() {
  return (
    <div className="flex gap-2 pt-4 border-t border-border/50">
      <Button variant="outline" size="sm" className="flex-1">
        Ver Detalhes
      </Button>
      <Button variant="default" size="sm" className="flex-1">
        Criar Conteúdo
      </Button>
    </div>
  );
}
