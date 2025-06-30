"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useAdConfiguration,
  useUpdateAdConfiguration,
} from "@/lib/hooks/use-monetization";
import {
  Settings,
  Shield,
  Zap,
  Target,
  Eye,
  Clock,
  BarChart3,
  Save,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export function AdConfiguration() {
  const [activeTab, setActiveTab] = useState<
    "basic" | "advanced" | "compliance"
  >("basic");
  const [formData, setFormData] = useState({
    adsenseId: "",
    adManagerId: "",
    headerBiddingEnabled: false,
    lazyLoadingEnabled: true,
    refreshInterval: 30,
    maxRefreshes: 3,
    viewabilityThreshold: 50,
    autoOptimization: true,
    adBlockDetection: true,
    gdprCompliant: true,
  });

  const { data: config, isLoading } = useAdConfiguration();
  const updateConfig = useUpdateAdConfiguration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig.mutate(formData);
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tabs = [
    {
      id: "basic",
      label: "Configuração Básica",
      icon: Settings,
      description: "IDs e configurações principais",
    },
    {
      id: "advanced",
      label: "Configurações Avançadas",
      icon: Zap,
      description: "Otimizações e performance",
    },
    {
      id: "compliance",
      label: "Conformidade",
      icon: Shield,
      description: "GDPR e políticas",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Configuração de Anúncios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Configure seus anúncios para maximizar receita e performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Configurado
          </Badge>
        </div>
      </div>

      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white/20 text-primary shadow-glass"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "basic" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                IDs de Configuração
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adsenseId">ID do Google AdSense *</Label>
                  <Input
                    id="adsenseId"
                    placeholder="ca-pub-1234567890123456"
                    value={formData.adsenseId}
                    onChange={(e) =>
                      handleInputChange("adsenseId", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adManagerId">ID do Google Ad Manager</Label>
                  <Input
                    id="adManagerId"
                    placeholder="/12345678/exemplo"
                    value={formData.adManagerId}
                    onChange={(e) =>
                      handleInputChange("adManagerId", e.target.value)
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Opcional - Para configurações avançadas
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Configurações de Exibição
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Carregamento Lazy</Label>
                      <p className="text-xs text-gray-500">
                        Carrega anúncios apenas quando visíveis
                      </p>
                    </div>
                    <Switch
                      checked={formData.lazyLoadingEnabled}
                      onCheckedChange={(checked) =>
                        handleInputChange("lazyLoadingEnabled", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Otimização Automática</Label>
                      <p className="text-xs text-gray-500">
                        Ajustes automáticos para melhor performance
                      </p>
                    </div>
                    <Switch
                      checked={formData.autoOptimization}
                      onCheckedChange={(checked) =>
                        handleInputChange("autoOptimization", checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="viewabilityThreshold">
                      Limite de Visibilidade (%)
                    </Label>
                    <Input
                      id="viewabilityThreshold"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.viewabilityThreshold}
                      onChange={(e) =>
                        handleInputChange(
                          "viewabilityThreshold",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <p className="text-xs text-gray-500">
                      Mínimo de visibilidade para contar impressão
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "advanced" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Configurações de Refresh
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">
                    Intervalo de Refresh (segundos)
                  </Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="10"
                    max="120"
                    value={formData.refreshInterval}
                    onChange={(e) =>
                      handleInputChange(
                        "refreshInterval",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Tempo entre atualizações automáticas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxRefreshes">Máximo de Refreshes</Label>
                  <Input
                    id="maxRefreshes"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxRefreshes}
                    onChange={(e) =>
                      handleInputChange(
                        "maxRefreshes",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Limite de atualizações por sessão
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Header Bidding
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Ativar Header Bidding</Label>
                    <p className="text-xs text-gray-500">
                      Melhora receita através de leilões em tempo real
                    </p>
                  </div>
                  <Switch
                    checked={formData.headerBiddingEnabled}
                    onCheckedChange={(checked) =>
                      handleInputChange("headerBiddingEnabled", checked)
                    }
                  />
                </div>

                {formData.headerBiddingEnabled && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-300">
                          Header Bidding Ativado
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                          Esta configuração pode aumentar significativamente sua
                          receita, mas requer configuração adicional no Google
                          Ad Manager.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "compliance" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Conformidade e Privacidade
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Conformidade GDPR</Label>
                    <p className="text-xs text-gray-500">
                      Respeita regulamentações de privacidade européias
                    </p>
                  </div>
                  <Switch
                    checked={formData.gdprCompliant}
                    onCheckedChange={(checked) =>
                      handleInputChange("gdprCompliant", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Detecção de Ad Block</Label>
                    <p className="text-xs text-gray-500">
                      Detecta e responde a bloqueadores de anúncios
                    </p>
                  </div>
                  <Switch
                    checked={formData.adBlockDetection}
                    onCheckedChange={(checked) =>
                      handleInputChange("adBlockDetection", checked)
                    }
                  />
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-300">
                        Configuração Segura
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Suas configurações estão em conformidade com as melhores
                        práticas de privacidade e regulamentações.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <AnimatedButton
            type="button"
            variant="secondary"
            onClick={() =>
              setFormData({
                adsenseId: "",
                adManagerId: "",
                headerBiddingEnabled: false,
                lazyLoadingEnabled: true,
                refreshInterval: 30,
                maxRefreshes: 3,
                viewabilityThreshold: 50,
                autoOptimization: true,
                adBlockDetection: true,
                gdprCompliant: true,
              })
            }
          >
            Resetar
          </AnimatedButton>

          <AnimatedButton
            type="submit"
            variant="primary"
            disabled={updateConfig.isPending}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {updateConfig.isPending ? "Salvando..." : "Salvar Configurações"}
          </AnimatedButton>
        </div>
      </form>
    </div>
  );
}
