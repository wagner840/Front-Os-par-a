"use client";

interface PostsTableEmptyProps {
  hasActiveFilters: boolean;
}

export function PostsTableEmpty({ hasActiveFilters }: PostsTableEmptyProps) {
  return (
    <div className="p-8 text-center text-gray-500">
      <div className="text-4xl mb-4">📝</div>
      <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
      <p className="text-sm">
        {hasActiveFilters
          ? "Tente ajustar os filtros para ver mais resultados"
          : "Adicione seu primeiro post para começar"}
      </p>
    </div>
  );
}
