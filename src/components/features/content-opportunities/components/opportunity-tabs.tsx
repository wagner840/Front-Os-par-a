"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Layers } from "lucide-react";
import OpportunityGrid from "./opportunity-grid";

interface OpportunityTabsProps {
  activeTab: "categories" | "clusters";
  onTabChange: (value: string) => void;
  categoriesOpportunities: any[];
  loadingCategories: boolean;
  clustersOpportunities: any[];
  loadingClusters: boolean;
}

export function OpportunityTabs({
  activeTab,
  onTabChange,
  categoriesOpportunities,
  loadingCategories,
  clustersOpportunities,
  loadingClusters,
}: OpportunityTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="flex items-center justify-between">
        <TabsList className="grid w-auto grid-cols-2">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="clusters" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Clusters
          </TabsTrigger>
        </TabsList>

        <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      <TabsContent value="categories" className="space-y-4">
        <OpportunityGrid
          opportunities={categoriesOpportunities || []}
          isLoading={loadingCategories}
          type="categories"
        />
      </TabsContent>

      <TabsContent value="clusters" className="space-y-4">
        <OpportunityGrid
          opportunities={clustersOpportunities || []}
          isLoading={loadingClusters}
          type="clusters"
        />
      </TabsContent>
    </Tabs>
  );
}
