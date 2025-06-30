"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type { KeywordFilters } from "@/lib/hooks/use-keywords";

interface KeywordsTableFiltersProps {
  filters: KeywordFilters;
  onFilterChange: (filters: KeywordFilters) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

export function KeywordsTableFilters({
  filters,
  onFilterChange,
  onApply,
  onClear,
  onClose,
}: KeywordsTableFiltersProps) {
  const handleInputChange = (field: keyof KeywordFilters, value: any) => {
    onFilterChange({ ...filters, [field]: value || undefined });
  };

  const handleNumberInputChange = (
    field: keyof KeywordFilters,
    value: string
  ) => {
    onFilterChange({
      ...filters,
      [field]: value ? parseInt(value) : undefined,
    });
  };

  return (
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
            value={filters.competition || ""}
            onChange={(e) => handleInputChange("competition", e.target.value)}
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
            value={filters.searchIntent || ""}
            onChange={(e) => handleInputChange("searchIntent", e.target.value)}
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
            value={filters.status || ""}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="active">Ativa</option>
            <option value="inactive">Inativa</option>
            <option value="researching">Pesquisando</option>
          </select>
        </div>

        <InputGroup
          label="Volume de Busca (min)"
          value={filters.volume_min}
          onChange={(e) =>
            handleNumberInputChange("volume_min", e.target.value)
          }
        />
        <InputGroup
          label="Volume de Busca (max)"
          value={filters.volume_max}
          onChange={(e) =>
            handleNumberInputChange("volume_max", e.target.value)
          }
        />
        <InputGroup
          label="Dificuldade (min)"
          value={filters.difficulty_min}
          onChange={(e) =>
            handleNumberInputChange("difficulty_min", e.target.value)
          }
          min={0}
          max={100}
        />
        <InputGroup
          label="Dificuldade (max)"
          value={filters.difficulty_max}
          onChange={(e) =>
            handleNumberInputChange("difficulty_max", e.target.value)
          }
          min={0}
          max={100}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Resultados por página
          </label>
          <select
            value={filters.limit || 50}
            onChange={(e) => handleNumberInputChange("limit", e.target.value)}
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
        <Button onClick={onApply} size="sm">
          Aplicar Filtros
        </Button>
        <Button variant="outline" onClick={onClear} size="sm">
          Limpar Filtros
        </Button>
        <Button variant="ghost" onClick={onClose} size="sm">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function InputGroup({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>
      <Input type="number" {...props} />
    </div>
  );
}
