
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Eye, Edit, Calendar, User } from "lucide-react";

interface OpportunityGridProps {
  opportunities: any[];
  isLoading: boolean;
  type: "categories" | "clusters";
}

export default function OpportunityGrid({
  opportunities,
  isLoading,
  type,
}: OpportunityGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <GlassCard className="h-48">
              <div className="h-full bg-white/5 rounded"></div>
            </GlassCard>
          </div>
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <GlassCard className="text-center py-12">
        <Lightbulb className="h-12 w-12 text-white/40 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white/60 mb-2">
          Nenhuma oportunidade encontrada
        </h3>
        <p className="text-white/40">
          Tente ajustar os filtros ou crie uma nova oportunidade.
        </p>
      </GlassCard>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "in_progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "on_hold":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "in_progress":
        return "Em Progresso";
      case "completed":
        return "Concluída";
      case "on_hold":
        return "Em Espera";
      default:
        return status;
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 80) return "text-red-400";
    if (score >= 50) return "text-yellow-400";
    return "text-gray-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {opportunities.map((opportunity, index) => (
        <motion.div
          key={opportunity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {opportunity.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        opportunity.status
                      )}`}
                    />
                    <span className="text-xs text-white/60">
                      {getStatusLabel(opportunity.status)}
                    </span>
                  </div>
                </div>

                {opportunity.priority_score && (
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${getPriorityColor(
                        opportunity.priority_score
                      )}`}
                    >
                      {Math.round(opportunity.priority_score)}
                    </div>
                    <div className="text-xs text-white/40">score</div>
                  </div>
                )}
              </div>

              {/* Description */}
              {opportunity.description && (
                <p className="text-sm text-white/60 mb-4 line-clamp-3 flex-1">
                  {opportunity.description}
                </p>
              )}

              {/* Metadata */}
              <div className="space-y-2 mt-auto">
                {opportunity.content_type && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {opportunity.content_type}
                    </Badge>
                  </div>
                )}

                {opportunity.due_date && (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Calendar className="h-3 w-3" />
                    {new Date(opportunity.due_date).toLocaleDateString()}
                  </div>
                )}

                {opportunity.assigned_to_author && (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <User className="h-3 w-3" />
                    {opportunity.assigned_to_author.name}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
