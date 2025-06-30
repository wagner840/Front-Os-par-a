export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-green-600 rounded-full animate-spin mx-auto"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Carregando...</h2>
        <p className="text-gray-500">Preparando sua experiência</p>
      </div>
    </div>
  );
}
