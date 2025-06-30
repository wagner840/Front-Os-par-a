"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedMetric } from "@/components/ui/animated-metric";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Eye,
  MousePointer,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Zap,
} from "lucide-react";

interface RevenueData {
  totalRevenue: number;
  dailyRevenue: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  rpm: number;
  fillRate: number;
}

interface AdPerformance {
  slotId: string;
  slotName: string;
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number;
  cpm: number;
  format: string;
  status: "active" | "paused" | "error";
}

const mockRevenueData: RevenueData = {
  totalRevenue: 2847.32,
  dailyRevenue: 142.18,
  impressions: 45230,
  clicks: 892,
  ctr: 1.97,
  cpm: 4.25,
  rpm: 2.84,
  fillRate: 94.2,
};

const mockAdPerformance: AdPerformance[] = [
  {
    slotId: "1234567890",
    slotName: "Header Leaderboard",
    impressions: 12450,
    clicks: 245,
    revenue: 890.25,
    ctr: 1.97,
    cpm: 4.85,
    format: "728x90",
    status: "active",
  },
  {
    slotId: "1234567891",
    slotName: "Sidebar Rectangle",
    impressions: 8920,
    clicks: 156,
    revenue: 456.78,
    ctr: 1.75,
    cpm: 3.92,
    format: "300x250",
    status: "active",
  },
  {
    slotId: "1234567892",
    slotName: "Article Bottom",
    impressions: 15680,
    clicks: 312,
    revenue: 672.45,
    ctr: 1.99,
    cpm: 4.12,
    format: "728x90",
    status: "active",
  },
  {
    slotId: "1234567893",
    slotName: "Mobile Banner",
    impressions: 8180,
    clicks: 179,
    revenue: 327.84,
    ctr: 2.19,
    cpm: 3.85,
    format: "320x50",
    status: "paused",
  },
];

export function RevenueDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    const data = {
      revenue: mockRevenueData,
      adPerformance: mockAdPerformance,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-report-${timeRange}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "paused":
        return "Pausado";
      case "error":
        return "Erro";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard de Receita
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitore a performance dos seus anúncios e receita em tempo real
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Hoje</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>

          <AnimatedButton
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </AnimatedButton>

          <AnimatedButton
            variant="primary"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </AnimatedButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <AnimatedMetric
              label="Receita Total"
              value={mockRevenueData.totalRevenue}
              trend="up"
              trendValue="+12.5%"
              icon={<DollarSign className="w-5 h-5" />}
              prefix="R$ "
            />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <AnimatedMetric
              label="Receita Diária"
              value={mockRevenueData.dailyRevenue}
              trend="up"
              trendValue="+8.3%"
              icon={<Calendar className="w-5 h-5" />}
              prefix="R$ "
            />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <AnimatedMetric
              label="CPM Médio"
              value={mockRevenueData.cpm}
              trend="up"
              trendValue="+5.2%"
              icon={<Target className="w-5 h-5" />}
              prefix="R$ "
            />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6">
            <AnimatedMetric
              label="CTR Médio"
              value={mockRevenueData.ctr}
              trend="up"
              trendValue="+2.1%"
              icon={<MousePointer className="w-5 h-5" />}
              suffix="%"
            />
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <AnimatedMetric
            label="Impressões"
            value={mockRevenueData.impressions}
            trend="up"
            trendValue="+15.7%"
            icon={<Eye className="w-5 h-5" />}
          />
        </GlassCard>

        <GlassCard className="p-6">
          <AnimatedMetric
            label="Cliques"
            value={mockRevenueData.clicks}
            trend="up"
            trendValue="+18.2%"
            icon={<MousePointer className="w-5 h-5" />}
          />
        </GlassCard>

        <GlassCard className="p-6">
          <AnimatedMetric
            label="RPM"
            value={mockRevenueData.rpm}
            trend="up"
            trendValue="+7.4%"
            icon={<BarChart3 className="w-5 h-5" />}
            prefix="R$ "
          />
        </GlassCard>

        <GlassCard className="p-6">
          <AnimatedMetric
            label="Fill Rate"
            value={mockRevenueData.fillRate}
            trend="neutral"
            trendValue="0%"
            icon={<Zap className="w-5 h-5" />}
            suffix="%"
          />
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Performance por Slot de Anúncio
          </h2>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {mockAdPerformance.length} slots ativos
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Slot
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Formato
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Impressões
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Cliques
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  CTR
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  CPM
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  Receita
                </th>
              </tr>
            </thead>
            <tbody>
              {mockAdPerformance.map((slot, index) => (
                <motion.tr
                  key={slot.slotId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium">{slot.slotName}</div>
                      <div className="text-sm text-gray-500">{slot.slotId}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline">{slot.format}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          slot.status
                        )}`}
                      />
                      <span className="text-sm">
                        {getStatusText(slot.status)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    {slot.impressions.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    {slot.clicks.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    {slot.ctr.toFixed(2)}%
                  </td>
                  <td className="py-4 px-4 text-right font-mono">
                    R$ {slot.cpm.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-green-600 dark:text-green-400">
                    R$ {slot.revenue.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Dicas de Otimização</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-300">
                CTR Alto no Mobile
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Considere aumentar a frequência de anúncios mobile para
                maximizar receita.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Target className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900 dark:text-green-300">
                CPM em Alta
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Ótima performance nos últimos 7 dias. Mantenha a estratégia
                atual.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
