"use client";

import { useContentOpportunitiesDashboard } from "@/lib/hooks/use-content-opportunities-dashboard";
import OpportunityHeader from "./components/opportunity-header";
import OpportunityStats from "./components/opportunity-stats";
import OpportunityFilters from "./components/opportunity-filters";
import { OpportunityResults } from "./components/opportunity-results";
import { OpportunityTabs } from "./components/opportunity-tabs";

interface ContentOpportunitiesDashboardProps {
  blogId?: string;
}

export function ContentOpportunitiesDashboard({
  blogId,
}: ContentOpportunitiesDashboardProps) {
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    semanticSearch,
    setSemanticSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    selectedMainKeyword,
    setSelectedMainKeyword,
    sortBy,
    setSortBy,
    showSemanticResults,
    setShowSemanticResults,
    stats,
    mainKeywords,
    categoriesOpportunities,
    loadingCategories,
    clustersOpportunities,
    loadingClusters,
    keywordOpportunities,
    semanticResults,
    semanticLoading,
    handleSemanticSearch,
  } = useContentOpportunitiesDashboard(blogId);

  return (
    <div className="space-y-6">
      <OpportunityHeader />

      {stats && <OpportunityStats stats={stats} />}

      <OpportunityFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedMainKeyword={selectedMainKeyword}
        setSelectedMainKeyword={setSelectedMainKeyword}
        mainKeywords={mainKeywords}
        semanticSearch={semanticSearch}
        setSemanticSearch={setSemanticSearch}
        handleSemanticSearch={handleSemanticSearch}
        semanticLoading={semanticLoading}
      />

      <OpportunityResults
        showSemanticResults={showSemanticResults}
        semanticResults={semanticResults}
        setShowSemanticResults={setShowSemanticResults}
        selectedMainKeyword={selectedMainKeyword}
        keywordOpportunities={keywordOpportunities}
      />

      <OpportunityTabs
        activeTab={activeTab}
        onTabChange={(value) =>
          setActiveTab(value as "categories" | "clusters")
        }
        categoriesOpportunities={categoriesOpportunities || []}
        loadingCategories={loadingCategories}
        clustersOpportunities={clustersOpportunities || []}
        loadingClusters={loadingClusters}
      />
    </div>
  );
}
