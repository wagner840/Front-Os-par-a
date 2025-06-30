"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useCreatePost } from "@/lib/hooks/use-posts";
import { useAppStore } from "@/lib/stores/app-store";
import { useMainKeywords } from "@/lib/hooks/use-keywords";

const postSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  main_keyword_id: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormSimpleProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PostFormSimple({ onSuccess, onCancel }: PostFormSimpleProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);

    try {
      // Simular criação de post
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Post criado com sucesso!");
      console.log("Post data:", data);

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      toast.error("Erro ao salvar post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Criar Novo Post (Versão Teste)
            </h2>
            <div className="flex items-center gap-3">
              {onCancel && (
                <AnimatedButton
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                >
                  Cancelar
                </AnimatedButton>
              )}
              <AnimatedButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Criar Post
              </AnimatedButton>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <GlassCard variant="default" className="p-6">
            <div className="space-y-6">
              {/* Título */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Título *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o título do post..."
                        {...field}
                        className="text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conteúdo */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Conteúdo *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escreva o conteúdo do seu post..."
                        className="min-h-[300px] text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="scheduled">Agendado</SelectItem>
                        <SelectItem value="archived">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </GlassCard>
        </form>
      </Form>
    </motion.div>
  );
}
