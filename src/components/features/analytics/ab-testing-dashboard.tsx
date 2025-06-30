"use client";

import { useABTestingDashboard } from "@/lib/hooks/use-ab-testing-dashboard";
import { AbTestingHeader } from "./components/ab-testing-header";
import { AbTestingMetrics } from "./components/ab-testing-metrics";
import { AbTestingOverviewTab } from "./components/ab-testing-overview-tab";
import { AbTestingRunningTab } from "./components/ab-testing-running-tab";
import { AbTestingCompletedTab } from "./components/ab-testing-completed-tab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ABTestingDashboardProps {
  blogId: string;
}

export function ABTestingDashboard({ blogId }: ABTestingDashboardProps) {
  const {
    abTests,
    runningTests,
    completedTests,
    activeTab,
    setActiveTab,
    isCreateModalOpen,
    setIsCreateModalOpen,
    setSelectedTest,
    calculateImprovement,
    getStatusColor,
    getStatusLabel,
  } = useABTestingDashboard(blogId);

  return (
    <div className="space-y-8">
      <AbTestingHeader
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      <AbTestingMetrics
        tests={abTests}
        runningTestsCount={runningTests.length}
        completedTestsCount={completedTests.length}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="running">Testes Ativos</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>

        <AbTestingOverviewTab
          tests={abTests}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
          setSelectedTest={setSelectedTest}
        />

        <AbTestingRunningTab
          runningTests={runningTests}
          calculateImprovement={calculateImprovement}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />

        <AbTestingCompletedTab
          completedTests={completedTests}
          calculateImprovement={calculateImprovement}
        />
      </Tabs>
    </div>
  );
}
