"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./use-supabase";
import { toast } from "sonner";
import type { Database } from "@/lib/types/database";
import { createClient } from "../supabase/client";
import { useAppStore } from "../stores/app-store";

// Interfaces
export interface PostFilters {
  search?: string;
  status?: "draft" | "published" | "scheduled" | "review" | "archived";
  author_id?: string;
  blog_id?: string;
  focus_keyword?: string;
  sortBy?:
    | "created_at"
    | "updated_at"
    | "published_at"
    | "seo_score"
    | "word_count"
    | "title";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  seo_score_min?: number;
  seo_score_max?: number;
  word_count_min?: number;
  word_count_max?: number;
}

export interface PostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  reviewPosts: number;
  archivedPosts: number;
  avgSeoScore: number;
  avgReadabilityScore: number;
  totalWordCount: number;
  avgWordCount: number;
  avgReadingTime: number;
}

export interface CreatePostData {
  blog_id: string;
  author_id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: "draft" | "published" | "scheduled" | "review" | "archived";
  featured_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  scheduled_at?: string;
  published_at?: string;
  readability_score?: number;
  seo_score?: number;
  word_count?: number;
  reading_time?: number;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

type Post = Database["public"]["Tables"]["content_posts"]["Row"];
type PostInsert = Database["public"]["Tables"]["content_posts"]["Insert"];
type PostUpdate = Database["public"]["Tables"]["content_posts"]["Update"];

// Hook principal para listagem de posts
export function usePosts(filters?: PostFilters) {
  const supabase = createClient();
  const { selectedBlog } = useAppStore();

  return useQuery({
    queryKey: ["posts", selectedBlog, filters],
    queryFn: async () => {
      let query = supabase.from("content_posts").select(`
          *,
          blogs!inner(
            id,
            name,
            domain
          ),
          authors!inner(
            id,
            name,
            email
          )
        `);

      // Filtrar por blog selecionado ou por filtro
      const blogFilter = filters?.blog_id || selectedBlog;
      if (blogFilter && blogFilter !== "all") {
        query = query.eq("blog_id", blogFilter);
      }

      // Aplicar outros filtros
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,seo_title.ilike.%${filters.search}%`
        );
      }

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.author_id) {
        query = query.eq("author_id", filters.author_id);
      }

      if (filters?.focus_keyword) {
        query = query.ilike("focus_keyword", `%${filters.focus_keyword}%`);
      }

      if (filters?.seo_score_min !== undefined) {
        query = query.gte("seo_score", filters.seo_score_min);
      }

      if (filters?.seo_score_max !== undefined) {
        query = query.lte("seo_score", filters.seo_score_max);
      }

      if (filters?.word_count_min !== undefined) {
        query = query.gte("word_count", filters.word_count_min);
      }

      if (filters?.word_count_max !== undefined) {
        query = query.lte("word_count", filters.word_count_max);
      }

      // Ordenação
      const sortBy = filters?.sortBy || "created_at";
      const sortOrder = filters?.sortOrder || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // Paginação
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 50) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (Post & {
        blogs: {
          id: string;
          name: string;
          domain: string | null;
        };
        authors: {
          id: string;
          name: string;
          email: string;
        };
      })[];
    },
  });
}

// Hook para buscar um post específico
export function usePost(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_posts")
        .select(
          `
          *,
          blogs!inner(
            id,
            name,
            domain,
            niche,
            description
          ),
          authors!inner(
            id,
            name,
            email,
            bio,
            avatar_url
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Post & {
        blogs: {
          id: string;
          name: string;
          domain: string | null;
          niche: string | null;
          description: string | null;
        };
        authors: {
          id: string;
          name: string;
          email: string;
          bio: string | null;
          avatar_url: string | null;
        };
      };
    },
    enabled: !!id,
  });
}

// Hook para estatísticas de posts
export function usePostStats(blogId?: string) {
  const supabase = createClient();
  const { selectedBlog } = useAppStore();

  return useQuery({
    queryKey: ["post-stats", selectedBlog, blogId],
    queryFn: async () => {
      let query = supabase
        .from("content_posts")
        .select(
          "status, seo_score, readability_score, word_count, reading_time"
        );

      const filterBlog = blogId || selectedBlog;
      if (filterBlog && filterBlog !== "all") {
        query = query.eq("blog_id", filterBlog);
      }

      const { data, error } = await query;

      if (error) throw error;

      const totalPosts = data.length;
      const publishedPosts = data.filter(
        (p) => p.status === "published"
      ).length;
      const draftPosts = data.filter((p) => p.status === "draft").length;
      const scheduledPosts = data.filter(
        (p) => p.status === "scheduled"
      ).length;
      const reviewPosts = data.filter((p) => p.status === "review").length;
      const archivedPosts = data.filter((p) => p.status === "archived").length;

      const postsWithSeoScore = data.filter((p) => p.seo_score !== null);
      const avgSeoScore =
        postsWithSeoScore.length > 0
          ? postsWithSeoScore.reduce((acc, p) => acc + (p.seo_score || 0), 0) /
            postsWithSeoScore.length
          : 0;

      const postsWithReadabilityScore = data.filter(
        (p) => p.readability_score !== null
      );
      const avgReadabilityScore =
        postsWithReadabilityScore.length > 0
          ? postsWithReadabilityScore.reduce(
              (acc, p) => acc + (p.readability_score || 0),
              0
            ) / postsWithReadabilityScore.length
          : 0;

      const totalWordCount = data.reduce(
        (acc, p) => acc + (p.word_count || 0),
        0
      );
      const avgWordCount = totalPosts > 0 ? totalWordCount / totalPosts : 0;
      const avgReadingTime =
        totalPosts > 0
          ? data.reduce((acc, p) => acc + (p.reading_time || 0), 0) / totalPosts
          : 0;

      const stats: PostStats = {
        totalPosts,
        publishedPosts,
        draftPosts,
        scheduledPosts,
        reviewPosts,
        archivedPosts,
        avgSeoScore: Math.round(avgSeoScore),
        avgReadabilityScore: Math.round(avgReadabilityScore),
        totalWordCount,
        avgWordCount: Math.round(avgWordCount),
        avgReadingTime: Math.round(avgReadingTime),
      };

      return stats;
    },
  });
}

// Hook para busca de posts relacionados
export function useRelatedPosts(postId: string, limit: number = 5) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["related-posts", postId, limit],
    queryFn: async () => {
      // Primeiro, buscar o post atual
      const { data: currentPost } = await supabase
        .from("content_posts")
        .select("id, blog_id, focus_keyword")
        .eq("id", postId)
        .single();

      if (!currentPost) return [];

      // Buscar posts relacionados baseado na keyword principal
      let query = supabase
        .from("content_posts")
        .select(
          `
          id, title, slug, excerpt, featured_image_url, published_at, seo_score,
          authors!inner(name, avatar_url)
        `
        )
        .eq("blog_id", currentPost.blog_id)
        .eq("status", "published")
        .neq("id", postId)
        .limit(limit);

      // Se o post atual tem focus_keyword, priorizar posts com keywords similares
      if (currentPost.focus_keyword) {
        query = query.ilike("focus_keyword", `%${currentPost.focus_keyword}%`);
      }

      query = query.order("published_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

// Hook para criar post
export function useCreatePost() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: CreatePostData) => {
      // Gerar slug se não fornecido
      if (!post.slug) {
        post.slug = post.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 100);
      }

      const { data, error } = await supabase
        .from("content_posts")
        .insert(post)
        .select(
          `
          *,
          blogs!inner(name, domain),
          authors!inner(name, email)
        `
        )
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Post criado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao criar post:", error);
      toast.error("Erro ao criar post");
    },
  });
}

// Hook para atualizar post
export function useUpdatePost() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdatePostData) => {
      const { data, error } = await supabase
        .from("content_posts")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          `
          *,
          blogs!inner(name, domain),
          authors!inner(name, email)
        `
        )
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", data.id] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Post atualizado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao atualizar post:", error);
      toast.error("Erro ao atualizar post");
    },
  });
}

// Hook para deletar post
export function useDeletePost() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("content_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Post deletado com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao deletar post:", error);
      toast.error("Erro ao deletar post");
    },
  });
}

// Hook para alterar status do post
export function useTogglePostStatus() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      blogId,
    }: {
      id: string;
      status: "draft" | "published" | "scheduled" | "review" | "archived";
      blogId?: string;
    }) => {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      // Se estiver publicando, definir published_at
      if (status === "published") {
        updateData.published_at = new Date().toISOString();
      } else if (status === "draft") {
        // Se estiver despublicando, limpar published_at
        updateData.published_at = null;
      }

      const { data, error } = await supabase
        .from("content_posts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Sincronizar com WordPress automaticamente para todos os status
      if (blogId) {
        try {
          // Importar o serviço WordPress
          const { WordPressIntegrationService } = await import(
            "../services/wordpress-integration"
          );
          const wpService = new WordPressIntegrationService();

          // Sincronizar com WordPress
          const syncResult = await wpService.syncPostToWordPress(blogId, id);

          if (syncResult.success) {
            if (status === "published") {
              toast.success("Post publicado e sincronizado com WordPress!");
            } else if (status === "draft") {
              toast.success("Post despublicado e atualizado no WordPress!");
            } else {
              toast.success(`Post ${status} e sincronizado com WordPress!`);
            }
          } else {
            toast.warning(
              `Post ${status}, mas houve erro na sincronização com WordPress`
            );
            console.error("Erro na sincronização:", syncResult.message);
          }
        } catch (error) {
          console.error("Erro na sincronização automática:", error);
          toast.warning(
            `Post ${status}, mas houve erro na sincronização automática`
          );
        }
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", data.id] });
      queryClient.invalidateQueries({ queryKey: ["post-stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["wordpress-posts"] });

      if (data.status !== "published") {
        toast.success("Status do post atualizado!");
      }
    },
    onError: (error: Error) => {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do post");
    },
  });
}

// Hook para buscar autores
export function useAuthors(blogId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["authors", blogId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data;
    },
  });
}
