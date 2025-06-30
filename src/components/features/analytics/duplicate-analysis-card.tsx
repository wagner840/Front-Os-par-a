"use client";

import { Copy, AlertTriangle, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DuplicateAnalysisCard() {
  // Mock data para demonstração
  const mockData = {
    duplicateKeywords: [
      { keyword: "dieta low carb", count: 3, ids: ["1", "2", "3"] },
      { keyword: "jejum intermitente", count: 2, ids: ["4", "5"] },
    ],
    similarPosts: [
      {
        post1: { id: "1", title: "Benefícios da Dieta Low Carb" },
        post2: { id: "2", title: "Como Fazer Dieta Low Carb" },
        similarity: 0.75,
      },
    ],
  };

  const totalIssues =
    mockData.duplicateKeywords.length + mockData.similarPosts.length;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Copy className="h-5 w-5 text-primary" />
            Análise de Duplicatas
          </h3>
          <p className="text-sm text-muted-foreground">
            Detecção de conteúdo similar e keywords duplicadas
          </p>
        </div>

        <Badge
          variant={totalIssues === 0 ? "default" : "destructive"}
          className="text-xs"
        >
          {totalIssues} problemas
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Status Geral */}
        <div className="flex items-center justify-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 border border-green-200/50">
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="font-medium text-sm">Sistema Limpo</div>
            <div className="text-xs text-muted-foreground">
              Poucas duplicatas detectadas
            </div>
          </div>
        </div>

        {/* Keywords Duplicadas */}
        {mockData.duplicateKeywords.length > 0 && (
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Keywords Duplicadas
            </h4>
            <div className="space-y-2">
              {mockData.duplicateKeywords.map((dup) => (
                <div
                  key={dup.keyword}
                  className="flex items-center justify-between p-3 rounded-lg bg-yellow-50/50 border border-yellow-200/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {dup.keyword}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Encontrada em {dup.count} posts
                    </div>
                  </div>

                  <Badge variant="destructive" className="text-xs">
                    {dup.count}x
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Similares */}
        {mockData.similarPosts.length > 0 && (
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Copy className="h-4 w-4 text-orange-500" />
              Posts Similares
            </h4>
            <div className="space-y-2">
              {mockData.similarPosts.map((sim, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-orange-50/50 border border-orange-200/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Similaridade</span>
                    <Badge variant="destructive" className="text-xs">
                      {Math.round(sim.similarity * 100)}%
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="truncate font-medium">
                      {sim.post1.title}
                    </div>
                    <div className="truncate text-muted-foreground">
                      {sim.post2.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendações */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <h5 className="font-medium text-sm mb-2">Recomendações</h5>
          <div className="space-y-1 text-xs text-muted-foreground">
            {mockData.duplicateKeywords.length > 0 && (
              <div>• Consolidar keywords duplicadas em posts únicos</div>
            )}
            {mockData.similarPosts.length > 0 && (
              <div>• Revisar posts similares para diferenciação</div>
            )}
            <div>• Executar análise semanal para manter qualidade</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" size="sm" className="flex-1">
            Analisar Tudo
          </Button>
          <Button variant="default" size="sm" className="flex-1">
            Resolver Issues
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
