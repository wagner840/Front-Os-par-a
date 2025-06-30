"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedMetric } from "@/components/ui/animated-metric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, Plus, Search, Filter, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { DebugBlogState } from "@/components/debug-blog-state";

export default function KeywordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleExport = () => {
    toast.success("Keywords exportadas com sucesso!");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`Importando ${file.name}...`);
        // Aqui implementar a lógica de importação real
        setTimeout(() => {
          toast.success("Keywords importadas com sucesso!");
        }, 2000);
      }
    };
    input.click();
  };

  const handleCreateKeyword = () => {
    setIsCreateModalOpen(true);
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Keywords" },
  ];

  return (
    <DashboardLayout
      title="Gerenciamento de Keywords"
      description="Gerencie e otimize suas palavras-chave para melhor SEO"
      breadcrumbItems={breadcrumbItems}
    >
      {/* Header com Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex-1"></div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            className="btn-secondary gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="btn-secondary gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>

          <Button onClick={handleCreateKeyword} className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Nova Keyword
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="responsive-grid">
        <AnimatedMetric
          title="Total Keywords"
          value={156}
          trend="up"
          className="glow-blue"
        />
        <AnimatedMetric
          title="Keywords Ativas"
          value={134}
          trend="up"
          className="glow-green"
        />
        <AnimatedMetric
          title="Volume Médio"
          value={2400}
          trend="up"
          className="glow-purple"
        />
        <AnimatedMetric
          title="Dificuldade Média"
          value={65}
          suffix="%"
          trend="down"
          className="glow-blue"
        />
        <AnimatedMetric
          title="Total Variações"
          value={593}
          trend="up"
          className="glow-green"
        />
      </div>

      {/* Filtros e Busca */}
      <GlassCard>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                placeholder="Buscar keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="btn-secondary gap-2"
              >
                <Filter className="w-4 h-4" />
                Todos os Status
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="btn-secondary gap-2"
              >
                Competição
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="btn-secondary gap-2"
              >
                Ordenar por
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Lista de Keywords */}
      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-high-contrast">
            <Hash className="h-5 w-5 text-primary" />
            Keywords Principais
          </h3>

          <div className="space-y-4">
            {/* Exemplo de keywords do banco */}
            {[
              {
                keyword: "Ozempic",
                volume: 12000,
                difficulty: 75,
                status: "Ativa",
              },
              {
                keyword: "jejum intermitente como fazer",
                volume: 8500,
                difficulty: 45,
                status: "Ativa",
              },
              {
                keyword: "Calistenia",
                volume: 6200,
                difficulty: 55,
                status: "Ativa",
              },
              {
                keyword: "whey protein",
                volume: 15000,
                difficulty: 80,
                status: "Ativa",
              },
              {
                keyword: "dieta low carb cardápio",
                volume: 4300,
                difficulty: 40,
                status: "Ativa",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-high-contrast">
                    {item.keyword}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-secondary">
                    <span>Volume: {item.volume.toLocaleString()}</span>
                    <span>Dificuldade: {item.difficulty}%</span>
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <Button variant="outline" size="sm" className="btn-secondary">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="btn-secondary">
                    Variações
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-high-contrast">
              Top Keywords por Volume
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary">whey protein</span>
                <span className="text-blue-400 font-medium">15K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Ozempic</span>
                <span className="text-green-400 font-medium">12K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">jejum intermitente</span>
                <span className="text-purple-400 font-medium">8.5K</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-high-contrast">
              Oportunidades
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-300">
                  💡 22 keywords não utilizadas disponíveis
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-300">
                  ✅ Foque em keywords de baixa competição
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-300">
                  ⚠️ Considere criar variações long-tail
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
