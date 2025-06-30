
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Search, Filter, RefreshCw, X } from "lucide-react";

export default function PostsTableHeader({
  tempFilters,
  handleQuickSearch,
  showFilters,
  setShowFilters,
  getActiveFiltersCount,
  handleApplyFilters,
  handleClearFilters,
  refetch,
  setTempFilters,
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar posts..."
              value={tempFilters.search || ""}
              onChange={(e) => handleQuickSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 flex-1 sm:flex-none"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 flex-1 sm:flex-none"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-t border-white/20 pt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Status
                </label>
                <select
                  value={tempFilters.status || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      status: (e.target.value as any) || undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Agendado</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Palavra-chave Foco
                </label>
                <Input
                  placeholder="Ex: melhor notebook"
                  value={tempFilters.focus_keyword || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      focus_keyword: e.target.value || undefined,
                    }))
                  }
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  SEO Score (min)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={tempFilters.seo_score_min || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      seo_score_min: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  SEO Score (max)
                </label>
                <Input
                  type="number"
                  placeholder="100"
                  min="0"
                  max="100"
                  value={tempFilters.seo_score_max || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      seo_score_max: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4 pt-4 border-t border-white/20">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleApplyFilters}
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Aplicar Filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  Limpar
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowFilters(false)}
                size="sm"
                className="w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Fechar Filtros
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
