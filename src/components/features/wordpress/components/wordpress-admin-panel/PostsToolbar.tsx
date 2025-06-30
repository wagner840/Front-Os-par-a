"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Search, List, Grid, Zap, RefreshCw } from "lucide-react";

interface PostsToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  selectedPosts: number[];
  bulkAction: any;
  setBulkAction: (action: any) => void;
  handleBulkAction: () => void;
  isProcessing: boolean;
  filteredPosts?: any[];
  handleSelectAll: (checked: boolean) => void;
}

export function PostsToolbar({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  viewMode,
  setViewMode,
  selectedPosts,
  bulkAction,
  setBulkAction,
  handleBulkAction,
  isProcessing,
  filteredPosts = [],
  handleSelectAll,
}: PostsToolbarProps) {
  return (
    <GlassCard className="p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
          <Input
            placeholder="Buscar posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="all">Todos Status</option>
            <option value="publish">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="future">Agendados</option>
            <option value="pending">Pendentes</option>
            <option value="private">Privados</option>
            <option value="trash">Lixeira</option>
          </select>

          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="w-4 h-4" />
            ) : (
              <Grid className="w-4 h-4" />
            )}
          </AnimatedButton>
        </div>

        {/* Ações em Massa */}
        {selectedPosts.length > 0 && (
          <div className="flex gap-2">
            <select
              onChange={(e) => setBulkAction(JSON.parse(e.target.value))}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">Ação em massa...</option>
              <option value='{"action":"status","value":"publish"}'>
                Publicar
              </option>
              <option value='{"action":"status","value":"draft"}'>
                Tornar Rascunho
              </option>
              <option value='{"action":"status","value":"trash"}'>
                Mover para Lixeira
              </option>
              <option value='{"action":"delete","value":true}'>
                Deletar Permanentemente
              </option>
            </select>

            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={handleBulkAction}
              disabled={!bulkAction || isProcessing}
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Aplicar ({selectedPosts.length})
                </>
              )}
            </AnimatedButton>
          </div>
        )}
      </div>

      {/* Checkbox Selecionar Todos */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={
            selectedPosts.length === filteredPosts.length &&
            filteredPosts.length > 0
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-white/60 text-sm">
          Selecionar todos ({filteredPosts.length || 0} posts)
        </span>
      </div>
    </GlassCard>
  );
}
