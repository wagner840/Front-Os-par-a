"use client";

interface MetricsSummaryProps {
  keywords: any[];
  posts: any[];
}

export function MetricsSummary({ keywords, posts }: MetricsSummaryProps) {
  const totalKeywords = keywords?.length || 0;
  const publishedPosts =
    posts?.filter((p) => p.status === "published").length || 0;

  const averageMsv = Math.round(
    keywords?.reduce((acc, k) => acc + (k.msv || 0), 0) /
      (totalKeywords || 1) || 0
  );

  const averageDifficulty = Math.round(
    keywords?.reduce((acc, k) => acc + (k.kw_difficulty || 0), 0) /
      (totalKeywords || 1) || 0
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {totalKeywords}
        </div>
        <div className="text-sm text-blue-600/80 dark:text-blue-400/80">
          Total Keywords
        </div>
      </div>

      <div className="text-center p-4 rounded-lg bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {publishedPosts}
        </div>
        <div className="text-sm text-green-600/80 dark:text-green-400/80">
          Posts Publicados
        </div>
      </div>

      <div className="text-center p-4 rounded-lg bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {averageMsv}
        </div>
        <div className="text-sm text-purple-600/80 dark:text-purple-400/80">
          MSV Médio
        </div>
      </div>

      <div className="text-center p-4 rounded-lg bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
          {averageDifficulty}%
        </div>
        <div className="text-sm text-amber-600/80 dark:text-amber-400/80">
          Dificuldade Média
        </div>
      </div>
    </div>
  );
}
