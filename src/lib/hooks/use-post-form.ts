"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCreatePost } from "@/lib/hooks/use-posts";
import { useAppStore } from "@/lib/stores/app-store";
import { useMainKeywords } from "@/lib/hooks/use-keywords";
import { useSupabase } from "@/lib/hooks/use-supabase";

const postSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  main_keyword_id: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export function usePostForm(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedBlog } = useAppStore();
  const { user } = useSupabase();
  const { data: keywords, isLoading: keywordsLoading } = useMainKeywords(
    selectedBlog || undefined
  );

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });

  const createPostMutation = useCreatePost();

  const onSubmit = async (data: PostFormData) => {
    if (!selectedBlog) {
      toast.error("Nenhum blog selecionado.");
      return;
    }
    if (!user) {
      toast.error("Você precisa estar logado para criar um post.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPostMutation.mutateAsync({
        ...data,
        blog_id: selectedBlog,
        author_id: user.id,
      });
      toast.success("Post criado com sucesso!");
      onSuccess?.();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      toast.error("Erro ao salvar post. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    keywords,
    keywordsLoading,
  };
}
