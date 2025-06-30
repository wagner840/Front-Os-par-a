"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PostsTable } from "@/components/features/posts/posts-table";
import { PostFormSimple } from "@/components/features/posts/post-form-simple";
import { PostViewer } from "@/components/features/posts/post-viewer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedMetric } from "@/components/ui/animated-metric";
import { usePosts } from "@/lib/hooks/use-posts";
import { Plus, Search, Filter, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAppStore } from "@/lib/stores/app-store";

type PostStatus = "draft" | "published" | "scheduled" | "archived";
type SortBy =
  | "created_at"
  | "updated_at"
  | "published_at"
  | "seo_score"
  | "word_count";

interface Post {
  id: string;
  status: PostStatus;
  seo_score?: number;
  word_count?: number;
  title?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export default function PostsPage() {
  const { selectedBlog } = useAppStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");

  const {
    data: posts = [],
    isLoading,
    error,
    refetch,
  } = usePosts({
    search: searchTerm || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as PostStatus),
    sortBy: sortBy as SortBy,
  });

  // Type-safe post processing
  const typedPosts = (Array.isArray(posts) ? posts : []) as Post[];

  // Calculate metrics safely
  const totalPosts = typedPosts.length;
  const publishedPosts = typedPosts.filter(
    (post: Post) => post.status === "published"
  ).length;
  const draftPosts = typedPosts.filter(
    (post: Post) => post.status === "draft"
  ).length;

  // Safe SEO score calculation
  const postsWithSeoScore = typedPosts.filter(
    (post: Post) =>
      post.seo_score !== null &&
      post.seo_score !== undefined &&
      !isNaN(post.seo_score)
  );

  const avgSeoScore =
    postsWithSeoScore.length > 0
      ? Math.round(
          postsWithSeoScore.reduce(
            (acc: number, post: Post) => acc + (post.seo_score || 0),
            0
          ) / postsWithSeoScore.length
        )
      : 0;

  const handleExport = () => {
    try {
      const exportData = typedPosts.map((post) => ({
        id: post.id,
        title: post.title || "Sem título",
        status: post.status,
        seo_score: post.seo_score || 0,
        word_count: post.word_count || 0,
        created_at: post.created_at,
        updated_at: post.updated_at,
        published_at: post.published_at,
      }));

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `posts_${
        new Date().toISOString().split("T")[0]
      }.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      toast.success("Posts exportados com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar posts:", error);
      toast.error("Erro ao exportar posts");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`Importando ${file.name}...`);
        // TODO: Implementar lógica de importação real
        setTimeout(() => {
          toast.success(
            "Importação simulada - implementar funcionalidade real"
          );
          refetch();
        }, 2000);
      }
    };
    input.click();
  };

  const handleEditPost = (postId: string) => {
    if (!postId) {
      toast.error("ID do post inválido");
      return;
    }
    setSelectedPostId(postId);
    setIsEditModalOpen(true);
  };

  const handleViewPost = (postId: string) => {
    if (!postId) {
      toast.error("ID do post inválido");
      return;
    }
    setSelectedPostId(postId);
    setIsViewerOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPostId(null);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedPostId(null);
  };

  const handlePostSaved = () => {
    refetch();
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedPostId(null);
    toast.success("Post salvo com sucesso!");
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Posts" },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout
        title="Gerenciamento de Posts"
        description="Carregando posts..."
        breadcrumbItems={breadcrumbItems}
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout
        title="Gerenciamento de Posts"
        description="Erro ao carregar posts"
        breadcrumbItems={breadcrumbItems}
      >
        <GlassCard>
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Erro ao carregar posts:</p>
            <p className="text-white/60 mb-6">
              {error.message || "Erro desconhecido"}
            </p>
            <Button onClick={() => refetch()}>Tentar Novamente</Button>
          </div>
        </GlassCard>
      </DashboardLayout>
    );
  }

  // Show empty state when no blog is selected
  if (!selectedBlog) {
    return (
      <DashboardLayout
        title="Gerenciamento de Posts"
        description="Selecione um blog para continuar"
        breadcrumbItems={breadcrumbItems}
      >
        <GlassCard>
          <div className="text-center py-12">
            <p className="text-white/60 mb-4">Nenhum blog selecionado</p>
            <p className="text-white/40">
              Selecione um blog no menu lateral para visualizar os posts
            </p>
          </div>
        </GlassCard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Gerenciamento de Posts"
      description="Crie, edite e gerencie todos os seus posts de conteúdo"
      breadcrumbItems={breadcrumbItems}
    >
      {/* Métricas */}
      <div className="responsive-grid">
        <AnimatedMetric
          title="Total de Posts"
          value={totalPosts}
          trend="up"
          className="glow-blue"
        />
        <AnimatedMetric
          title="Posts Publicados"
          value={publishedPosts}
          trend="up"
          className="glow-green"
        />
        <AnimatedMetric
          title="Rascunhos"
          value={draftPosts}
          trend="up"
          className="glow-purple"
        />
        <AnimatedMetric
          title="SEO Score Médio"
          value={avgSeoScore}
          suffix="%"
          trend="up"
          className="glow-blue"
        />
      </div>

      {/* Filtros e Ações */}
      <GlassCard>
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Busca */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                type="text"
                placeholder="Buscar posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Filtro de Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] form-input">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-lg border border-white/20">
                <SelectItem
                  value="all"
                  className="text-white hover:bg-white/10"
                >
                  Todos os Status
                </SelectItem>
                <SelectItem
                  value="published"
                  className="text-white hover:bg-white/10"
                >
                  Publicado
                </SelectItem>
                <SelectItem
                  value="draft"
                  className="text-white hover:bg-white/10"
                >
                  Rascunho
                </SelectItem>
                <SelectItem
                  value="scheduled"
                  className="text-white hover:bg-white/10"
                >
                  Agendado
                </SelectItem>
                <SelectItem
                  value="archived"
                  className="text-white hover:bg-white/10"
                >
                  Arquivado
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Ordenação */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] form-input">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-lg border border-white/20">
                <SelectItem
                  value="created_at"
                  className="text-white hover:bg-white/10"
                >
                  Data de Criação
                </SelectItem>
                <SelectItem
                  value="updated_at"
                  className="text-white hover:bg-white/10"
                >
                  Última Atualização
                </SelectItem>
                <SelectItem
                  value="published_at"
                  className="text-white hover:bg-white/10"
                >
                  Data de Publicação
                </SelectItem>
                <SelectItem
                  value="seo_score"
                  className="text-white hover:bg-white/10"
                >
                  SEO Score
                </SelectItem>
                <SelectItem
                  value="word_count"
                  className="text-white hover:bg-white/10"
                >
                  Contagem de Palavras
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Botões de Importar/Exportar */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImport}
                className="flex-1 sm:flex-none"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Importar</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex-1 sm:flex-none"
                disabled={isLoading || totalPosts === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>

            {/* Botão Criar Post */}
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className="flex-1 sm:flex-none"
                  disabled={isLoading || !selectedBlog}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Post</DialogTitle>
                  <DialogDescription>
                    Crie um novo post preenchendo os campos abaixo. Você pode
                    salvar como rascunho ou publicar imediatamente.
                  </DialogDescription>
                </DialogHeader>
                <PostFormSimple
                  onSuccess={handlePostSaved}
                  onCancel={handleCloseCreateModal}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </GlassCard>

      {/* Tabela de Posts */}
      <PostsTable
        onEdit={handleEditPost}
        onView={handleViewPost}
        initialFilters={{
          search: searchTerm || undefined,
          status:
            statusFilter === "all" ? undefined : (statusFilter as PostStatus),
          sortBy: sortBy as SortBy,
        }}
      />

      {/* Modal de Edição */}
      {selectedPostId && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Post</DialogTitle>
              <DialogDescription>
                Edite o post selecionado. Suas alterações serão salvas quando
                você clicar em salvar.
              </DialogDescription>
            </DialogHeader>
            <PostFormSimple
              onSuccess={handlePostSaved}
              onCancel={handleCloseEditModal}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Visualização */}
      {selectedPostId && (
        <PostViewer
          postId={selectedPostId}
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
        />
      )}
    </DashboardLayout>
  );
}
