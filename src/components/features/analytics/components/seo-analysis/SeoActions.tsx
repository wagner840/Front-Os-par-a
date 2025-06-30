"use client";

import { Button } from "@/components/ui/button";

export function SeoActions() {
  return (
    <div className="flex gap-2 pt-4 border-t border-border/50">
      <Button variant="outline" size="sm" className="flex-1">
        Ver Relatório Completo
      </Button>
      <Button variant="default" size="sm" className="flex-1">
        Otimizar SEO
      </Button>
    </div>
  );
}
