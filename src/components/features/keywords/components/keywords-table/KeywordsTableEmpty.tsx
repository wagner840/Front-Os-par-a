"use client";

interface KeywordsTableEmptyProps {
  hasActiveFilters: boolean;
}

export function KeywordsTableEmpty({
  hasActiveFilters,
}: KeywordsTableEmptyProps) {
  return (
    <div className="p-8 text-center text-gray-500">
      <div className="text-4xl mb-4">📝</div>
      <h3 className="text-lg font-semibold mb-2">Nenhuma keyword encontrada</h3>
      <p className="text-sm">
        {hasActiveFilters
          ? "Tente ajustar os filtros para ver mais resultados"
          : "Adicione sua primeira keyword para começar"}
      </p>
    </div>
  );
}
