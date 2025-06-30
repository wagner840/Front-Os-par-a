"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./use-supabase";
import { useAppStore } from "../stores/app-store";
import { toast } from "sonner";

// Interfaces para monetização
export interface AdSlot {
  id: string;
  name: string;
  slot_id: string;
  format: string;
  width: number;
  height: number;
  position: "header" | "sidebar" | "content" | "footer" | "mobile";
  status: "active" | "paused" | "error";
  created_at: string;
  updated_at: string;
}

export interface RevenueMetrics {
  totalRevenue: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  rpm: number;
  fillRate: number;
  viewabilityRate: number;
}

export interface AdPerformance {
  slotId: string;
  slotName: string;
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number;
  cpm: number;
  rpm: number;
  viewability: number;
  format: string;
  position: string;
  status: "active" | "paused" | "error";
  lastUpdated: string;
}

export interface AdConfiguration {
  adsenseId: string;
  adManagerId?: string;
  headerBiddingEnabled: boolean;
  lazyLoadingEnabled: boolean;
  refreshInterval: number;
  maxRefreshes: number;
  viewabilityThreshold: number;
  autoOptimization: boolean;
  adBlockDetection: boolean;
  gdprCompliant: boolean;
}

// Hook principal para métricas de receita
export function useRevenueMetrics(timeRange: string = "7d") {
  const { user } = useAppStore();

  return useQuery({
    queryKey: ["revenue-metrics", timeRange, user?.id],
    queryFn: async (): Promise<RevenueMetrics> => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const mockData: RevenueMetrics = {
        totalRevenue: 2847.32,
        dailyRevenue: 142.18,
        monthlyRevenue: 8541.96,
        impressions: 45230,
        clicks: 892,
        ctr: 1.97,
        cpm: 4.25,
        rpm: 2.84,
        fillRate: 94.2,
        viewabilityRate: 87.5,
      };

      return mockData;
    },
    enabled: !!user?.id,
    refetchInterval: 5 * 60 * 1000,
  });
}

// Hook para performance de slots de anúncio
export function useAdPerformance(timeRange: string = "7d") {
  const { user } = useAppStore();

  return useQuery({
    queryKey: ["ad-performance", timeRange, user?.id],
    queryFn: async (): Promise<AdPerformance[]> => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const mockData: AdPerformance[] = [
        {
          slotId: "1234567890",
          slotName: "Header Leaderboard",
          impressions: 12450,
          clicks: 245,
          revenue: 890.25,
          ctr: 1.97,
          cpm: 4.85,
          rpm: 3.12,
          viewability: 89.2,
          format: "728x90",
          position: "header",
          status: "active",
          lastUpdated: new Date().toISOString(),
        },
        {
          slotId: "1234567891",
          slotName: "Sidebar Rectangle",
          impressions: 8920,
          clicks: 156,
          revenue: 456.78,
          ctr: 1.75,
          cpm: 3.92,
          rpm: 2.45,
          viewability: 92.1,
          format: "300x250",
          position: "sidebar",
          status: "active",
          lastUpdated: new Date().toISOString(),
        },
      ];

      return mockData;
    },
    enabled: !!user?.id,
    refetchInterval: 10 * 60 * 1000,
  });
}

// Hook para configuração de anúncios
export function useAdConfiguration() {
  const { user } = useAppStore();

  return useQuery({
    queryKey: ["ad-configuration", user?.id],
    queryFn: async (): Promise<AdConfiguration> => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const defaultConfig: AdConfiguration = {
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
      };

      return defaultConfig;
    },
    enabled: !!user?.id,
  });
}

// Hook para atualizar configuração de anúncios
export function useUpdateAdConfiguration() {
  const { user } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<AdConfiguration>) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      return config;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-configuration"] });
      toast.success("Configuração de anúncios atualizada com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao atualizar configuração:", error);
      toast.error("Erro ao atualizar configuração de anúncios");
    },
  });
}

// Hook para slots de anúncio
export function useAdSlots() {
  const supabase = useSupabase();
  const { user } = useAppStore();

  return useQuery({
    queryKey: ["ad-slots", user?.id],
    queryFn: async (): Promise<AdSlot[]> => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from("ad_slots")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}

// Hook para criar slot de anúncio
export function useCreateAdSlot() {
  const supabase = useSupabase();
  const { user } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      slot: Omit<AdSlot, "id" | "created_at" | "updated_at">
    ) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from("ad_slots")
        .insert({
          ...slot,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-slots"] });
      toast.success("Slot de anúncio criado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao criar slot:", error);
      toast.error("Erro ao criar slot de anúncio");
    },
  });
}

// Hook para atualizar slot de anúncio
export function useUpdateAdSlot() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<AdSlot> & { id: string }) => {
      const { data, error } = await supabase
        .from("ad_slots")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-slots"] });
      toast.success("Slot de anúncio atualizado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao atualizar slot:", error);
      toast.error("Erro ao atualizar slot de anúncio");
    },
  });
}

// Hook para deletar slot de anúncio
export function useDeleteAdSlot() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ad_slots").delete().eq("id", id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-slots"] });
      toast.success("Slot de anúncio removido com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao deletar slot:", error);
      toast.error("Erro ao remover slot de anúncio");
    },
  });
}

// Hook para otimização automática
export function useAutoOptimization() {
  const supabase = useSupabase();
  const { user } = useAppStore();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      // Simular otimização automática
      // Em produção, isso executaria algoritmos de ML para otimizar posicionamento,
      // refresh rates, e configurações de anúncios baseado na performance

      await new Promise((resolve) => setTimeout(resolve, 3000));

      return {
        optimizationsApplied: 5,
        estimatedRevenueIncrease: 12.5,
        recommendations: [
          "Aumentar refresh rate do header banner",
          "Reduzir viewability threshold para mobile",
          "Ativar lazy loading no sidebar",
          "Otimizar posicionamento do rectangle",
          "Ajustar configurações de header bidding",
        ],
      };
    },
    onSuccess: (data) => {
      toast.success(
        `Otimização concluída! ${data.optimizationsApplied} melhorias aplicadas. ` +
          `Aumento estimado de receita: +${data.estimatedRevenueIncrease}%`
      );
    },
    onError: (error: Error) => {
      console.error("Erro na otimização:", error);
      toast.error("Erro ao executar otimização automática");
    },
  });
}

// Hook para exportar dados de receita
export function useExportRevenueData() {
  const { user } = useAppStore();

  return useMutation({
    mutationFn: async (format: "csv" | "json" = "csv") => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const data = {
        user_id: user.id,
        export_date: new Date().toISOString(),
        revenue_metrics: {
          totalRevenue: 2847.32,
          dailyRevenue: 142.18,
          monthlyRevenue: 8541.96,
          impressions: 45230,
          clicks: 892,
          ctr: 1.97,
          cpm: 4.25,
          rpm: 2.84,
          fillRate: 94.2,
        },
      };

      if (format === "csv") {
        const csvContent = [
          "Métrica,Valor",
          `Receita Total,R$ ${data.revenue_metrics.totalRevenue}`,
          `Receita Diária,R$ ${data.revenue_metrics.dailyRevenue}`,
          `Receita Mensal,R$ ${data.revenue_metrics.monthlyRevenue}`,
          `Impressões,${data.revenue_metrics.impressions}`,
          `Cliques,${data.revenue_metrics.clicks}`,
          `CTR,${data.revenue_metrics.ctr}%`,
          `CPM,R$ ${data.revenue_metrics.cpm}`,
          `RPM,R$ ${data.revenue_metrics.rpm}`,
          `Fill Rate,${data.revenue_metrics.fillRate}%`,
        ].join("\n");

        return csvContent;
      }

      return JSON.stringify(data, null, 2);
    },
    onSuccess: (data, variables) => {
      const blob = new Blob([data], {
        type: variables === "csv" ? "text/csv" : "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revenue-export-${
        new Date().toISOString().split("T")[0]
      }.${variables}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Dados de receita exportados com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao exportar dados:", error);
      toast.error("Erro ao exportar dados de receita");
    },
  });
}
