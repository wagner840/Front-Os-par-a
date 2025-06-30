"use client";

import { useDashboardStats } from "@/lib/hooks/use-dashboard-stats";
import { useSupabase } from "@/lib/hooks/use-supabase";
import { useOpportunityStats } from "@/lib/hooks/use-content-opportunities-dashboard";
import { useAppStore } from "@/lib/stores/app-store";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UnusedKeywordsDetail } from "./unused-keywords-detail";
import {
  TrendingUp,
  FileText,
  Target,
  BarChart3,
  Activity,
  Clock,
  Lightbulb,
  Brain,
  Sparkles,
} from "lucide-react";

// Componente simples para métricas
function MetricCard({
  title,
  value,
  suffix = "",
  icon,
}: {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
}) {
  const displayValue = isNaN(value) ? 0 : value;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">
            {displayValue.toLocaleString()}
            {suffix}
          </p>
        </div>
        <div className="p-3 bg-blue-500/20 rounded-lg">{icon}</div>
      </div>
    </GlassCard>
  );
}

export function DashboardOverview() {
  const { isOfflineMode } = useSupabase();
  const { selectedBlog } = useAppStore();
  const {
    data: stats,
    isLoading: loading,
    error,
  } = useDashboardStats(selectedBlog || undefined);
  const { data: opportunityStats, isLoading: opportunityLoading } =
    useOpportunityStats({ blogId: selectedBlog || undefined });

  if (loading || opportunityLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <GlassCard key={i} className="p-6">
            <div className="flex items-center justify-center h-24">
              <LoadingSpinner size="md" />
            </div>
          </GlassCard>
        ))}
      </div>
    );
  }

  if (error && !stats) {
    return (
      <GlassCard className="p-6 text-center">
        <div className="text-red-400">
          <p className="font-medium">Erro ao carregar estatísticas</p>
          <p className="text-sm text-red-300 mt-1">{error.message}</p>
        </div>
      </GlassCard>
    );
  }

  if (!stats) {
    return (
      <GlassCard className="p-6 text-center">
        <p className="text-white/60">Nenhuma estatística disponível</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Keywords"
          value={stats.totalKeywords}
          icon={<Target className="h-6 w-6 text-blue-400" />}
        />

        <MetricCard
          title="Keywords Não Utilizadas"
          value={stats.unusedKeywords}
          icon={<TrendingUp className="h-6 w-6 text-green-400" />}
        />

        <div className="relative">
          <MetricCard
            title="Posts Publicados"
            value={stats.publishedPosts}
            icon={<FileText className="h-6 w-6 text-purple-400" />}
          />
          <p className="text-white/40 text-xs mt-2 px-6">
            de {stats.totalPosts} total
          </p>
        </div>

        <MetricCard
          title="SEO Score Médio"
          value={stats.avgSeoScore}
          suffix="%"
          icon={<BarChart3 className="h-6 w-6 text-yellow-400" />}
        />
      </div>

      {/* Content Opportunities Preview */}
      {opportunityStats && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">
                Content Opportunities
              </h3>
            </div>
            <a
              href="/content-opportunities"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver todas →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total</p>
                  <p className="text-xl font-bold text-white">
                    {opportunityStats.total}
                  </p>
                </div>
                <Lightbulb className="h-8 w-8 text-yellow-400/60" />
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Alta Prioridade</p>
                  <p className="text-xl font-bold text-red-400">
                    {opportunityStats.byPriority?.high || 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-400/60" />
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Score Médio</p>
                  <p className="text-xl font-bold text-green-400">
                    {isNaN(opportunityStats.avgScore)
                      ? 0
                      : Math.round(opportunityStats.avgScore)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400/60" />
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Busca Semântica Rápida */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Busca Inteligente
          </h3>
          <Sparkles className="h-4 w-4 text-purple-400" />
        </div>

        <div className="text-center py-6">
          <Brain className="h-12 w-12 text-purple-400/60 mx-auto mb-3" />
          <p className="text-white/60 mb-4">
            Use IA para encontrar conteúdo relacionado em toda sua base
          </p>
          <a
            href="/content-opportunities"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Explorar Busca Semântica
          </a>
        </div>
      </GlassCard>

      {/* Keywords não utilizadas */}
      <UnusedKeywordsDetail />
    </div>
  );
}
