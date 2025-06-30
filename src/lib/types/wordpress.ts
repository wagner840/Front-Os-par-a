// Tipos para a integração WordPress
export interface WordPressConfig {
  base_url: string;
  username: string;
  app_password: string;
  sync_enabled?: boolean;
  auto_sync_interval?: number; // em minutos
  sync_categories?: boolean;
  sync_tags?: boolean;
  sync_media?: boolean;
  sync_comments?: boolean;
  backup_enabled?: boolean;
  backup_frequency?: "hourly" | "daily" | "weekly" | "monthly";
}

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, any>;
  categories: number[];
  tags: number[];
  yoast_head?: string;
  yoast_head_json?: {
    title?: string;
    description?: string;
    robots?: Record<string, any>;
    canonical?: string;
    og_locale?: string;
    og_type?: string;
    og_title?: string;
    og_description?: string;
    og_url?: string;
    og_site_name?: string;
    article_published_time?: string;
    article_modified_time?: string;
    twitter_card?: string;
    twitter_misc?: Record<string, string>;
    schema?: Record<string, any>;
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, any>;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, any>;
}

export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, any>;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: "image" | "file" | "video" | "audio";
  mime_type: string;
  media_details: {
    width?: number;
    height?: number;
    file?: string;
    sizes?: Record<
      string,
      {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      }
    >;
    image_meta?: Record<string, any>;
  };
  post: number | null;
  source_url: string;
}

export interface WordPressUser {
  id: number;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  url: string;
  description: string;
  link: string;
  locale: string;
  nickname: string;
  slug: string;
  roles: string[];
  registered_date: string;
  capabilities: Record<string, boolean>;
  extra_capabilities: Record<string, boolean>;
  avatar_urls: Record<string, string>;
  meta: Record<string, any>;
}

export interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_email: string;
  author_url: string;
  author_ip: string;
  author_user_agent: string;
  date: string;
  date_gmt: string;
  content: {
    rendered: string;
  };
  link: string;
  status: "hold" | "approve" | "spam" | "trash";
  type: string;
  author_avatar_urls: Record<string, string>;
  meta: Record<string, any>;
}

export interface WordPressPlugin {
  plugin: string;
  status: "active" | "inactive";
  name: string;
  plugin_uri: string;
  author: string;
  author_uri: string;
  description: {
    raw: string;
    rendered: string;
  };
  version: string;
  network_only: boolean;
  requires_wp: string;
  requires_php: string;
  textdomain: string;
}

export interface WordPressTheme {
  stylesheet: string;
  template: string;
  author: string;
  author_uri: string;
  description: {
    raw: string;
    rendered: string;
  };
  name: string;
  requires_php: string;
  requires_wp: string;
  screenshot: string;
  status: "active" | "inactive";
  tags: string[];
  textdomain: string;
  theme_uri: string;
  version: string;
}

export interface WordPressSettings {
  title: string;
  description: string;
  url: string;
  email: string;
  timezone: string;
  date_format: string;
  time_format: string;
  start_of_week: number;
  language: string;
  use_smilies: boolean;
  default_category: number;
  default_post_format: string;
  posts_per_page: number;
  default_ping_status: "open" | "closed";
  default_comment_status: "open" | "closed";
}

export interface WordPressBackup {
  id: string;
  site_url: string;
  created_at: string;
  version: string;
  size: number;
  data: {
    posts: WordPressPost[];
    categories: WordPressCategory[];
    tags: WordPressTag[];
    media: WordPressMedia[];
    users: WordPressUser[];
    settings: WordPressSettings | null;
    comments?: WordPressComment[];
    plugins?: WordPressPlugin[];
    themes?: WordPressTheme[];
  };
}

export interface CreateWordPressPostData {
  title: string;
  content: string;
  excerpt?: string;
  status?: "publish" | "future" | "draft" | "pending" | "private";
  slug?: string;
  author?: number;
  featured_media?: number;
  comment_status?: "open" | "closed";
  ping_status?: "open" | "closed";
  format?: string;
  meta?: Record<string, any>;
  sticky?: boolean;
  template?: string;
  categories?: number[];
  tags?: number[];
  date?: string;
  date_gmt?: string;
}

export interface UpdateWordPressPostData
  extends Partial<CreateWordPressPostData> {}

export interface WordPressSyncResult {
  success: boolean;
  message: string;
  wordpress_post_id?: number;
  supabase_post_id?: string;
  errors?: string[];
}

export interface PostSyncMapping {
  supabase_id: string;
  wordpress_id: number;
  last_sync: string;
  sync_status: "synced" | "pending" | "error";
}

export interface WordPressIntegrationStats {
  total_posts: number;
  synced_posts: number;
  pending_sync: number;
  last_sync: string | null;
  wordpress_posts: number;
  supabase_posts: number;
  sync_errors: number;
  connection_status: "connected" | "disconnected" | "error";
  categories_count?: number;
  tags_count?: number;
  media_count?: number;
  comments_count?: number;
  users_count?: number;
  plugins_count?: number;
  themes_count?: number;
  backup_count?: number;
  last_backup?: string;
  storage_used?: number;
  bandwidth_used?: number;
}

export interface WordPressWebhook {
  id: string;
  name: string;
  status: "active" | "paused" | "disabled";
  topic: string;
  resource: string;
  event: string;
  hooks: string[];
  delivery_url: string;
  secret?: string;
  created_at: string;
  updated_at: string;
}

export interface WordPressActivityLog {
  id: string;
  blog_id: string;
  action: string;
  resource_type:
    | "post"
    | "category"
    | "tag"
    | "media"
    | "user"
    | "comment"
    | "plugin"
    | "theme"
    | "settings";
  resource_id?: string | number;
  details: Record<string, any>;
  status: "success" | "error" | "warning";
  message: string;
  user_id?: string;
  created_at: string;
}

export interface WordPressAutoSyncConfig {
  enabled: boolean;
  interval: number; // em minutos
  sync_posts: boolean;
  sync_categories: boolean;
  sync_tags: boolean;
  sync_media: boolean;
  sync_comments: boolean;
  sync_users: boolean;
  conflict_resolution: "wordpress_wins" | "supabase_wins" | "manual";
  last_run?: string;
  next_run?: string;
  errors_count: number;
  max_errors: number;
}

export interface WordPressPerformanceMetrics {
  blog_id: string;
  response_time: number;
  success_rate: number;
  error_rate: number;
  requests_per_minute: number;
  bandwidth_usage: number;
  cache_hit_rate?: number;
  uptime_percentage: number;
  last_check: string;
  alerts: Array<{
    type: "warning" | "error" | "info";
    message: string;
    timestamp: string;
  }>;
}

export interface WordPressSEOConfig {
  yoast_enabled: boolean;
  rankmath_enabled: boolean;
  aioseo_enabled: boolean;
  auto_generate_meta: boolean;
  sync_focus_keywords: boolean;
  sync_meta_descriptions: boolean;
  sync_og_tags: boolean;
  sync_twitter_cards: boolean;
  sync_schema_markup: boolean;
}

export interface WordPressContentAnalysis {
  post_id: number;
  seo_score: number;
  readability_score: number;
  keyword_density: Record<string, number>;
  word_count: number;
  reading_time: number;
  internal_links: number;
  external_links: number;
  images_count: number;
  alt_texts_missing: number;
  headings_structure: Record<string, number>;
  suggestions: Array<{
    type: "seo" | "readability" | "structure";
    priority: "high" | "medium" | "low";
    message: string;
  }>;
}
