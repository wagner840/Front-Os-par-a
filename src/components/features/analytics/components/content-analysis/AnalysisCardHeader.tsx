"use client";

import { FileText } from "lucide-react";

export function AnalysisCardHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Análise de Conteúdo
        </h3>
        <p className="text-sm text-muted-foreground">
          Performance por categoria e autor
        </p>
      </div>
    </div>
  );
}
