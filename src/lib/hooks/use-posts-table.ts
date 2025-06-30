
"use client";

import { useState, useEffect } from "react";
import { usePosts, useDeletePost, useTogglePostStatus, type PostFilters } from "@/lib/hooks/use-posts";
import { useAppStore } from "@/lib/stores/app-store";
import { toast } from "sonner";
import type { Database } from "@/lib/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

export function usePostsTable(initialFilters?: PostFilters) {
  const { selectedBlog } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  const [tempFilters, setTempFilters] = useState<PostFilters>({
    blog_id: selectedBlog || "all",
    search: "",
    status: undefined,
    author_id: undefined,
    focus_keyword: "",
    seo_score_min: undefined,
    seo_score_max: undefined,
    word_count_min: undefined,
    word_count_max: undefined,
    sortBy: "created_at",
    sortOrder: "desc",
    limit: 50,
    ...initialFilters,
  });

  const [appliedFilters, setAppliedFilters] = useState<PostFilters>(tempFilters);

  const { data: posts, isLoading, refetch } = usePosts(appliedFilters);
  const deletePost = useDeletePost();
  const toggleStatus = useTogglePostStatus();

  useEffect(() => {
    const newBlogId = selectedBlog || "all";
    setTempFilters((prev) => ({ ...prev, blog_id: newBlogId }));
    setAppliedFilters((prev) => ({ ...prev, blog_id: newBlogId }));
  }, [selectedBlog]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: PostFilters = {
      blog_id: selectedBlog || "all",
      search: "",
      sortBy: "created_at",
      sortOrder: "desc",
      limit: 50,
    };
    setTempFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  const handleQuickSearch = (value: string) => {
    setTempFilters((prev) => ({ ...prev, search: value }));
    setAppliedFilters((prev) => ({ ...prev, search: value }));
  };

  const handleSort = (field: PostFilters["sortBy"]) => {
    const newOrder =
      appliedFilters.sortBy === field && appliedFilters.sortOrder === "asc"
        ? ("desc" as "desc")
        : ("asc" as "asc");
    const newFilters = {
      ...appliedFilters,
      sortBy: field,
      sortOrder: newOrder,
    };
    setAppliedFilters(newFilters);
    setTempFilters(newFilters);
  };

  const handleEdit = (postId: string, onEdit?: (postId: string) => void) => {
    if (onEdit) {
      onEdit(postId);
    } else {
      toast.success("Modal de edição será aberto aqui!");
    }
  };

  const handleView = (postId: string, onView?: (postId: string) => void) => {
    if (onView) {
      onView(postId);
    } else {
      toast.success("Visualização do post será exibida aqui!");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm("Tem certeza que deseja deletar este post?")) {
      try {
        await deletePost.mutateAsync(postId);
        refetch();
      } catch (error) {
        console.error("Erro ao deletar post:", error);
      }
    }
  };

  const handleToggleStatus = async (postId: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await toggleStatus.mutateAsync({
        id: postId,
        status: newStatus as "draft" | "published" | "scheduled",
        blogId: selectedBlog || undefined,
      });
      refetch();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return "CheckCircle";
      case "draft":
        return "Edit3";
      case "scheduled":
        return "Calendar";
      case "review":
        return "AlertCircle";
      case "archived":
        return "Pause";
      default:
        return "AlertCircle";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      case "archived":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getSeoScoreColor = (score: number | null) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const formatNumber = (num: number | null) => {
    return num ? num.toLocaleString() : "0";
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (tempFilters.search) count++;
    if (tempFilters.status) count++;
    if (tempFilters.focus_keyword) count++;
    if (tempFilters.seo_score_min) count++;
    if (tempFilters.seo_score_max) count++;
    if (tempFilters.word_count_min) count++;
    if (tempFilters.word_count_max) count++;
    return count;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Rascunho";
      case "scheduled":
        return "Agendado";
      case "archived":
        return "Arquivado";
      default:
        return status;
    }
  };

  const getSortIcon = (field: PostFilters["sortBy"]) => {
    if (appliedFilters.sortBy !== field) return "ArrowUpDown";
    return appliedFilters.sortOrder === "asc" ? "ArrowUp" : "ArrowDown";
  };

  return {
    selectedBlog,
    showFilters,
    setShowFilters,
    tempFilters,
    setTempFilters,
    appliedFilters,
    setAppliedFilters,
    posts,
    isLoading,
    refetch,
    deletePost,
    toggleStatus,
    handleApplyFilters,
    handleClearFilters,
    handleQuickSearch,
    handleSort,
    handleEdit,
    handleView,
    handleDeletePost,
    handleToggleStatus,
    getStatusIcon,
    getStatusColor,
    getSeoScoreColor,
    formatDate,
    formatNumber,
    getActiveFiltersCount,
    getStatusLabel,
    getSortIcon,
  };
}
