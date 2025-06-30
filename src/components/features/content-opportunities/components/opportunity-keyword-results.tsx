
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Target, Tag, Layers } from "lucide-react";

export default function OpportunityKeywordResults({ keywordOpportunities }) {
  const getPriorityColor = (score: number) => {
    if (score >= 80) return "text-red-400";
    if (score >= 50) return "text-yellow-400";
    return "text-gray-400";
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 80) return "Alta";
    if (score >= 50) return "Média";
    return "Baixa";
  };

  return (
    <GlassCard>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Oportunidades para Keyword Selecionada
          </h3>
          <Badge variant="outline" className="ml-auto">
            {keywordOpportunities.total} encontradas
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories */}
          {keywordOpportunities.categories.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-white/80 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Por Categorias ({keywordOpportunities.categories.length})
              </h4>
              <div className="space-y-2">
                {keywordOpportunities.categories.map((opportunity: any) => (
                  <div
                    key={opportunity.id}
                    className="p-3 rounded border border-white/10 bg-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-white text-sm">
                        {opportunity.title}
                      </h5>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(
                          opportunity.priority_score || 0
                        )}
                      >
                        {getPriorityLabel(opportunity.priority_score || 0)}
                      </Badge>
                    </div>
                    {opportunity.description && (
                      <p className="text-xs text-white/60 line-clamp-2">
                        {opportunity.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clusters */}
          {keywordOpportunities.clusters.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-white/80 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Por Clusters ({keywordOpportunities.clusters.length})
              </h4>
              <div className="space-y-2">
                {keywordOpportunities.clusters.map((opportunity: any) => (
                  <div
                    key={opportunity.id}
                    className="p-3 rounded border border-white/10 bg-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-white text-sm">
                        {opportunity.title}
                      </h5>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(
                          opportunity.priority_score || 0
                        )}
                      >
                        {getPriorityLabel(opportunity.priority_score || 0)}
                      </Badge>
                    </div>
                    {opportunity.description && (
                      <p className="text-xs text-white/60 line-clamp-2">
                        {opportunity.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
