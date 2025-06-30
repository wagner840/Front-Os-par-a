"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useWordPressIntegration } from "./use-wordpress-integration";
import type {
  WordPressPost,
  CreateWordPressPostData,
  UpdateWordPressPostData,
} from "@/lib/types/wordpress";

interface EditorState {
  title: string;
  content: string;
  excerpt: string;
  status: "draft" | "publish" | "future" | "pending" | "private";
  slug: string;
  categories: number[];
  tags: number[];
  featured_media: number | null;
  scheduled_at?: string;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  format: string;
  meta: Record<string, any>;
}

interface UseWordPressPostEditorProps {
  post?: WordPressPost;
  blogId: string;
  onSave?: (post: WordPressPost) => void;
}

export function useWordPressPostEditor({
  post,
  blogId,
  onSave,
}: UseWordPressPostEditorProps) {
  const [activeTab, setActiveTab] = useState("editor");
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showRevisions, setShowRevisions] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [seoScore, setSeoScore] = useState(0);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const { categories, tags, createPost, updatePost, uploadMedia } =
    useWordPressIntegration({ blogId });

  // Estado do editor
  const [editorState, setEditorState] = useState<EditorState>({
    title: post?.title.rendered || "",
    content: post?.content.rendered || "",
    excerpt: post?.excerpt.rendered || "",
    status: (post?.status as any) || "draft",
    slug: post?.slug || "",
    categories: post?.categories || [],
    tags: post?.tags || [],
    featured_media: post?.featured_media || null,
    scheduled_at: post?.date || "",
    comment_status: post?.comment_status || "open",
    ping_status: post?.ping_status || "open",
    sticky: false,
    format: post?.format || "standard",
    meta: {},
  });

  // Atualizar contagem de palavras
  useEffect(() => {
    const text = editorState.content.replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).length;
    setWordCount(words);
  }, [editorState.content]);

  // Calcular scores de SEO e legibilidade
  useEffect(() => {
    calculateScores();
  }, [editorState.title, editorState.content, selectedKeywords, wordCount]);

  const calculateScores = () => {
    // Cálculo simplificado de SEO
    let seo = 0;
    if (editorState.title.length > 30 && editorState.title.length < 60)
      seo += 20;
    if (editorState.excerpt.length > 100 && editorState.excerpt.length < 160)
      seo += 20;
    if (selectedKeywords.length > 0) seo += 20;
    if (wordCount > 300) seo += 20;
    if (editorState.featured_media) seo += 20;
    setSeoScore(seo);

    // Cálculo simplificado de legibilidade
    let readability = 0;
    const avgWordsPerSentence =
      wordCount / (editorState.content.split(/[.!?]/).length || 1);
    if (avgWordsPerSentence < 20) readability += 50;
    if (
      editorState.content.includes("<h2>") ||
      editorState.content.includes("<h3>")
    )
      readability += 30;
    if (
      editorState.content.includes("<ul>") ||
      editorState.content.includes("<ol>")
    )
      readability += 20;
    setReadabilityScore(readability);
  };

  // Handler para mudanças no editor
  const handleEditorChange = (field: keyof EditorState, value: any) => {
    setEditorState((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handler para salvar
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const postData: CreateWordPressPostData | UpdateWordPressPostData = {
        title: editorState.title,
        content: editorState.content,
        excerpt: editorState.excerpt,
        status: editorState.status,
        slug: editorState.slug,
        categories: editorState.categories,
        tags: editorState.tags,
        featured_media: editorState.featured_media || undefined,
        comment_status: editorState.comment_status,
        ping_status: editorState.ping_status,
        format: editorState.format,
        meta: editorState.meta,
      };

      let savedPost;
      if (post) {
        savedPost = await updatePost.mutateAsync({
          id: post.id,
          data: postData as UpdateWordPressPostData,
        });
      } else {
        savedPost = await createPost.mutateAsync(
          postData as CreateWordPressPostData
        );
      }

      toast.success(`✅ Post ${post ? "atualizado" : "criado"} com sucesso!`);
      setHasChanges(false);

      if (onSave && savedPost) {
        onSave(savedPost);
      }
    } catch (error) {
      toast.error("❌ Erro ao salvar post");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler para upload de imagem
  const handleImageUpload = async (file: File) => {
    try {
      const media = await uploadMedia.mutateAsync({
        file,
        title: file.name.split(".")[0],
        alt: file.name.split(".")[0],
      });

      if (media) {
        // Inserir imagem no conteúdo
        const imgTag = `<img src="${media.source_url}" alt="${media.alt_text}" />`;
        handleEditorChange("content", editorState.content + imgTag);

        // Se não houver imagem destacada, usar esta
        if (!editorState.featured_media) {
          handleEditorChange("featured_media", media.id);
        }
      }
    } catch (error) {
      toast.error("❌ Erro ao enviar imagem");
    }
  };

  return {
    // Estado
    activeTab,
    setActiveTab,
    isPreview,
    setIsPreview,
    isSaving,
    hasChanges,
    showRevisions,
    setShowRevisions,
    selectedKeywords,
    setSelectedKeywords,
    seoScore,
    readabilityScore,
    wordCount,
    editorState,

    // Dados
    categories,
    tags,

    // Handlers
    handleEditorChange,
    handleSave,
    handleImageUpload,
    calculateScores,
  };
}
