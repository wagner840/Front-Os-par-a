
import { AnimatedMetric } from "@/components/ui/animated-metric";
import { Lightbulb, Clock, TrendingUp, BarChart3 } from "lucide-react";

export default function OpportunityStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnimatedMetric
        title="Total de Oportunidades"
        value={stats.total}
        icon={<Lightbulb className="w-5 h-5" />}
        trend="up"
        className="glow-yellow"
      />
      <AnimatedMetric
        title="Em Progresso"
        value={stats.in_progress}
        icon={<Clock className="w-5 h-5" />}
        trend="up"
        className="glow-blue"
      />
      <AnimatedMetric
        title="Alta Prioridade"
        value={stats.high_priority}
        icon={<TrendingUp className="w-5 h-5" />}
        trend="up"
        className="glow-red"
      />
      <AnimatedMetric
        title="Score Médio"
        value={Math.round(stats.avg_priority)}
        suffix="/100"
        icon={<BarChart3 className="w-5 h-5" />}
        trend="up"
        className="glow-green"
      />
    </div>
  );
}
