"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedMetric } from "@/components/ui/animated-metric";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  BarChart3,
  Target,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dados atualizados com sucesso!");
    }, 1000);
  };

  const handleExport = (format: "csv" | "json") => {
    toast.success(`Dados exportados em ${format.toUpperCase()}`);
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Analytics" },
  ];

  return (
    <DashboardLayout
      title="Análise e Relatórios"
      description="Insights detalhados sobre performance de conteúdo e SEO"
      breadcrumbItems={breadcrumbItems}
    >
      {/* Header com Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex-1"></div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            className="btn-secondary gap-2"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
            className="btn-secondary gap-2"
          >
            <Download className="h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="responsive-grid">
        <AnimatedMetric
          title="Total de Posts"
          value={42}
          trend="up"
          className="glow-blue"
        />
        <AnimatedMetric
          title="SEO Score Médio"
          value={78}
          suffix="%"
          trend="up"
          className="glow-green"
        />
        <AnimatedMetric
          title="Total Keywords"
          value={156}
          trend="up"
          className="glow-purple"
        />
        <AnimatedMetric
          title="Palavras/Post"
          value={1240}
          trend="neutral"
          className="glow-blue"
        />
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-high-contrast">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance SEO
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Posts Excelentes</span>
                <span className="text-green-400 font-medium">15 posts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Posts Bons</span>
                <span className="text-blue-400 font-medium">20 posts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Precisam Melhorar</span>
                <span className="text-amber-400 font-medium">7 posts</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-high-contrast">
              <BarChart3 className="h-5 w-5 text-primary" />
              Análise de Conteúdo
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Posts Publicados</span>
                <span className="text-green-400 font-medium">35</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Rascunhos</span>
                <span className="text-amber-400 font-medium">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Taxa de Crescimento</span>
                <span className="text-blue-400 font-medium">+12%</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-high-contrast">
              <Target className="h-5 w-5 text-primary" />
              Keywords Performance
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Keywords Ativas</span>
                <span className="text-green-400 font-medium">134</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Não Utilizadas</span>
                <span className="text-amber-400 font-medium">22</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Volume Médio</span>
                <span className="text-blue-400 font-medium">2.4K</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-high-contrast">
              <FileText className="h-5 w-5 text-primary" />
              Insights e Recomendações
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-300">
                  💡 Considere criar mais conteúdo sobre &quot;whey
                  protein&quot; - alta demanda
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-300">
                  ✅ Seus posts sobre &quot;jejum intermitente&quot; estão
                  performando bem
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-300">
                  ⚠️ 7 posts precisam de otimização SEO
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
