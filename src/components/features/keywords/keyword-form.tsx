"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useCreateKeyword, useUpdateKeyword } from "@/lib/hooks/use-keywords";
import { useBlogs } from "@/lib/hooks/use-blogs";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/lib/types/database";

type Keyword = Database["public"]["Tables"]["main_keywords"]["Row"];

interface KeywordFormProps {
  keyword?: Keyword;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function KeywordForm({
  keyword,
  isEditing = false,
  onSuccess,
  onCancel,
}: KeywordFormProps) {
  const [formData, setFormData] = useState({
    blog_id: keyword?.blog_id || "",
    keyword: keyword?.keyword || "",
    msv: keyword?.msv || null,
    kw_difficulty: keyword?.kw_difficulty || null,
    cpc: keyword?.cpc || null,
    competition: keyword?.competition || "MEDIUM",
    search_intent: keyword?.search_intent || "informational",
    location: keyword?.location || "Brazil",
    language: keyword?.language || "Portuguese",
  });

  const { data: blogs } = useBlogs();
  const createKeyword = useCreateKeyword();
  const updateKeyword = useUpdateKeyword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.keyword.trim()) {
      toast.error("Palavra-chave é obrigatória");
      return;
    }

    if (!formData.blog_id) {
      toast.error("Selecione um blog");
      return;
    }

    try {
      if (isEditing && keyword) {
        await updateKeyword.mutateAsync({
          id: keyword.id,
          ...formData,
        });
        toast.success("Keyword atualizada com sucesso!");
      } else {
        await createKeyword.mutateAsync(formData);
        toast.success("Keyword criada com sucesso!");
      }
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao salvar keyword");
      console.error(error);
    }
  };

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isPending = createKeyword.isPending || updateKeyword.isPending;

  return (
    <GlassCard className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="blog_id">Blog *</Label>
            <Select
              value={formData.blog_id}
              onValueChange={(value) => handleInputChange("blog_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um blog" />
              </SelectTrigger>
              <SelectContent>
                {blogs?.map((blog) => (
                  <SelectItem key={blog.id} value={blog.id}>
                    {blog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="competition">Competição</Label>
            <Select
              value={formData.competition}
              onValueChange={(value) => handleInputChange("competition", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Baixa</SelectItem>
                <SelectItem value="MEDIUM">Média</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Keyword */}
        <div>
          <Label htmlFor="keyword">Palavra-chave *</Label>
          <Input
            id="keyword"
            value={formData.keyword}
            onChange={(e) => handleInputChange("keyword", e.target.value)}
            placeholder="Digite a palavra-chave"
          />
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="msv">Volume de Busca Mensal</Label>
            <Input
              id="msv"
              type="number"
              value={formData.msv || ""}
              onChange={(e) =>
                handleInputChange(
                  "msv",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="kw_difficulty">Dificuldade (0-100)</Label>
            <Input
              id="kw_difficulty"
              type="number"
              min="0"
              max="100"
              value={formData.kw_difficulty || ""}
              onChange={(e) =>
                handleInputChange(
                  "kw_difficulty",
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="cpc">CPC (USD)</Label>
            <Input
              id="cpc"
              type="number"
              step="0.01"
              value={formData.cpc || ""}
              onChange={(e) =>
                handleInputChange(
                  "cpc",
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Configurações adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search_intent">Intenção de Busca</Label>
            <Select
              value={formData.search_intent}
              onValueChange={(value) =>
                handleInputChange("search_intent", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informational">Informacional</SelectItem>
                <SelectItem value="navigational">Navegacional</SelectItem>
                <SelectItem value="commercial">Comercial</SelectItem>
                <SelectItem value="transactional">Transacional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Brazil"
            />
          </div>

          <div>
            <Label htmlFor="language">Idioma</Label>
            <Input
              id="language"
              value={formData.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
              placeholder="Portuguese"
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-6 border-t border-white/20">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Salvando..."
              : isEditing
              ? "Atualizar"
              : "Criar Keyword"}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
