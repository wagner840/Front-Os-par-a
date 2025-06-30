export interface ContentGap {
  keyword: string;
  msv: number;
  kw_difficulty: number;
  has_content: boolean;
  similar_content_count: number;
  opportunity_score: number;
}

export interface SemanticDuplicate {
  id1: string;
  id2: string;
  text1: string;
  text2: string;
  similarity: number;
}

export interface EmbeddingStats {
  table_name: string;
  total_records: number;
  with_embeddings: number;
  without_embeddings: number;
  percentage_complete: number;
}

export interface SimilarItem {
  id: string;
  title?: string;
  keyword?: string;
  cluster_name?: string;
  similarity: number;
}

export interface NicheStatistics {
  niche: string;
  total_blogs: number;
  total_keywords: number;
  avg_msv: number;
  avg_difficulty: number;
  avg_cpc: number;
}

export interface KeywordRecommendation {
  keyword: string;
  variation_type: string;
  msv: number;
  kw_difficulty: number;
  similarity: number;
  opportunity_score: number;
}

export interface AnalyticsFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  blogId?: string | "all";
  authorId?: string;
  category?: string;
  status?: "draft" | "published" | "scheduled" | "archived" | "all";
  postId?: string | "all";
  metricType?: string | "all";
  startDate?: string;
  endDate?: string;
}

export interface PerformanceMetrics {
  totalPosts: number;
  publishedPosts: number;
  avgSeoScore: number;
  avgWordCount: number;
  avgReadingTime: number;
  totalKeywords: number;
  activeKeywords: number;
  avgKeywordDifficulty: number;
  contentGrowthRate: number;
  seoImprovementRate: number;
}

export interface SEOAnalytics {
  scoreDistribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  topPerformingPosts: Array<{
    id: string;
    title: string;
    seo_score: number;
    word_count: number;
    published_at: string;
  }>;
  underPerformingPosts: Array<{
    id: string;
    title: string;
    seo_score: number;
    issues: string[];
  }>;
  keywordOpportunities: Array<{
    keyword: string;
    search_volume: number;
    difficulty: number;
    posts_count: number;
  }>;
}

export interface ContentAnalytics {
  categoryPerformance: Array<{
    category: string;
    posts_count: number;
    avg_seo_score: number;
    avg_word_count: number;
  }>;
  authorPerformance: Array<{
    author_name: string;
    posts_count: number;
    avg_seo_score: number;
    total_word_count: number;
  }>;
  publishingTrends: Array<{
    date: string;
    posts_count: number;
    avg_seo_score: number;
  }>;
  wordCountDistribution: Array<{
    range: string;
    count: number;
  }>;
}

export interface KeywordAnalytics {
  topKeywords: Array<{
    keyword: string;
    search_volume: number;
    difficulty: number;
    posts_count: number;
    avg_seo_score: number;
  }>;
  difficultyDistribution: Array<{
    range: string;
    count: number;
  }>;
  competitionAnalysis: Array<{
    competition: string;
    count: number;
    avg_cpc: number;
  }>;
  unusedKeywords: Array<{
    keyword: string;
    search_volume: number;
    difficulty: number;
    priority: number;
  }>;
}

export interface DuplicateAnalysis {
  duplicateKeywords: Array<{
    keyword: string;
    count: number;
    ids: string[];
  }>;
  similarPosts: Array<{
    post1: {
      id: string;
      title: string;
    };
    post2: {
      id: string;
      title: string;
    };
    similarity: number;
  }>;
}

export interface ChartData {
  seoScoreChart: {
    data: Array<{ category: string; value: number }>;
    title: string;
  };
  keywordDifficultyChart: {
    data: Array<{ category: string; value: number }>;
    title: string;
  };
  publishingTrendChart: {
    data: Array<{ time: string; value: number }>;
    title: string;
  };
  categoryPerformanceChart?: {
    data: Array<{ category: string; value: number }>;
    title: string;
  };
}

export interface AnalyticsMetric {
  id: string;
  blog_id: string;
  post_id?: string;
  metric_type: string;
  metric_value: number;
  metric_date: string;
  additional_data?: Record<string, any>;
  created_at: string;
}
