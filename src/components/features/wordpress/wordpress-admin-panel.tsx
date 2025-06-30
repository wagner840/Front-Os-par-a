"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  FileText,
  Tags,
  FolderOpen,
  Users,
  MessageSquare,
  Image,
  Settings,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  BarChart3,
  PenTool,
  Archive,
  Send,
  Star,
  Zap,
  AlertTriangle,
  Hash,
  Activity,
  Shield,
  Sparkles,
  Database,
  GitBranch,
  Globe,
  Link,
  Palette,
  Code,
  FileCode,
  Layers,
  Copy,
  Package,
  Terminal,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useWordPressIntegration } from "@/lib/hooks/use-wordpress-integration";
import { useAppStore } from "@/lib/stores/app-store";

interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  status: string;
  date: string;
  author: number;
  categories: number[];
  tags: number[];
  featured_media: number;
  link: string;
  slug: string;
  format: string;
  comment_status: string;
  ping_status: string;
}

interface BulkAction {
  action: "status" | "categories" | "tags" | "author" | "delete";
  value?: any;
}

export function WordPressAdminPanel() {
  const { selectedBlog } = useAppStore();
  const [activeTab, setActiveTab] = useState("posts");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<BulkAction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showRevisions, setShowRevisions] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<File[]>([]);

  const {
    posts,
    categories,
    tags,
    media,
    users,
    comments,
    isLoading,
    createPost,
    updatePost,
    deletePost,
    bulkUpdatePosts,
    uploadMedia,
    syncTaxonomies,
  } = useWordPressIntegration(selectedBlog || undefined);

  // Filtrar posts baseado na busca e status
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = post.title.rendered
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handler para seleção em massa
  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredPosts) {
      setSelectedPosts(filteredPosts.map((p) => p.id));
    } else {
      setSelectedPosts([]);
    }
  };

  // Handler para drag and drop de mídia
  const handleMediaDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        try {
          const uploadedMedia = await uploadMedia.mutateAsync({
            file,
            title: file.name.split(".")[0],
            alt: file.name.split(".")[0],
          });

          if (uploadedMedia) {
            toast.success(`✅ ${file.name} enviado com sucesso!`);

            // Inserir no editor se houver um post sendo editado
            if (window.activeEditor) {
              const imgTag = `<img src="${uploadedMedia.source_url}" alt="${uploadedMedia.alt_text}" width="${uploadedMedia.media_details?.width}" height="${uploadedMedia.media_details?.height}" />`;
              window.activeEditor.insertContent(imgTag);
            }
          }
        } catch (error) {
          toast.error(`❌ Erro ao enviar ${file.name}`);
        }
      }
    }
  };

  // Handler para ações em massa
  const handleBulkAction = async () => {
    if (!bulkAction || selectedPosts.length === 0) return;

    setIsProcessing(true);
    const results = await bulkUpdatePosts.mutateAsync({
      postIds: selectedPosts,
      action: bulkAction,
    });

    const successCount = results.filter((r) => r.success).length;
    toast.success(
      `✅ ${successCount} de ${selectedPosts.length} posts atualizados`
    );

    setSelectedPosts([]);
    setBulkAction(null);
    setIsProcessing(false);
  };

  // Handler para mudança de status
  const handleStatusChange = async (postId: number, newStatus: string) => {
    try {
      await updatePost.mutateAsync({
        id: postId,
        data: { status: newStatus },
      });
      toast.success(`✅ Status atualizado para ${newStatus}`);
    } catch (error) {
      toast.error("❌ Erro ao atualizar status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Posts</p>
              <p className="text-2xl font-bold text-white">
                {posts?.length || 0}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Publicados</p>
              <p className="text-2xl font-bold text-green-400">
                {posts?.filter((p) => p.status === "publish").length || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Rascunhos</p>
              <p className="text-2xl font-bold text-yellow-400">
                {posts?.filter((p) => p.status === "draft").length || 0}
              </p>
            </div>
            <Edit className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Agendados</p>
              <p className="text-2xl font-bold text-purple-400">
                {posts?.filter((p) => p.status === "future").length || 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Tabs Principais */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-white/10 backdrop-blur-md border border-white/20">
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="w-4 h-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <Image className="w-4 h-4" />
            Mídia
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-2">
            <Tags className="w-4 h-4" />
            Tags
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Comentários
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* POSTS TAB */}
        <TabsContent value="posts" className="space-y-4">
          {/* Toolbar de Posts */}
          <GlassCard className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Buscar posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              {/* Filtros */}
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="all">Todos Status</option>
                  <option value="publish">Publicados</option>
                  <option value="draft">Rascunhos</option>
                  <option value="future">Agendados</option>
                  <option value="pending">Pendentes</option>
                  <option value="private">Privados</option>
                  <option value="trash">Lixeira</option>
                </select>

                <AnimatedButton
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                >
                  {viewMode === "grid" ? (
                    <List className="w-4 h-4" />
                  ) : (
                    <Grid className="w-4 h-4" />
                  )}
                </AnimatedButton>
              </div>

              {/* Ações em Massa */}
              {selectedPosts.length > 0 && (
                <div className="flex gap-2">
                  <select
                    onChange={(e) => setBulkAction(JSON.parse(e.target.value))}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="">Ação em massa...</option>
                    <option value='{"action":"status","value":"publish"}'>
                      Publicar
                    </option>
                    <option value='{"action":"status","value":"draft"}'>
                      Tornar Rascunho
                    </option>
                    <option value='{"action":"status","value":"trash"}'>
                      Mover para Lixeira
                    </option>
                    <option value='{"action":"delete","value":true}'>
                      Deletar Permanentemente
                    </option>
                  </select>

                  <AnimatedButton
                    variant="primary"
                    size="sm"
                    onClick={handleBulkAction}
                    disabled={!bulkAction || isProcessing}
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Aplicar ({selectedPosts.length})
                      </>
                    )}
                  </AnimatedButton>
                </div>
              )}
            </div>

            {/* Checkbox Selecionar Todos */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  selectedPosts.length === filteredPosts?.length &&
                  filteredPosts.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-white/60 text-sm">
                Selecionar todos ({filteredPosts?.length || 0} posts)
              </span>
            </div>
          </GlassCard>

          {/* Lista/Grid de Posts */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {filteredPosts?.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPosts([...selectedPosts, post.id]);
                          } else {
                            setSelectedPosts(
                              selectedPosts.filter((id) => id !== post.id)
                            );
                          }
                        }}
                        className="mt-1"
                      />

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3
                            className="font-semibold text-white line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: post.title.rendered,
                            }}
                          />
                          <p
                            className="text-white/60 text-sm mt-1 line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: post.excerpt.rendered,
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={
                              post.status === "publish"
                                ? "default"
                                : post.status === "draft"
                                ? "secondary"
                                : post.status === "future"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {post.status === "publish" && (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {post.status === "draft" && (
                              <Edit className="w-3 h-3 mr-1" />
                            )}
                            {post.status === "future" && (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {post.status === "trash" && (
                              <Trash2 className="w-3 h-3 mr-1" />
                            )}
                            {post.status}
                          </Badge>

                          <span className="text-white/40 text-xs">
                            {new Date(post.date).toLocaleDateString("pt-BR")}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <AnimatedButton
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(post.link, "_blank")}
                          >
                            <Eye className="w-4 h-4" />
                          </AnimatedButton>

                          <AnimatedButton
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              /* Abrir editor */
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </AnimatedButton>

                          <select
                            onChange={(e) =>
                              handleStatusChange(post.id, e.target.value)
                            }
                            value={post.status}
                            className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                          >
                            <option value="publish">Publicado</option>
                            <option value="draft">Rascunho</option>
                            <option value="future">Agendado</option>
                            <option value="pending">Pendente</option>
                            <option value="private">Privado</option>
                            <option value="trash">Lixeira</option>
                          </select>

                          <AnimatedButton
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Deletar este post?")) {
                                deletePost.mutate(post.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* MÍDIA TAB */}
        <TabsContent value="media" className="space-y-4">
          <GlassCard
            className="p-8 border-2 border-dashed border-white/20 text-center"
            onDrop={handleMediaDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Arraste imagens aqui
            </h3>
            <p className="text-white/60 text-sm mb-4">
              ou clique para selecionar arquivos
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach((file) => {
                  handleMediaDrop({
                    preventDefault: () => {},
                    dataTransfer: { files: [file] },
                  } as any);
                });
              }}
              className="hidden"
              id="media-upload"
            />
            <label htmlFor="media-upload">
              <AnimatedButton variant="primary" size="sm" as="span">
                Selecionar Arquivos
              </AnimatedButton>
            </label>
          </GlassCard>

          {/* Galeria de Mídia */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media?.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <GlassCard className="p-2 cursor-pointer">
                  <img
                    src={item.source_url}
                    alt={item.alt_text}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="text-white/60 text-xs mt-2 truncate">
                    {item.title.rendered}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* CATEGORIAS TAB */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Gerenciar Categorias
            </h3>
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => syncTaxonomies.mutate()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories?.map((category) => (
              <GlassCard key={category.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">
                      {category.name}
                    </h4>
                    <p className="text-white/60 text-sm">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {category.count} posts
                      </Badge>
                      <span className="text-white/40 text-xs">
                        Slug: {category.slug}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <AnimatedButton variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </AnimatedButton>
                    <AnimatedButton variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </AnimatedButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        {/* TAGS TAB */}
        <TabsContent value="tags" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Gerenciar Tags</h3>
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => syncTaxonomies.mutate()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar
            </AnimatedButton>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="px-4 py-2 text-sm cursor-pointer hover:bg-white/10"
              >
                <Hash className="w-3 h-3 mr-1" />
                {tag.name}
                <span className="ml-2 text-white/40">({tag.count})</span>
              </Badge>
            ))}
          </div>
        </TabsContent>

        {/* COMENTÁRIOS TAB */}
        <TabsContent value="comments" className="space-y-4">
          <h3 className="text-xl font-semibold text-white">
            Moderar Comentários
          </h3>

          {comments?.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">Nenhum comentário para moderar</p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {comments?.map((comment) => (
                <GlassCard key={comment.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">
                          {comment.author_name}
                        </span>
                        <span className="text-white/40 text-sm">
                          {new Date(comment.date).toLocaleDateString("pt-BR")}
                        </span>
                        <Badge
                          variant={
                            comment.status === "approved"
                              ? "default"
                              : comment.status === "hold"
                              ? "secondary"
                              : comment.status === "spam"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {comment.status}
                        </Badge>
                      </div>
                      <p
                        className="text-white/80"
                        dangerouslySetInnerHTML={{
                          __html: comment.content.rendered,
                        }}
                      />
                    </div>
                    <div className="flex gap-2 ml-4">
                      <AnimatedButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          /* Aprovar */
                        }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </AnimatedButton>
                      <AnimatedButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          /* Spam */
                        }}
                      >
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      </AnimatedButton>
                      <AnimatedButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          /* Lixeira */
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </AnimatedButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </TabsContent>

        {/* USUÁRIOS TAB */}
        <TabsContent value="users" className="space-y-4">
          <h3 className="text-xl font-semibold text-white">
            Usuários do WordPress
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users?.map((user) => (
              <GlassCard key={user.id} className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar_urls?.["96"] || "/default-avatar.png"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{user.name}</h4>
                    <p className="text-white/60 text-sm">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {user.roles?.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        {/* CONFIGURAÇÕES TAB */}
        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            Configurações Avançadas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sincronização Automática */}
            <GlassCard className="p-6 space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Sincronização Automática
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sync" className="text-white/80">
                    Ativar sincronização automática
                  </Label>
                  <Switch
                    id="auto-sync"
                    checked={autoSyncEnabled}
                    onCheckedChange={setAutoSyncEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">
                    Intervalo de sincronização
                  </Label>
                  <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                    <option value="15">A cada 15 minutos</option>
                    <option value="30">A cada 30 minutos</option>
                    <option value="60">A cada hora</option>
                    <option value="360">A cada 6 horas</option>
                    <option value="1440">Diariamente</option>
                  </select>
                </div>

                <div className="pt-2">
                  <AnimatedButton
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Forçar Sincronização Agora
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>

            {/* Backup */}
            <GlassCard className="p-6 space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-green-400" />
                Backup Automático
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup" className="text-white/80">
                    Ativar backup automático
                  </Label>
                  <Switch id="auto-backup" />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Frequência de backup</Label>
                  <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>

                <div className="pt-2">
                  <AnimatedButton
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Criar Backup Agora
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>

            {/* Monitoramento */}
            <GlassCard className="p-6 space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Monitoramento de Performance
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Uptime</span>
                  <span className="text-green-400 font-semibold">99.9%</span>
                </div>
                <Progress value={99.9} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Tempo de resposta</span>
                  <span className="text-blue-400 font-semibold">245ms</span>
                </div>
                <Progress value={75} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Health Score</span>
                  <span className="text-purple-400 font-semibold">92/100</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </GlassCard>

            {/* Segurança */}
            <GlassCard className="p-6 space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Segurança
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="2fa" className="text-white/80">
                    Autenticação 2 fatores
                  </Label>
                  <Switch id="2fa" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="ssl" className="text-white/80">
                    Forçar SSL
                  </Label>
                  <Switch id="ssl" defaultChecked />
                </div>

                <div className="pt-2">
                  <AnimatedButton
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Scan de Segurança
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
