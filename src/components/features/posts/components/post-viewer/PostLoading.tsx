"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function PostLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="lg" />
      <span className="ml-3 text-gray-600">Carregando post...</span>
    </div>
  );
}
