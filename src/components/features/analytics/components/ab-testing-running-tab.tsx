"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { TestTube, Pause, RotateCcw, BarChart3, Plus } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { RunningTestCard } from "./running-test-card";
import type {
  ABTest,
  ABTestVariant,
} from "@/lib/hooks/use-ab-testing-dashboard";

interface AbTestingRunningTabProps {
  runningTests: ABTest[];
  calculateImprovement: (
    control: ABTestVariant,
    variant: ABTestVariant
  ) => number;
  getStatusColor: (status: ABTest["status"]) => string;
  getStatusLabel: (status: ABTest["status"]) => string;
  setIsCreateModalOpen: (isOpen: boolean) => void;
}

export function AbTestingRunningTab({
  runningTests,
  calculateImprovement,
  getStatusColor,
  getStatusLabel,
  setIsCreateModalOpen,
}: AbTestingRunningTabProps) {
  return (
    <TabsContent value="running" className="space-y-6">
      {runningTests.length > 0 ? (
        <div className="space-y-6">
          {runningTests.map((test, index) => (
            <RunningTestCard
              key={test.id}
              test={test}
              index={index}
              calculateImprovement={calculateImprovement}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Nenhum teste ativo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Crie um novo teste A/B para começar a otimizar suas conversões.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Teste
          </Button>
        </div>
      )}
    </TabsContent>
  );
}
