"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUnusedKeywords } from "@/lib/hooks/use-keywords";
import { AlertTriangle, TrendingUp, Search, Eye, EyeOff } from "lucide-react";

export function UnusedKeywordsDetail() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Buscar keywords não utilizadas
  const { data: unusedKeywords = [], isLoading } = useUnusedKeywords();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getCompetitionColor = (competition: string | null) => {
    switch (competition) {
      case "LOW":
        return "bg-green-500/20 text-green-400";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400";
      case "HIGH":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getDifficultyColor = (difficulty: number | null) => {
    if (!difficulty) return "bg-gray-500/20 text-gray-400";
    if (difficulty <= 30) return "bg-green-500/20 text-green-400";
    if (difficulty <= 60) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const totalVolume = unusedKeywords
    .filter((k) => k.msv && k.msv > 0)
    .reduce((acc, k) => acc + (k.msv || 0), 0);

  const avgDifficulty =
    unusedKeywords.filter((k) => k.kw_difficulty).length > 0
      ? Math.round(
          unusedKeywords
            .filter((k) => k.kw_difficulty)
            .reduce((acc, k) => acc + (k.kw_difficulty || 0), 0) /
            unusedKeywords.filter((k) => k.kw_difficulty).length
        )
      : 0;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Keywords Não Utilizadas
            </h3>
            <p className="text-white/60 text-sm">
              {unusedKeywords.length} oportunidades de conteúdo
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleExpanded}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Carregando...
            </>
          ) : isExpanded ? (
            <>
              <EyeOff className="w-4 h-4" />
              Ocultar
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Ver Detalhes
            </>
          )}
        </Button>
      </div>

      {/* Resumo rápido sempre visível */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {unusedKeywords.length}
          </p>
          <p className="text-sm text-white/60">Keywords não usadas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">
            {totalVolume.toLocaleString()}
          </p>
          <p className="text-sm text-white/60">Volume total disponível</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">{avgDifficulty}</p>
          <p className="text-sm text-white/60">Dificuldade média</p>
        </div>
      </div>

      {/* Lista detalhada quando expandida */}
      {isExpanded && unusedKeywords.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm text-white/60 border-b border-white/20 pb-2">
            <span>Palavra-chave</span>
            <div className="flex items-center gap-8">
              <span>Volume</span>
              <span>Dificuldade</span>
              <span>Competição</span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {unusedKeywords.slice(0, 20).map((keyword, index) => (
              <div
                key={keyword.id || index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">
                      {keyword.keyword}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  {/* Volume */}
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-white min-w-[60px] text-right">
                      {keyword.msv ? keyword.msv.toLocaleString() : "N/A"}
                    </span>
                  </div>

                  {/* Dificuldade */}
                  <Badge
                    className={`min-w-[60px] justify-center ${getDifficultyColor(
                      keyword.kw_difficulty
                    )}`}
                  >
                    {keyword.kw_difficulty || "N/A"}
                  </Badge>

                  {/* Competição */}
                  <Badge
                    className={`min-w-[80px] justify-center ${getCompetitionColor(
                      keyword.competition
                    )}`}
                  >
                    {keyword.competition === "LOW"
                      ? "Baixa"
                      : keyword.competition === "MEDIUM"
                      ? "Média"
                      : keyword.competition === "HIGH"
                      ? "Alta"
                      : "N/A"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {unusedKeywords.length > 20 && (
            <p className="text-center text-white/60 text-sm pt-2">
              Mostrando 20 de {unusedKeywords.length} keywords não utilizadas
            </p>
          )}
        </div>
      )}

      {/* Estado vazio */}
      {unusedKeywords.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-white font-medium">Parabéns!</p>
          <p className="text-white/60 text-sm">
            Todas as keywords estão sendo utilizadas
          </p>
        </div>
      )}
    </GlassCard>
  );
}
