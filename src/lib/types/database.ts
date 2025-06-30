export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          domain: string;
          description: string | null;
          niche: string | null;
          is_active: boolean;
          settings: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          domain: string;
          description?: string | null;
          niche?: string | null;
          is_active?: boolean;
          settings?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          domain?: string;
          description?: string | null;
          niche?: string | null;
          is_active?: boolean;
          settings?: Json | null;
        };
      };
      authors: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          email: string;
          bio: string | null;
          avatar_url: string | null;
          social_links: Json | null;
          expertise: string[] | null;
          status: "active" | "inactive";
          blog_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          email: string;
          bio?: string | null;
          avatar_url?: string | null;
          social_links?: Json | null;
          expertise?: string[] | null;
          status?: "active" | "inactive";
          blog_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          email?: string;
          bio?: string | null;
          avatar_url?: string | null;
          social_links?: Json | null;
          expertise?: string[] | null;
          status?: "active" | "inactive";
          blog_id?: string | null;
        };
      };
      main_keywords: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          keyword: string;
          search_volume: number | null;
          difficulty: number | null;
          cpc: number | null;
          competition: string | null;
          category: string | null;
          language: string;
          country: string;
          status: "active" | "inactive" | "researching";
          priority: number | null;
          notes: string | null;
          last_analyzed: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          keyword: string;
          search_volume?: number | null;
          difficulty?: number | null;
          cpc?: number | null;
          competition?: string | null;
          category?: string | null;
          language?: string;
          country?: string;
          status?: "active" | "inactive" | "researching";
          priority?: number | null;
          notes?: string | null;
          last_analyzed?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          keyword?: string;
          search_volume?: number | null;
          difficulty?: number | null;
          cpc?: number | null;
          competition?: string | null;
          category?: string | null;
          language?: string;
          country?: string;
          status?: "active" | "inactive" | "researching";
          priority?: number | null;
          notes?: string | null;
          last_analyzed?: string | null;
        };
      };
      keyword_variations: {
        Row: {
          id: string;
          created_at: string;
          main_keyword_id: string;
          variation: string;
          search_volume: number | null;
          difficulty: number | null;
          relevance_score: number | null;
          type: string | null;
          status: "active" | "inactive";
        };
        Insert: {
          id?: string;
          created_at?: string;
          main_keyword_id: string;
          variation: string;
          search_volume?: number | null;
          difficulty?: number | null;
          relevance_score?: number | null;
          type?: string | null;
          status?: "active" | "inactive";
        };
        Update: {
          id?: string;
          created_at?: string;
          main_keyword_id?: string;
          variation?: string;
          search_volume?: number | null;
          difficulty?: number | null;
          relevance_score?: number | null;
          type?: string | null;
          status?: "active" | "inactive";
        };
      };
      content_posts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string;
          content: string | null;
          excerpt: string | null;
          status: "draft" | "published" | "scheduled" | "archived";
          published_at: string | null;
          author_id: string | null;
          blog_id: string | null;
          main_keyword_id: string | null;
          seo_title: string | null;
          meta_description: string | null;
          featured_image: string | null;
          tags: string[] | null;
          categories: string[] | null;
          word_count: number | null;
          reading_time: number | null;
          seo_score: number | null;
          performance_metrics: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug: string;
          content?: string | null;
          excerpt?: string | null;
          status?: "draft" | "published" | "scheduled" | "archived";
          published_at?: string | null;
          author_id?: string | null;
          blog_id?: string | null;
          main_keyword_id?: string | null;
          seo_title?: string | null;
          meta_description?: string | null;
          featured_image?: string | null;
          tags?: string[] | null;
          categories?: string[] | null;
          word_count?: number | null;
          reading_time?: number | null;
          seo_score?: number | null;
          performance_metrics?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          slug?: string;
          content?: string | null;
          excerpt?: string | null;
          status?: "draft" | "published" | "scheduled" | "archived";
          published_at?: string | null;
          author_id?: string | null;
          blog_id?: string | null;
          main_keyword_id?: string | null;
          seo_title?: string | null;
          meta_description?: string | null;
          featured_image?: string | null;
          tags?: string[] | null;
          categories?: string[] | null;
          word_count?: number | null;
          reading_time?: number | null;
          seo_score?: number | null;
          performance_metrics?: Json | null;
        };
      };
      keyword_embeddings: {
        Row: {
          id: string;
          created_at: string;
          keyword_id: string;
          embedding: number[] | null;
          model_version: string | null;
          last_updated: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          keyword_id: string;
          embedding?: number[] | null;
          model_version?: string | null;
          last_updated?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          keyword_id?: string;
          embedding?: number[] | null;
          model_version?: string | null;
          last_updated?: string | null;
        };
      };
      content_analysis: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          post_id: string;
          analysis_type: string;
          results: Json | null;
          score: number | null;
          recommendations: Json | null;
          status: "pending" | "completed" | "failed";
          analyzed_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          post_id: string;
          analysis_type: string;
          results?: Json | null;
          score?: number | null;
          recommendations?: Json | null;
          status?: "pending" | "completed" | "failed";
          analyzed_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          post_id?: string;
          analysis_type?: string;
          results?: Json | null;
          score?: number | null;
          recommendations?: Json | null;
          status?: "pending" | "completed" | "failed";
          analyzed_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      find_similar_keywords: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          keyword: string;
          similarity: number;
        }[];
      };
      analyze_keyword_duplicates: {
        Args: Record<PropertyKey, never>;
        Returns: {
          keyword: string;
          count: number;
          ids: string[];
        }[];
      };
      get_keyword_performance_stats: {
        Args: {
          keyword_id: string;
        };
        Returns: {
          total_posts: number;
          avg_seo_score: number;
          total_views: number;
          avg_ranking: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
