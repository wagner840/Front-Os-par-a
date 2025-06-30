"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, RefreshCw, Search } from "lucide-react";

interface KeywordsTableHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  onRefresh: () => void;
  activeFiltersCount: number;
}

export function KeywordsTableHeader({
  searchTerm,
  onSearchChange,
  onToggleFilters,
  onRefresh,
  activeFiltersCount,
}: KeywordsTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>
    </div>
  );
}
