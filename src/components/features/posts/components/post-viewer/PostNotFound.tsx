"use client";

export function PostNotFound() {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-4">📄</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Post não encontrado
      </h3>
      <p className="text-gray-600">O post solicitado não pôde ser carregado.</p>
    </div>
  );
}
