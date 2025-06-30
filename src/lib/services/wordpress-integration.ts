import { createClient } from "../supabase/client";
import type {
  WordPressConfig,
  WordPressPost,
  WordPressCategory,
  WordPressTag,
  WordPressMedia,
  WordPressUser,
  WordPressComment,
  WordPressSyncResult,
  PostSyncMapping,
  WordPressIntegrationStats,
  CreateWordPressPostData,
  UpdateWordPressPostData,
  WordPressPlugin,
  WordPressTheme,
  WordPressSettings,
  WordPressBackup,
} from "../types/wordpress";
import type { Database } from "../types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

export class WordPressIntegrationService {
  private supabase = createClient();

  // ==================== CONFIGURAÇÃO ====================

  async getWordPressConfig(blogId: string): Promise<WordPressConfig | null> {
    try {
      const { data, error } = await this.supabase
        .from("blogs")
        .select("settings")
        .eq("id", blogId)
        .single();

      if (error) throw error;

      const wpConfig = data?.settings?.wordpress;
      if (!wpConfig) return null;

      return {
        base_url: wpConfig.base_url,
        username: wpConfig.username,
        app_password: wpConfig.app_password,
        sync_enabled: wpConfig.sync_enabled || false,
        auto_sync_interval: wpConfig.auto_sync_interval || 60,
        sync_categories: wpConfig.sync_categories || true,
        sync_tags: wpConfig.sync_tags || true,
        sync_media: wpConfig.sync_media || true,
        sync_comments: wpConfig.sync_comments || false,
        backup_enabled: wpConfig.backup_enabled || false,
        backup_frequency: wpConfig.backup_frequency || "daily",
      };
    } catch (error) {
      console.error("Erro ao buscar configuração WordPress:", error);
      return null;
    }
  }

  async saveWordPressConfig(
    blogId: string,
    config: WordPressConfig
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("blogs")
        .update({
          settings: {
            wordpress: config,
          },
        })
        .eq("id", blogId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao salvar configuração WordPress:", error);
      return false;
    }
  }

  // ==================== AUTENTICAÇÃO E CONEXÃO ====================

  private getAuthHeaders(config: WordPressConfig): Record<string, string> {
    const credentials = btoa(`${config.username}:${config.app_password}`);
    return {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
      "User-Agent": "Content-Hub-Integration/1.0",
    };
  }

  async testConnection(
    config: WordPressConfig
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/users/me`,
        {
          method: "GET",
          headers: this.getAuthHeaders(config),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro HTTP: ${response.status} - ${response.statusText}`
        );
      }

      const userData = await response.json();

      return {
        success: true,
        message: `Conexão estabelecida com sucesso! Usuário: ${userData.name}`,
        data: userData,
      };
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      return {
        success: false,
        message: `Falha na conexão: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
      };
    }
  }

  // ==================== GERENCIAMENTO DE POSTS ====================

  async getWordPressPosts(
    config: WordPressConfig,
    params: {
      page?: number;
      per_page?: number;
      status?: string;
      search?: string;
      categories?: number[];
      tags?: number[];
      author?: number;
      order?: "asc" | "desc";
      orderby?: string;
    } = {}
  ): Promise<WordPressPost[]> {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(","));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/posts?${queryParams.toString()}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(config),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar posts: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar posts do WordPress:", error);
      return [];
    }
  }

  async createWordPressPost(
    config: WordPressConfig,
    postData: CreateWordPressPostData
  ): Promise<WordPressPost | null> {
    try {
      const response = await fetch(`${config.base_url}/wp-json/wp/v2/posts`, {
        method: "POST",
        headers: this.getAuthHeaders(config),
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar post no WordPress:", error);
      return null;
    }
  }

  async updateWordPressPost(
    config: WordPressConfig,
    postId: number,
    postData: UpdateWordPressPostData
  ): Promise<WordPressPost | null> {
    try {
      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/posts/${postId}`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(config),
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao atualizar post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar post no WordPress:", error);
      return null;
    }
  }

  async deleteWordPressPost(
    config: WordPressConfig,
    postId: number,
    force: boolean = false
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/posts/${postId}?force=${force}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(config),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Erro ao deletar post no WordPress:", error);
      return false;
    }
  }

  // ==================== GERENCIAMENTO DE CATEGORIAS ====================

  async getWordPressCategories(
    config: WordPressConfig
  ): Promise<WordPressCategory[]> {
    try {
      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/categories?per_page=100`,
        {
          method: "GET",
          headers: this.getAuthHeaders(config),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar categorias: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar categorias do WordPress:", error);
      return [];
    }
  }

  async createWordPressCategory(
    config: WordPressConfig,
    categoryData: {
      name: string;
      description?: string;
      slug?: string;
      parent?: number;
    }
  ): Promise<WordPressCategory | null> {
    try {
      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/categories`,
        {
          method: "POST",
          headers: this.getAuthHeaders(config),
          body: JSON.stringify(categoryData),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao criar categoria: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar categoria no WordPress:", error);
      return null;
    }
  }

  // ==================== GERENCIAMENTO DE TAGS ====================

  async getWordPressTags(config: WordPressConfig): Promise<WordPressTag[]> {
    try {
      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/tags?per_page=100`,
        {
          method: "GET",
          headers: this.getAuthHeaders(config),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar tags: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar tags do WordPress:", error);
      return [];
    }
  }

  async createWordPressTag(
    config: WordPressConfig,
    tagData: {
      name: string;
      description?: string;
      slug?: string;
    }
  ): Promise<WordPressTag | null> {
    try {
      const response = await fetch(`${config.base_url}/wp-json/wp/v2/tags`, {
        method: "POST",
        headers: this.getAuthHeaders(config),
        body: JSON.stringify(tagData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar tag: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar tag no WordPress:", error);
      return null;
    }
  }

  // ==================== GERENCIAMENTO DE MÍDIA ====================

  async getWordPressMedia(
    config: WordPressConfig,
    params: {
      page?: number;
      per_page?: number;
      media_type?: string;
      parent?: number;
    } = {}
  ): Promise<WordPressMedia[]> {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/media?${queryParams.toString()}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(config),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar mídia: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar mídia do WordPress:", error);
      return [];
    }
  }

  async uploadWordPressMedia(
    config: WordPressConfig,
    file: File,
    title?: string,
    alt?: string
  ): Promise<WordPressMedia | null> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      if (title) formData.append("title", title);
      if (alt) formData.append("alt_text", alt);

      const headers = this.getAuthHeaders(config);
      delete headers["Content-Type"]; // Let browser set it for FormData

      const response = await fetch(`${config.base_url}/wp-json/wp/v2/media`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao fazer upload: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao fazer upload de mídia:", error);
      return null;
    }
  }

  // ==================== GERENCIAMENTO DE USUÁRIOS ====================

  async getWordPressUsers(config: WordPressConfig): Promise<WordPressUser[]> {
    try {
      const response = await fetch(`${config.base_url}/wp-json/wp/v2/users`, {
        method: "GET",
        headers: this.getAuthHeaders(config),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar usuários do WordPress:", error);
      return [];
    }
  }

  // ==================== GERENCIAMENTO DE COMENTÁRIOS ====================

  async getWordPressComments(
    config: WordPressConfig,
    params: {
      post?: number;
      page?: number;
      per_page?: number;
      status?: string;
    } = {}
  ): Promise<WordPressComment[]> {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/comments?${queryParams.toString()}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(config),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar comentários: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar comentários do WordPress:", error);
      return [];
    }
  }

  async moderateComment(
    config: WordPressConfig,
    commentId: number,
    status: "approve" | "hold" | "spam" | "trash"
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/comments/${commentId}`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(config),
          body: JSON.stringify({ status }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Erro ao moderar comentário:", error);
      return false;
    }
  }

  // ==================== PLUGINS E TEMAS ====================

  async getWordPressPlugins(
    config: WordPressConfig
  ): Promise<WordPressPlugin[]> {
    try {
      const response = await fetch(`${config.base_url}/wp-json/wp/v2/plugins`, {
        method: "GET",
        headers: this.getAuthHeaders(config),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar plugins: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar plugins do WordPress:", error);
      return [];
    }
  }

  async getWordPressThemes(config: WordPressConfig): Promise<WordPressTheme[]> {
    try {
      const response = await fetch(`${config.base_url}/wp-json/wp/v2/themes`, {
        method: "GET",
        headers: this.getAuthHeaders(config),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar temas: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar temas do WordPress:", error);
      return [];
    }
  }

  // ==================== CONFIGURAÇÕES DO SITE ====================

  async getWordPressSettings(
    config: WordPressConfig
  ): Promise<WordPressSettings | null> {
    try {
      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/settings`,
        {
          method: "GET",
          headers: this.getAuthHeaders(config),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar configurações: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar configurações do WordPress:", error);
      return null;
    }
  }

  async updateWordPressSettings(
    config: WordPressConfig,
    settings: Partial<WordPressSettings>
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${config.base_url}/wp-json/wp/v2/settings`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(config),
          body: JSON.stringify(settings),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Erro ao atualizar configurações do WordPress:", error);
      return false;
    }
  }

  // ==================== SINCRONIZAÇÃO ====================

  async syncPostToWordPress(
    blogId: string,
    postId: string
  ): Promise<WordPressSyncResult> {
    try {
      const config = await this.getWordPressConfig(blogId);
      if (!config) {
        throw new Error("Configuração WordPress não encontrada");
      }

      // Buscar post do Supabase
      const { data: post, error } = await this.supabase
        .from("content_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      const postData: CreateWordPressPostData = {
        title: post.title,
        content: post.content || "",
        excerpt: post.excerpt || "",
        status: this.mapSupabaseStatusToWordPress(post.status),
        date: post.published_at || new Date().toISOString(),
        slug: post.slug || "",
        meta: {
          _yoast_wpseo_title: post.seo_title || "",
          _yoast_wpseo_metadesc: post.seo_description || "",
          _yoast_wpseo_focuskw: post.focus_keyword || "",
        },
      };

      let wpPost: WordPressPost | null = null;

      if (post.wordpress_post_id) {
        // Atualizar post existente
        wpPost = await this.updateWordPressPost(
          config,
          post.wordpress_post_id,
          postData
        );
      } else {
        // Criar novo post
        wpPost = await this.createWordPressPost(config, postData);

        if (wpPost) {
          // Salvar ID do WordPress no Supabase
          await this.supabase
            .from("content_posts")
            .update({ wordpress_post_id: wpPost.id })
            .eq("id", postId);
        }
      }

      return {
        success: !!wpPost,
        message: wpPost
          ? "Post sincronizado com sucesso"
          : "Erro na sincronização",
        wordpress_post_id: wpPost?.id,
        supabase_post_id: postId,
      };
    } catch (error) {
      console.error("Erro na sincronização:", error);
      return {
        success: false,
        message: `Erro: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
        supabase_post_id: postId,
      };
    }
  }

  async syncPostsFromWordPress(blogId: string): Promise<WordPressSyncResult[]> {
    try {
      const config = await this.getWordPressConfig(blogId);
      if (!config) {
        throw new Error("Configuração WordPress não encontrada");
      }

      const wpPosts = await this.getWordPressPosts(config, { per_page: 100 });
      const results: WordPressSyncResult[] = [];

      for (const wpPost of wpPosts) {
        try {
          // Verificar se o post já existe no Supabase
          const { data: existingPost } = await this.supabase
            .from("content_posts")
            .select("id")
            .eq("wordpress_post_id", wpPost.id)
            .single();

          if (!existingPost) {
            // Buscar autor padrão
            const { data: author } = await this.supabase
              .from("authors")
              .select("id")
              .limit(1)
              .single();

            if (author) {
              const { data: newPost, error } = await this.supabase
                .from("content_posts")
                .insert({
                  blog_id: blogId,
                  author_id: author.id,
                  title: wpPost.title.rendered,
                  content: wpPost.content.rendered,
                  excerpt: wpPost.excerpt.rendered,
                  slug: wpPost.slug,
                  status: this.mapWordPressStatusToSupabase(wpPost.status),
                  wordpress_post_id: wpPost.id,
                  published_at: wpPost.date,
                  seo_title: wpPost.yoast_head_json?.title || "",
                  seo_description: wpPost.yoast_head_json?.description || "",
                })
                .select()
                .single();

              results.push({
                success: !error,
                message: error
                  ? `Erro ao importar: ${error.message}`
                  : "Post importado com sucesso",
                wordpress_post_id: wpPost.id,
                supabase_post_id: newPost?.id,
              });
            }
          } else {
            results.push({
              success: true,
              message: "Post já existe no Supabase",
              wordpress_post_id: wpPost.id,
              supabase_post_id: existingPost.id,
            });
          }
        } catch (error) {
          results.push({
            success: false,
            message: `Erro ao processar post ${wpPost.id}: ${
              error instanceof Error ? error.message : "Erro desconhecido"
            }`,
            wordpress_post_id: wpPost.id,
          });
        }
      }

      return results;
    } catch (error) {
      console.error("Erro na sincronização em lote:", error);
      return [
        {
          success: false,
          message: `Erro geral: ${
            error instanceof Error ? error.message : "Erro desconhecido"
          }`,
        },
      ];
    }
  }

  // ==================== SINCRONIZAÇÃO AVANÇADA ====================

  // Sincronizar categorias do WordPress para Supabase
  async syncCategoriesFromWordPress(
    blogId: string
  ): Promise<WordPressSyncResult[]> {
    try {
      const config = await this.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");

      const wpCategories = await this.getWordPressCategories(config);
      const results: WordPressSyncResult[] = [];

      for (const wpCategory of wpCategories) {
        try {
          // Verificar se categoria já existe no Supabase
          const { data: existingCategory } = await this.supabase
            .from("blog_categories")
            .select("id")
            .eq("wordpress_id", wpCategory.id)
            .eq("blog_id", blogId)
            .single();

          if (!existingCategory) {
            const { data: newCategory, error } = await this.supabase
              .from("blog_categories")
              .insert({
                blog_id: blogId,
                name: wpCategory.name,
                slug: wpCategory.slug,
                description: wpCategory.description || "",
                wordpress_id: wpCategory.id,
              })
              .select()
              .single();

            results.push({
              success: !error,
              message: error
                ? `Erro: ${error.message}`
                : "Categoria sincronizada",
              wordpress_post_id: wpCategory.id,
              supabase_post_id: newCategory?.id,
            });
          }
        } catch (error) {
          results.push({
            success: false,
            message: `Erro ao sincronizar categoria ${wpCategory.id}`,
          });
        }
      }

      return results;
    } catch (error) {
      return [{ success: false, message: `Erro geral: ${error}` }];
    }
  }

  // Sincronizar tags do WordPress para Supabase
  async syncTagsFromWordPress(blogId: string): Promise<WordPressSyncResult[]> {
    try {
      const config = await this.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");

      const wpTags = await this.getWordPressTags(config);
      const results: WordPressSyncResult[] = [];

      for (const wpTag of wpTags) {
        try {
          // Verificar se tag já existe no Supabase
          const { data: existingTag } = await this.supabase
            .from("blog_tags")
            .select("id")
            .eq("wordpress_id", wpTag.id)
            .eq("blog_id", blogId)
            .single();

          if (!existingTag) {
            const { data: newTag, error } = await this.supabase
              .from("blog_tags")
              .insert({
                blog_id: blogId,
                name: wpTag.name,
                slug: wpTag.slug,
                description: wpTag.description || "",
                wordpress_id: wpTag.id,
              })
              .select()
              .single();

            results.push({
              success: !error,
              message: error ? `Erro: ${error.message}` : "Tag sincronizada",
              wordpress_post_id: wpTag.id,
              supabase_post_id: newTag?.id,
            });
          }
        } catch (error) {
          results.push({
            success: false,
            message: `Erro ao sincronizar tag ${wpTag.id}`,
          });
        }
      }

      return results;
    } catch (error) {
      return [{ success: false, message: `Erro geral: ${error}` }];
    }
  }

  // Sincronizar mídia do WordPress para Supabase
  async syncMediaFromWordPress(blogId: string): Promise<WordPressSyncResult[]> {
    try {
      const config = await this.getWordPressConfig(blogId);
      if (!config) throw new Error("Configuração WordPress não encontrada");

      const wpMedia = await this.getWordPressMedia(config, { per_page: 100 });
      const results: WordPressSyncResult[] = [];

      for (const media of wpMedia) {
        try {
          // Verificar se mídia já existe no Supabase
          const { data: existingMedia } = await this.supabase
            .from("media_assets")
            .select("id")
            .eq("wordpress_id", media.id)
            .eq("blog_id", blogId)
            .single();

          if (!existingMedia) {
            const { data: newMedia, error } = await this.supabase
              .from("media_assets")
              .insert({
                blog_id: blogId,
                filename: media.title.rendered || `media_${media.id}`,
                original_filename: media.title.rendered,
                file_url: media.source_url,
                file_type: media.media_type,
                mime_type: media.mime_type,
                width: media.media_details?.width,
                height: media.media_details?.height,
                alt_text: media.alt_text || "",
                caption: media.caption?.rendered || "",
                wordpress_id: media.id,
              })
              .select()
              .single();

            results.push({
              success: !error,
              message: error ? `Erro: ${error.message}` : "Mídia sincronizada",
              wordpress_post_id: media.id,
              supabase_post_id: newMedia?.id,
            });
          }
        } catch (error) {
          results.push({
            success: false,
            message: `Erro ao sincronizar mídia ${media.id}`,
          });
        }
      }

      return results;
    } catch (error) {
      return [{ success: false, message: `Erro geral: ${error}` }];
    }
  }

  // Sincronização completa (todos os dados)
  async fullSyncFromWordPress(blogId: string): Promise<{
    posts: WordPressSyncResult[];
    categories: WordPressSyncResult[];
    tags: WordPressSyncResult[];
    media: WordPressSyncResult[];
  }> {
    const [posts, categories, tags, media] = await Promise.all([
      this.syncPostsFromWordPress(blogId),
      this.syncCategoriesFromWordPress(blogId),
      this.syncTagsFromWordPress(blogId),
      this.syncMediaFromWordPress(blogId),
    ]);

    return { posts, categories, tags, media };
  }

  // ==================== BACKUP E RESTAURAÇÃO ====================

  async createWordPressBackup(
    config: WordPressConfig
  ): Promise<WordPressBackup | null> {
    try {
      const [posts, categories, tags, media, users, settings] =
        await Promise.all([
          this.getWordPressPosts(config, { per_page: -1 }),
          this.getWordPressCategories(config),
          this.getWordPressTags(config),
          this.getWordPressMedia(config, { per_page: 100 }),
          this.getWordPressUsers(config),
          this.getWordPressSettings(config),
        ]);

      const backup: WordPressBackup = {
        id: `backup_${Date.now()}`,
        site_url: config.base_url,
        created_at: new Date().toISOString(),
        version: "1.0",
        data: {
          posts,
          categories,
          tags,
          media,
          users,
          settings,
        },
        size: JSON.stringify({
          posts,
          categories,
          tags,
          media,
          users,
          settings,
        }).length,
      };

      return backup;
    } catch (error) {
      console.error("Erro ao criar backup:", error);
      return null;
    }
  }

  // ==================== ESTATÍSTICAS ====================

  async getIntegrationStats(
    blogId: string
  ): Promise<WordPressIntegrationStats> {
    try {
      const config = await this.getWordPressConfig(blogId);
      const stats: WordPressIntegrationStats = {
        total_posts: 0,
        synced_posts: 0,
        pending_sync: 0,
        last_sync: null,
        wordpress_posts: 0,
        supabase_posts: 0,
        sync_errors: 0,
        connection_status: "disconnected",
      };

      if (config) {
        const connectionTest = await this.testConnection(config);
        stats.connection_status = connectionTest.success
          ? "connected"
          : "error";

        if (connectionTest.success) {
          const wpPosts = await this.getWordPressPosts(config, { per_page: 1 });
          stats.wordpress_posts = wpPosts.length;
        }
      }

      // Buscar estatísticas do Supabase
      const { data: supabasePosts } = await this.supabase
        .from("content_posts")
        .select("id, wordpress_post_id")
        .eq("blog_id", blogId);

      if (supabasePosts) {
        stats.supabase_posts = supabasePosts.length;
        stats.synced_posts = supabasePosts.filter(
          (p) => p.wordpress_post_id
        ).length;
        stats.pending_sync = supabasePosts.filter(
          (p) => !p.wordpress_post_id
        ).length;
      }

      return stats;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return {
        total_posts: 0,
        synced_posts: 0,
        pending_sync: 0,
        last_sync: null,
        wordpress_posts: 0,
        supabase_posts: 0,
        sync_errors: 0,
        connection_status: "error",
      };
    }
  }

  // ==================== UTILITÁRIOS ====================

  private mapSupabaseStatusToWordPress(
    status: string
  ): "publish" | "future" | "draft" | "pending" | "private" {
    const statusMap: Record<
      string,
      "publish" | "future" | "draft" | "pending" | "private"
    > = {
      draft: "draft",
      review: "pending",
      published: "publish",
      scheduled: "future",
      archived: "private",
    };
    return statusMap[status] || "draft";
  }

  private mapWordPressStatusToSupabase(status: string): string {
    const statusMap: Record<string, string> = {
      draft: "draft",
      pending: "review",
      publish: "published",
      future: "scheduled",
      private: "archived",
    };
    return statusMap[status] || "draft";
  }
}

export const wordpressService = new WordPressIntegrationService();
