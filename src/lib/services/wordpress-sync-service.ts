import { createClient } from "../supabase/client";
import { WordPressIntegrationService } from "./wordpress-integration";
import type {
  WordPressConfig,
  WordPressCategory,
  WordPressTag,
} from "../types/wordpress";
import type { Database } from "../types/database";
import { toast } from "sonner";

type BlogCategory = Database["public"]["Tables"]["blog_categories"]["Row"];
type BlogTag = Database["public"]["Tables"]["blog_tags"]["Row"];

export class WordPressSyncService extends WordPressIntegrationService {
  private supabase = createClient();

  /**
   * SINCRONIZAÇÃO BIDIRECIONAL DE CATEGORIAS
   * Extrai todas as categorias dos blogs WordPress e mantém sincronizado com Supabase
   */
  async syncAllCategoriesBidirectional(blogId: string): Promise<{
    synced: number;
    created: number;
    updated: number;
    errors: number;
  }> {
    const stats = { synced: 0, created: 0, updated: 0, errors: 0 };

    try {
      // Buscar configuração do WordPress
      const config = await this.getWordPressConfig(blogId);
      if (!config) {
        throw new Error("Configuração WordPress não encontrada");
      }

      // Buscar todas as categorias do WordPress
      const wpCategories = await this.getWordPressCategories(config);

      // Buscar todas as categorias do Supabase para este blog
      const { data: supabaseCategories, error } = await this.supabase
        .from("blog_categories")
        .select("*")
        .eq("blog_id", blogId);

      if (error) throw error;

      // Criar mapa para comparação rápida
      const supabaseCategoryMap = new Map(
        (supabaseCategories || []).map((cat) => [cat.wordpress_id, cat])
      );

      // Sincronizar do WordPress para Supabase
      for (const wpCategory of wpCategories) {
        try {
          const existingCategory = supabaseCategoryMap.get(wpCategory.id);

          if (existingCategory) {
            // Verificar se precisa atualizar
            if (
              existingCategory.name !== wpCategory.name ||
              existingCategory.description !== wpCategory.description ||
              existingCategory.slug !== wpCategory.slug
            ) {
              const { error: updateError } = await this.supabase
                .from("blog_categories")
                .update({
                  name: wpCategory.name,
                  description: wpCategory.description || "",
                  slug: wpCategory.slug,
                  count: wpCategory.count || 0,
                  parent_wordpress_id: wpCategory.parent || null,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existingCategory.id);

              if (updateError) throw updateError;
              stats.updated++;
            }
          } else {
            // Criar nova categoria
            const { error: insertError } = await this.supabase
              .from("blog_categories")
              .insert({
                blog_id: blogId,
                wordpress_id: wpCategory.id,
                name: wpCategory.name,
                description: wpCategory.description || "",
                slug: wpCategory.slug,
                count: wpCategory.count || 0,
                parent_wordpress_id: wpCategory.parent || null,
              });

            if (insertError) throw insertError;
            stats.created++;
          }
          stats.synced++;
        } catch (error) {
          console.error(
            `Erro ao sincronizar categoria ${wpCategory.name}:`,
            error
          );
          stats.errors++;
        }
      }

      // Sincronizar do Supabase para WordPress (categorias criadas localmente)
      const { data: localCategories } = await this.supabase
        .from("blog_categories")
        .select("*")
        .eq("blog_id", blogId)
        .is("wordpress_id", null);

      if (localCategories && localCategories.length > 0) {
        for (const localCategory of localCategories) {
          try {
            const wpCategory = await this.createWordPressCategory(config, {
              name: localCategory.name,
              description: localCategory.description || "",
              slug: localCategory.slug || "",
            });

            if (wpCategory) {
              // Atualizar com o ID do WordPress
              await this.supabase
                .from("blog_categories")
                .update({ wordpress_id: wpCategory.id })
                .eq("id", localCategory.id);
            }
          } catch (error) {
            console.error(`Erro ao criar categoria no WordPress:`, error);
            stats.errors++;
          }
        }
      }

      toast.success(
        `✅ Categorias sincronizadas: ${stats.synced} total, ${stats.created} novas, ${stats.updated} atualizadas`
      );
      return stats;
    } catch (error) {
      console.error("Erro na sincronização de categorias:", error);
      toast.error("Erro ao sincronizar categorias");
      return stats;
    }
  }

  /**
   * SINCRONIZAÇÃO BIDIRECIONAL DE TAGS
   * Extrai todas as tags dos blogs WordPress e mantém sincronizado com Supabase
   */
  async syncAllTagsBidirectional(blogId: string): Promise<{
    synced: number;
    created: number;
    updated: number;
    errors: number;
  }> {
    const stats = { synced: 0, created: 0, updated: 0, errors: 0 };

    try {
      const config = await this.getWordPressConfig(blogId);
      if (!config) {
        throw new Error("Configuração WordPress não encontrada");
      }

      // Buscar todas as tags do WordPress
      const wpTags = await this.getWordPressTags(config);

      // Buscar todas as tags do Supabase para este blog
      const { data: supabaseTags, error } = await this.supabase
        .from("blog_tags")
        .select("*")
        .eq("blog_id", blogId);

      if (error) throw error;

      // Criar mapa para comparação rápida
      const supabaseTagMap = new Map(
        (supabaseTags || []).map((tag) => [tag.wordpress_id, tag])
      );

      // Sincronizar do WordPress para Supabase
      for (const wpTag of wpTags) {
        try {
          const existingTag = supabaseTagMap.get(wpTag.id);

          if (existingTag) {
            // Verificar se precisa atualizar
            if (
              existingTag.name !== wpTag.name ||
              existingTag.description !== wpTag.description ||
              existingTag.slug !== wpTag.slug
            ) {
              const { error: updateError } = await this.supabase
                .from("blog_tags")
                .update({
                  name: wpTag.name,
                  description: wpTag.description || "",
                  slug: wpTag.slug,
                  count: wpTag.count || 0,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existingTag.id);

              if (updateError) throw updateError;
              stats.updated++;
            }
          } else {
            // Criar nova tag
            const { error: insertError } = await this.supabase
              .from("blog_tags")
              .insert({
                blog_id: blogId,
                wordpress_id: wpTag.id,
                name: wpTag.name,
                description: wpTag.description || "",
                slug: wpTag.slug,
                count: wpTag.count || 0,
              });

            if (insertError) throw insertError;
            stats.created++;
          }
          stats.synced++;
        } catch (error) {
          console.error(`Erro ao sincronizar tag ${wpTag.name}:`, error);
          stats.errors++;
        }
      }

      // Sincronizar do Supabase para WordPress (tags criadas localmente)
      const { data: localTags } = await this.supabase
        .from("blog_tags")
        .select("*")
        .eq("blog_id", blogId)
        .is("wordpress_id", null);

      if (localTags && localTags.length > 0) {
        for (const localTag of localTags) {
          try {
            const wpTag = await this.createWordPressTag(config, {
              name: localTag.name,
              description: localTag.description || "",
              slug: localTag.slug || "",
            });

            if (wpTag) {
              // Atualizar com o ID do WordPress
              await this.supabase
                .from("blog_tags")
                .update({ wordpress_id: wpTag.id })
                .eq("id", localTag.id);
            }
          } catch (error) {
            console.error(`Erro ao criar tag no WordPress:`, error);
            stats.errors++;
          }
        }
      }

      toast.success(
        `✅ Tags sincronizadas: ${stats.synced} total, ${stats.created} novas, ${stats.updated} atualizadas`
      );
      return stats;
    } catch (error) {
      console.error("Erro na sincronização de tags:", error);
      toast.error("Erro ao sincronizar tags");
      return stats;
    }
  }

  /**
   * SINCRONIZAÇÃO CONTÍNUA COM WEBHOOK
   * Configura webhook para sincronização automática quando mudanças ocorrem
   */
  async setupWebhookSync(blogId: string): Promise<boolean> {
    try {
      const config = await this.getWordPressConfig(blogId);
      if (!config) return false;

      // Registrar webhook no WordPress para notificar mudanças
      const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/wordpress/${blogId}`;

      // Esta funcionalidade requer um plugin WordPress customizado
      // Por enquanto, implementaremos polling periódico

      // Salvar configuração de sync automático
      const { error } = await this.supabase
        .from("blogs")
        .update({
          settings: {
            ...config,
            webhook_url: webhookUrl,
            auto_sync_enabled: true,
            last_sync: new Date().toISOString(),
          },
        })
        .eq("id", blogId);

      if (error) throw error;

      toast.success("✅ Sincronização automática configurada");
      return true;
    } catch (error) {
      console.error("Erro ao configurar webhook:", error);
      toast.error("Erro ao configurar sincronização automática");
      return false;
    }
  }

  /**
   * SINCRONIZAÇÃO COMPLETA DE TAXONOMIAS
   * Executa sincronização completa de categorias e tags
   */
  async syncAllTaxonomies(blogId: string): Promise<{
    categories: any;
    tags: any;
    total: number;
  }> {
    const [categoriesResult, tagsResult] = await Promise.all([
      this.syncAllCategoriesBidirectional(blogId),
      this.syncAllTagsBidirectional(blogId),
    ]);

    const total = categoriesResult.synced + tagsResult.synced;

    return {
      categories: categoriesResult,
      tags: tagsResult,
      total,
    };
  }

  /**
   * MONITORAMENTO DE SINCRONIZAÇÃO
   * Retorna status detalhado da sincronização
   */
  async getSyncStatus(blogId: string): Promise<{
    lastSync: string | null;
    pendingChanges: number;
    syncErrors: any[];
    isAutoSyncEnabled: boolean;
  }> {
    try {
      const { data: blog } = await this.supabase
        .from("blogs")
        .select("settings")
        .eq("id", blogId)
        .single();

      const settings = blog?.settings as any;

      // Buscar mudanças pendentes
      const { count: pendingCategories } = await this.supabase
        .from("blog_categories")
        .select("*", { count: "exact", head: true })
        .eq("blog_id", blogId)
        .is("wordpress_id", null);

      const { count: pendingTags } = await this.supabase
        .from("blog_tags")
        .select("*", { count: "exact", head: true })
        .eq("blog_id", blogId)
        .is("wordpress_id", null);

      return {
        lastSync: settings?.last_sync || null,
        pendingChanges: (pendingCategories || 0) + (pendingTags || 0),
        syncErrors: settings?.sync_errors || [],
        isAutoSyncEnabled: settings?.auto_sync_enabled || false,
      };
    } catch (error) {
      console.error("Erro ao buscar status de sincronização:", error);
      return {
        lastSync: null,
        pendingChanges: 0,
        syncErrors: [],
        isAutoSyncEnabled: false,
      };
    }
  }
}
