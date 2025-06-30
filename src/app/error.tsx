"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro para debugging
    console.error("Erro da aplicação:", error);

    // Se for um ChunkLoadError, tentar recarregar a página
    if (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk")
    ) {
      console.log("ChunkLoadError detectado, recarregando página...");
      window.location.reload();
      return;
    }
  }, [error]);

  const handleRetry = () => {
    // Para ChunkLoadError, recarregar a página em vez de apenas resetar
    if (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk")
    ) {
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="text-6xl">🚨</div>
        <h1 className="text-2xl font-bold text-gray-900">
          Ops! Algo deu errado
        </h1>
        <div className="space-y-2">
          <p className="text-gray-600">
            {error.name === "ChunkLoadError" ||
            error.message.includes("Loading chunk")
              ? "Erro de carregamento de recursos. A página será recarregada automaticamente."
              : "Ocorreu um erro inesperado na aplicação."}
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-xs text-left bg-gray-100 p-3 rounded">
              <summary className="cursor-pointer font-medium">
                Detalhes do erro
              </summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
        <button
          onClick={handleRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Tentar novamente
        </button>
      </div>
    </div>
  );
}
