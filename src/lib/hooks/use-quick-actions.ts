"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppStore } from "@/lib/stores/app-store";
import { FileText, Target, BarChart3, Rocket } from "lucide-react";

// Mock functions - seriam substituídas por chamadas reais de serviço
const createPost = async (title: string, keyword?: string) => {
  console.log("Creating post:", { title, keyword });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { id: Date.now().toString(), title, keyword };
};

const createKeyword = async (
  keyword: string,
  msv?: number,
  difficulty?: number
) => {
  console.log("Creating keyword:", { keyword, msv, difficulty });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { id: Date.now().toString(), keyword, msv, difficulty };
};

export function useQuickActions() {
  const { selectedBlog } = useAppStore();
  const queryClient = useQueryClient();

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateKeywordOpen, setIsCreateKeywordOpen] = useState(false);

  const [postTitle, setPostTitle] = useState("");
  const [postKeyword, setPostKeyword] = useState("");

  const [keywordText, setKeywordText] = useState("");
  const [keywordMsv, setKeywordMsv] = useState("");
  const [keywordDifficulty, setKeywordDifficulty] = useState("");

  const createPostMutation = useMutation({
    mutationFn: ({ title, keyword }: { title: string; keyword?: string }) =>
      createPost(title, keyword),
    onSuccess: () => {
      toast.success("Post criado com sucesso!");
      setIsCreatePostOpen(false);
      setPostTitle("");
      setPostKeyword("");
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar post: " + error.message);
    },
  });

  const createKeywordMutation = useMutation({
    mutationFn: ({
      keyword,
      msv,
      difficulty,
    }: {
      keyword: string;
      msv?: number;
      difficulty?: number;
    }) => createKeyword(keyword, msv, difficulty),
    onSuccess: () => {
      toast.success("Keyword adicionada com sucesso!");
      setIsCreateKeywordOpen(false);
      setKeywordText("");
      setKeywordMsv("");
      setKeywordDifficulty("");
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["keywords"] });
    },
    onError: (error: Error) => {
      toast.error("Erro ao adicionar keyword: " + error.message);
    },
  });

  const handleCreatePost = () => {
    if (!postTitle.trim()) {
      toast.error("Título do post é obrigatório");
      return;
    }
    createPostMutation.mutate({
      title: postTitle.trim(),
      keyword: postKeyword.trim() || undefined,
    });
  };

  const handleCreateKeyword = () => {
    if (!keywordText.trim()) {
      toast.error("Keyword é obrigatória");
      return;
    }
    createKeywordMutation.mutate({
      keyword: keywordText.trim(),
      msv: keywordMsv ? parseInt(keywordMsv) : undefined,
      difficulty: keywordDifficulty ? parseInt(keywordDifficulty) : undefined,
    });
  };

  const actions = [
    {
      id: "new-post",
      title: "Novo Post",
      description: "Criar um novo artigo",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      action: () => setIsCreatePostOpen(true),
    },
    {
      id: "add-keyword",
      title: "Adicionar Keyword",
      description: "Nova palavra-chave",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      action: () => setIsCreateKeywordOpen(true),
    },
    {
      id: "analyze-content",
      title: "Analisar Conteúdo",
      description: "Revisar SEO e performance",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500",
      action: () => toast.info("Funcionalidade em breve!"),
    },
    {
      id: "optimize-posts",
      title: "Otimizar Posts",
      description: "Melhorar SEO automático",
      icon: Rocket,
      color: "from-orange-500 to-red-500",
      action: () => toast.info("Funcionalidade em breve!"),
    },
  ];

  return {
    selectedBlog,
    isCreatePostOpen,
    setIsCreatePostOpen,
    isCreateKeywordOpen,
    setIsCreateKeywordOpen,
    postTitle,
    setPostTitle,
    postKeyword,
    setPostKeyword,
    keywordText,
    setKeywordText,
    keywordMsv,
    setKeywordMsv,
    keywordDifficulty,
    setKeywordDifficulty,
    createPostMutation,
    handleCreatePost,
    createKeywordMutation,
    handleCreateKeyword,
    actions,
  };
}
