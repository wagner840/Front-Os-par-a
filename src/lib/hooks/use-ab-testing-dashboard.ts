"use client";

import { useState } from "react";

// Tipos devem ser movidos para um arquivo de tipos dedicado (ex: src/lib/types/analytics.ts)
export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  traffic_percentage: number;
  is_control: boolean;
  conversions: number;
  visitors: number;
  conversion_rate: number;
}

export interface ABTestMetrics {
  total_visitors: number;
  total_conversions: number;
  overall_conversion_rate: number;
  confidence_level: number;
  statistical_significance: boolean;
  winner_variant?: string;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: "running" | "completed" | "paused" | "draft";
  created_at: string;
  start_date: string;
  end_date?: string;
  significance_level: number;
  minimum_sample_size: number;
  variants: ABTestVariant[];
  metrics: ABTestMetrics;
}

// Mock data
const abTests: ABTest[] = [
  {
    id: "1",
    name: "Teste de CTA Principal",
    description: "Comparando diferentes textos no botão principal",
    status: "running",
    created_at: "2024-01-15T10:00:00Z",
    start_date: "2024-01-16T00:00:00Z",
    significance_level: 95,
    minimum_sample_size: 1000,
    variants: [
      {
        id: "control",
        name: "Controle",
        description: "Saiba Mais",
        traffic_percentage: 50,
        is_control: true,
        conversions: 127,
        visitors: 2340,
        conversion_rate: 5.43,
      },
      {
        id: "variant_a",
        name: "Variante A",
        description: "Comece Agora",
        traffic_percentage: 50,
        is_control: false,
        conversions: 156,
        visitors: 2298,
        conversion_rate: 6.79,
      },
    ],
    metrics: {
      total_visitors: 4638,
      total_conversions: 283,
      overall_conversion_rate: 6.1,
      confidence_level: 87.3,
      statistical_significance: false,
    },
  },
  {
    id: "2",
    name: "Layout da Landing Page",
    description: "Testando diferentes layouts para a página de captura",
    status: "completed",
    created_at: "2024-01-01T10:00:00Z",
    start_date: "2024-01-02T00:00:00Z",
    end_date: "2024-01-14T23:59:59Z",
    significance_level: 95,
    minimum_sample_size: 2000,
    variants: [
      {
        id: "control",
        name: "Layout Atual",
        description: "Design com sidebar",
        traffic_percentage: 50,
        is_control: true,
        conversions: 245,
        visitors: 3420,
        conversion_rate: 7.16,
      },
      {
        id: "variant_b",
        name: "Layout Minimalista",
        description: "Design sem sidebar",
        traffic_percentage: 50,
        is_control: false,
        conversions: 298,
        visitors: 3380,
        conversion_rate: 8.82,
      },
    ],
    metrics: {
      total_visitors: 6800,
      total_conversions: 543,
      overall_conversion_rate: 7.99,
      confidence_level: 96.8,
      statistical_significance: true,
      winner_variant: "variant_b",
    },
  },
];

export function useABTestingDashboard(blogId: string) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);

  // Lógica para buscar dados reais iria aqui
  // const { data: abTests, isLoading } = useQuery(['abTests', blogId], fetchABTests);

  const runningTests = abTests.filter((test) => test.status === "running");
  const completedTests = abTests.filter((test) => test.status === "completed");

  const calculateImprovement = (
    control: ABTestVariant,
    variant: ABTestVariant
  ) => {
    if (control.conversion_rate === 0) return 0;
    return (
      ((variant.conversion_rate - control.conversion_rate) /
        control.conversion_rate) *
      100
    );
  };

  const getStatusColor = (status: ABTest["status"]) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "paused":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: ABTest["status"]) => {
    switch (status) {
      case "running":
        return "Em Execução";
      case "completed":
        return "Concluído";
      case "paused":
        return "Pausado";
      default:
        return "Rascunho";
    }
  };

  return {
    abTests,
    runningTests,
    completedTests,
    activeTab,
    setActiveTab,
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedTest,
    setSelectedTest,
    calculateImprovement,
    getStatusColor,
    getStatusLabel,
  };
}
