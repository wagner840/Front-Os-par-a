"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import type { AnalyticsFilters as FilterType } from "@/lib/hooks/use-analytics";

interface AnalyticsFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

export function AnalyticsFilters({
  filters,
  onFiltersChange,
}: AnalyticsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (
    key: keyof FilterType,
    value: string | { start?: string; end?: string }
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
    });
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.dateRange ||
    filters.authorId ||
    filters.category;

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="font-medium">Filtros</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Ativos
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs gap-1"
            >
              <X className="h-3 w-3" />
              Limpar
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? "Menos" : "Mais"} filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="published">Publicados</SelectItem>
              <SelectItem value="draft">Rascunhos</SelectItem>
              <SelectItem value="scheduled">Agendados</SelectItem>
              <SelectItem value="archived">Arquivados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        {isExpanded && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.dateRange?.start || ""}
                onChange={(e) =>
                  updateFilter("dateRange", {
                    ...filters.dateRange,
                    start: e.target.value,
                  })
                }
                className="text-xs"
              />
              <Input
                type="date"
                value={filters.dateRange?.end || ""}
                onChange={(e) =>
                  updateFilter("dateRange", {
                    ...filters.dateRange,
                    end: e.target.value,
                  })
                }
                className="text-xs"
              />
            </div>
          </div>
        )}

        {/* Category Filter */}
        {isExpanded && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Input
              placeholder="Filtrar por categoria"
              value={filters.category || ""}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="text-xs"
            />
          </div>
        )}

        {/* Author Filter */}
        {isExpanded && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Autor</label>
            <Input
              placeholder="Filtrar por autor"
              value={filters.authorId || ""}
              onChange={(e) => updateFilter("authorId", e.target.value)}
              className="text-xs"
            />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
