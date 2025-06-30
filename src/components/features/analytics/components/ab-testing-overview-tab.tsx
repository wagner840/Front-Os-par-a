"use client";

import { TabsContent } from "@/components/ui/tabs";
import { OverviewTestCard } from "./overview-test-card";
import type { ABTest } from "@/lib/hooks/use-ab-testing-dashboard";

interface AbTestingOverviewTabProps {
  tests: ABTest[];
  getStatusColor: (status: ABTest["status"]) => string;
  getStatusLabel: (status: ABTest["status"]) => string;
  setSelectedTest: (test: ABTest | null) => void;
}

export function AbTestingOverviewTab({
  tests,
  getStatusColor,
  getStatusLabel,
  setSelectedTest,
}: AbTestingOverviewTabProps) {
  return (
    <TabsContent value="overview" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.slice(0, 4).map((test, index) => (
          <OverviewTestCard
            key={test.id}
            test={test}
            index={index}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            onSelectTest={setSelectedTest}
          />
        ))}
      </div>
    </TabsContent>
  );
}
