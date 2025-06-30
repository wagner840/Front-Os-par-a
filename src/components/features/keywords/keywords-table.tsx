"use client";

import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  useKeywords,
  useDeleteKeyword,
  type KeywordFilters,
} from "@/lib/hooks/use-keywords";
import { useAppStore } from "@/lib/stores/app-store";
import { motion, AnimatePresence } from "framer-motion";
import type { Database } from "@/lib/types/database";

type MainKeyword = Database["public"]["Tables"]["main_keywords"]["Row"];

interface KeywordsTableProps {
  initialFilters?: KeywordFilters;
}

export function KeywordsTable({ initialFilters }: KeywordsTableProps) {
  const { selectedBlog } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  // Estados dos filtros
  const [tempFilters, setTempFilters] = useState<KeywordFilters>({
    blogId: selectedBlog || "all",
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
    ...initialFilters,
  });

  const [appliedFilters, setAppliedFilters] =
    useState<KeywordFilters>(tempFilters);

  // Hooks
  const { data: keywords, isLoading, refetch } = useKeywords(appliedFilters);
  const deleteKeyword = useDeleteKeyword();

  // Atualizar filtros quando o blog selecionado mudar
  useEffect(() => {
    const newBlogId = selectedBlog || "all";
    setTempFilters((prev) => ({ ...prev, blogId: newBlogId }));
    setAppliedFilters((prev) => ({ ...prev, blogId: newBlogId }));
  }, [selectedBlog]);

  // Aplicar filtros
  const handleApplyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setShowFilters(false);
  };

  // Limpar filtros
  const handleClearFilters = () => {
    const clearedFilters: KeywordFilters = {
      blogId: selectedBlog || "all",
      search: "",
      sortBy: "keyword",
      sortOrder: "asc",
      limit: 50,
    };
    setTempFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  // Pesquisa rápida (aplicada automaticamente)
  const handleQuickSearch = (value: string) => {
    setTempFilters((prev) => ({ ...prev, search: value }));
    setAppliedFilters((prev) => ({ ...prev, search: value }));
  };

  // Ordenação
  const handleSort = (field: KeywordFilters["sortBy"]) => {
    const newOrder =
      appliedFilters.sortBy === field && appliedFilters.sortOrder === "asc"
        ? ("desc" as "desc")
        : ("asc" as "asc");
    const newFilters = {
      ...appliedFilters,
      sortBy: field,
      sortOrder: newOrder,
    };
    setAppliedFilters(newFilters);
    setTempFilters(newFilters);
  };

  const getSortIcon = (field: KeywordFilters["sortBy"]) => {
    if (appliedFilters.sortBy !== field)
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return appliedFilters.sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-500" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-500" />
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta keyword?")) {
      try {
        await deleteKeyword.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error("Erro ao deletar keyword:", error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      researching: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return variants[status as keyof typeof variants] || variants.inactive;
  };

  const getDifficultyColor = (difficulty: number | null) => {
    if (!difficulty) return "text-gray-500";
    if (difficulty <= 30) return "text-green-600";
    if (difficulty <= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompetitionColor = (competition: string | null) => {
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

  const formatNumber = (num: number | null) => {
    if (!num) return "-";
    return new Intl.NumberFormat("pt-BR").format(num);
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
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

  if (isLoading) {
    return (
      <GlassCard className="p-8">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Carregando keywords...</span>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com pesquisa e filtros */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar keywords..."
                value={tempFilters.search || ""}
                onChange={(e) => handleQuickSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
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
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Painel de filtros */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 border-t border-white/20 pt-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Competição
                  </label>
                  <select
                    value={tempFilters.competition || ""}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        competition: (e.target.value as any) || undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas</option>
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Intenção de Busca
                  </label>
                  <select
                    value={tempFilters.searchIntent || ""}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        searchIntent: (e.target.value as any) || undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas</option>
                    <option value="informational">Informacional</option>
                    <option value="navigational">Navegacional</option>
                    <option value="commercial">Comercial</option>
                    <option value="transactional">Transacional</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Status
                  </label>
                  <select
                    value={
                      tempFilters.status === undefined
                        ? ""
                        : tempFilters.status.toString()
                    }
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        status:
                          e.target.value === ""
                            ? undefined
                            : (e.target.value as
                                | "active"
                                | "inactive"
                                | "researching"),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                    <option value="researching">Pesquisando</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Volume de Busca (min)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={tempFilters.volume_min || ""}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        volume_min: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Volume de Busca (max)
                  </label>
                  <Input
                    type="number"
                    placeholder="999999"
                    value={tempFilters.volume_max || ""}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        volume_max: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Dificuldade (min)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={tempFilters.difficulty_min || ""}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        difficulty_min: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Dificuldade (max)
                  </label>
                  <Input
                    type="number"
                    placeholder="100"
                    min="0"
                    max="100"
                    value={tempFilters.difficulty_max || ""}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        difficulty_max: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Resultados por página
                  </label>
                  <select
                    value={tempFilters.limit || 50}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        limit: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
                <Button onClick={handleApplyFilters} size="sm">
                  Aplicar Filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  size="sm"
                >
                  Limpar Filtros
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowFilters(false)}
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Tabela */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Keywords</h3>
            <Badge variant="secondary" className="text-xs">
              {keywords?.length || 0} encontradas
            </Badge>
          </div>

          {selectedBlog ? (
            <Badge variant="outline" className="text-xs">
              Blog específico
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Todos os blogs
            </Badge>
          )}
        </div>

        {!keywords || keywords.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhuma keyword encontrada
            </h3>
            <p className="text-sm">
              {getActiveFiltersCount() > 0
                ? "Tente ajustar os filtros para ver mais resultados"
                : "Adicione sua primeira keyword para começar"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("keyword")}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Keyword
                      {getSortIcon("keyword")}
                    </button>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("volume_min")}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Volume
                      {getSortIcon("volume_min")}
                    </button>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort("difficulty_min")}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Dificuldade
                      {getSortIcon("difficulty_min")}
                    </button>
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    CPC
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Competição
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Intenção
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Blog
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((keyword, index) => (
                  <motion.tr
                    key={keyword.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-gray-900 max-w-xs">
                        {keyword.keyword}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 font-medium">
                        {keyword.language || "pt-br"} •{" "}
                        {keyword.category || "Geral"}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">
                          {formatNumber(keyword.search_volume)}
                        </span>
                        {keyword.search_volume &&
                          keyword.search_volume > 1000 && (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          )}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-semibold ${getDifficultyColor(
                          keyword.difficulty
                        )}`}
                      >
                        {keyword.difficulty || "-"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(keyword.cpc)}
                      </span>
                    </td>

                    <td className="p-4">
                      {keyword.competition && (
                        <Badge
                          variant={getCompetitionColor(keyword.competition)}
                          className="text-xs"
                        >
                          {keyword.competition}
                        </Badge>
                      )}
                    </td>

                    <td className="p-4">
                      {keyword.category && (
                        <Badge variant="outline" className="text-xs">
                          {keyword.category}
                        </Badge>
                      )}
                    </td>

                    <td className="p-4">
                      {"blogs" in keyword && (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {keyword.blogs.name}
                          </div>
                          {keyword.blogs.domain && (
                            <div className="text-xs text-gray-500">
                              {keyword.blogs.domain}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <Badge
                        variant={
                          keyword.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {keyword.status === "active" && "Ativa"}
                        {keyword.status === "inactive" && "Inativa"}
                        {keyword.status === "researching" && "Pesquisando"}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(keyword.id)}
                          disabled={deleteKeyword.isPending}
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
