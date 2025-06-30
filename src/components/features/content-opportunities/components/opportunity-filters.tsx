import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Search,
  Filter,
  TrendingUp,
  Target,
  Brain,
  Sparkles,
} from "lucide-react";

interface MainKeyword {
  id: string;
  keyword: string;
  msv?: number;
}

interface OpportunityFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedMainKeyword: string;
  setSelectedMainKeyword: (keyword: string) => void;
  mainKeywords: MainKeyword[];
  semanticSearch: string;
  setSemanticSearch: (search: string) => void;
  handleSemanticSearch: () => void;
  semanticLoading: boolean;
}

export default function OpportunityFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  selectedMainKeyword,
  setSelectedMainKeyword,
  mainKeywords,
  semanticSearch,
  setSemanticSearch,
  handleSemanticSearch,
  semanticLoading,
}: OpportunityFiltersProps) {
  return (
    <GlassCard>
      <div className="space-y-4">
        {/* Filtros Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Busca Textual */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              type="text"
              placeholder="Buscar oportunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="form-input">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white/10 backdrop-blur-lg border border-white/20">
              <SelectItem value="all" className="text-white hover:bg-white/10">
                Todos os Status
              </SelectItem>
              <SelectItem
                value="pending"
                className="text-white hover:bg-white/10"
              >
                Pendente
              </SelectItem>
              <SelectItem
                value="in_progress"
                className="text-white hover:bg-white/10"
              >
                Em Progresso
              </SelectItem>
              <SelectItem
                value="completed"
                className="text-white hover:bg-white/10"
              >
                Concluída
              </SelectItem>
              <SelectItem
                value="on_hold"
                className="text-white hover:bg-white/10"
              >
                Em Espera
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="form-input">
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent className="bg-white/10 backdrop-blur-lg border border-white/20">
              <SelectItem value="all" className="text-white hover:bg-white/10">
                Todas as Prioridades
              </SelectItem>
              <SelectItem value="high" className="text-white hover:bg-white/10">
                Alta (80+)
              </SelectItem>
              <SelectItem
                value="medium"
                className="text-white hover:bg-white/10"
              >
                Média (50-79)
              </SelectItem>
              <SelectItem value="low" className="text-white hover:bg-white/10">
                Baixa (&lt;50)
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Ordenação */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="form-input">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-white/10 backdrop-blur-lg border border-white/20">
              <SelectItem
                value="priority_score"
                className="text-white hover:bg-white/10"
              >
                Score de Prioridade
              </SelectItem>
              <SelectItem
                value="due_date"
                className="text-white hover:bg-white/10"
              >
                Data de Vencimento
              </SelectItem>
              <SelectItem
                value="created_at"
                className="text-white hover:bg-white/10"
              >
                Data de Criação
              </SelectItem>
              <SelectItem
                value="title"
                className="text-white hover:bg-white/10"
              >
                Título
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtros Avançados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {/* Filtro por Keyword Mãe */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">
              Filtrar por Keyword Mãe
            </label>
            <Select
              value={selectedMainKeyword}
              onValueChange={setSelectedMainKeyword}
            >
              <SelectTrigger className="form-input">
                <Target className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Selecione uma keyword..." />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-lg border border-white/20 max-h-48">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-white/10"
                >
                  Todas as Keywords
                </SelectItem>
                {mainKeywords?.map((keyword: MainKeyword) => (
                  <SelectItem
                    key={keyword.id}
                    value={keyword.id}
                    className="text-white hover:bg-white/10"
                  >
                    {keyword.keyword} ({keyword.msv || 0} MSV)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Busca Semântica */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">
              Busca Semântica (IA)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Brain className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  type="text"
                  placeholder="Descreva o tipo de conteúdo..."
                  value={semanticSearch}
                  onChange={(e) => setSemanticSearch(e.target.value)}
                  className="form-input pl-10"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSemanticSearch()
                  }
                />
              </div>
              <Button
                onClick={handleSemanticSearch}
                disabled={!semanticSearch.trim() || semanticLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
