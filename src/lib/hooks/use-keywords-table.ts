"use client";

import { useState, useEffect } from "react";
import {
  useKeywords,
  useDeleteKeyword,
  type KeywordFilters,
} from "@/lib/hooks/use-keywords";
import { useAppStore } from "@/lib/stores/app-store";

const initialFilterState: Omit<KeywordFilters, "blogId"> = {
  search: "",
  status: undefined,
  competition: undefined,
  searchIntent: undefined,
  difficulty_min: undefined,
  difficulty_max: undefined,
  volume_min: undefined,
  volume_max: undefined,
  sortBy: "keyword",
  sortOrder: "asc",
  limit: 50,
};

export function useKeywordsTable(initialFilters?: Partial<KeywordFilters>) {
  const { selectedBlog } = useAppStore();

  const [showFilters, setShowFilters] = useState(false);

  const [tempFilters, setTempFilters] = useState<KeywordFilters>({
    ...initialFilterState,
    blogId: selectedBlog || "all",
    ...initialFilters,
  });

  const [appliedFilters, setAppliedFilters] =
    useState<KeywordFilters>(tempFilters);

  const { data: keywords, isLoading, refetch } = useKeywords(appliedFilters);
  const deleteKeyword = useDeleteKeyword();

  useEffect(() => {
    const newBlogId = selectedBlog || "all";
    setTempFilters((prev) => ({ ...prev, blogId: newBlogId }));
    setAppliedFilters((prev) => ({ ...prev, blogId: newBlogId }));
  }, [selectedBlog]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: KeywordFilters = {
      ...initialFilterState,
      blogId: selectedBlog || "all",
    };
    setTempFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  const handleQuickSearch = (value: string) => {
    const newFilters = { ...appliedFilters, search: value };
    setTempFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const handleSort = (field: KeywordFilters["sortBy"]) => {
    const newOrder =
      appliedFilters.sortBy === field && appliedFilters.sortOrder === "asc"
        ? "desc"
        : "asc";
    const newFilters = {
      ...appliedFilters,
      sortBy: field,
      sortOrder: newOrder,
    };
    setAppliedFilters(newFilters);
    setTempFilters(newFilters);
  };

  const handleDelete = async (id: string) => {
    // A confirmação pode ser movida para o componente de UI
    await deleteKeyword.mutateAsync(id);
    refetch();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (appliedFilters.search) count++;
    if (appliedFilters.status) count++;
    if (appliedFilters.competition) count++;
    if (appliedFilters.searchIntent) count++;
    if (appliedFilters.difficulty_min !== undefined) count++;
    if (appliedFilters.difficulty_max !== undefined) count++;
    if (appliedFilters.volume_min !== undefined) count++;
    if (appliedFilters.volume_max !== undefined) count++;
    return count;
  };

  return {
    selectedBlog,
    showFilters,
    setShowFilters,
    tempFilters,
    setTempFilters,
    appliedFilters,
    keywords,
    isLoading,
    refetch,
    deleteKeyword,
    handleApplyFilters,
    handleClearFilters,
    handleQuickSearch,
    handleSort,
    handleDelete,
    getActiveFiltersCount,
  };
}

// Funções de formatação podem ser movidas para um arquivo de utils
export const getDifficultyColor = (difficulty: number | null) => {
  if (!difficulty) return "text-gray-500";
  if (difficulty <= 30) return "text-green-600";
  if (difficulty <= 60) return "text-yellow-600";
  return "text-red-600";
};

export const getCompetitionColor = (competition: string | null) => {
  if (!competition) return "secondary";
  switch (competition.toUpperCase()) {
    case "LOW":
      return "default";
    case "MEDIUM":
      return "secondary";
    case "HIGH":
      return "destructive";
    default:
      return "secondary";
  }
};

export const formatNumber = (num: number | null) => {
  if (num === null || num === undefined) return "-";
  return new Intl.NumberFormat("pt-BR").format(num);
};

export const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
