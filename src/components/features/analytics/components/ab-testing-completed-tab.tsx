"use client";

import { TabsContent } from "@/components/ui/tabs";
import { CompletedTestCard } from "./completed-test-card";
import { Award } from "lucide-react";
import type {
  ABTest,
  ABTestVariant,
} from "@/lib/hooks/use-ab-testing-dashboard";

interface AbTestingCompletedTabProps {
  completedTests: ABTest[];
  calculateImprovement: (
    control: ABTestVariant,
    variant: ABTestVariant
  ) => number;
}

export function AbTestingCompletedTab({
  completedTests,
  calculateImprovement,
}: AbTestingCompletedTabProps) {
  return (
    <TabsContent value="completed" className="space-y-6">
      {completedTests.length > 0 ? (
        <div className="space-y-4">
          {completedTests.map((test, index) => (
            <CompletedTestCard
              key={test.id}
              test={test}
              index={index}
              calculateImprovement={calculateImprovement}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Nenhum teste concluído
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Os resultados dos testes finalizados aparecerão aqui.
          </p>
        </div>
      )}
    </TabsContent>
  );
}
