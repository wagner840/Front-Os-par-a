"use client";

import { AnimatedMetric } from "@/components/ui/animated-metric";
import { Award, TestTube2 as TestTube, Users, Target } from "lucide-react";
import type { ABTest } from "@/lib/hooks/use-ab-testing-dashboard";

interface AbTestingMetricsProps {
  tests: ABTest[];
  runningTestsCount: number;
  completedTestsCount: number;
}

export function AbTestingMetrics({
  tests,
  runningTestsCount,
  completedTestsCount,
}: AbTestingMetricsProps) {
  const totalVisitors = tests.reduce(
    (acc, test) => acc + test.metrics.total_visitors,
    0
  );

  const totalConversions = tests.reduce(
    (acc, test) => acc + test.metrics.total_conversions,
    0
  );

  const averageConversionRate =
    totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnimatedMetric
        title="Testes Ativos"
        value={runningTestsCount}
        icon={<TestTube className="w-5 h-5" />}
        variant="success"
      />
      <AnimatedMetric
        title="Testes Concluídos"
        value={completedTestsCount}
        icon={<Award className="w-5 h-5" />}
        variant="info"
      />
      <AnimatedMetric
        title="Total de Visitantes"
        value={totalVisitors}
        icon={<Users className="w-5 h-5" />}
      />
      <AnimatedMetric
        title="Taxa de Conversão Média"
        value={averageConversionRate}
        suffix="%"
        icon={<Target className="w-5 h-5" />}
      />
    </div>
  );
}
