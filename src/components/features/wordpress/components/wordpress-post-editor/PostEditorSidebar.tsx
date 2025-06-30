"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BarChart3, Settings, Archive } from "lucide-react";

interface PostEditorSidebarProps {
  seoScore: number;
  readabilityScore: number;
  wordCount: number;
  editorState: any;
  handleEditorChange: (field: string, value: any) => void;
  categories?: any[];
  tags?: any[];
}

export function PostEditorSidebar({
  seoScore,
  readabilityScore,
  wordCount,
  editorState,
  handleEditorChange,
  categories = [],
  tags = [],
}: PostEditorSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Scores de SEO e Legibilidade */}
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Análise do Conteúdo
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">SEO Score</span>
              <Badge
                variant={
                  seoScore >= 80
                    ? "default"
                    : seoScore >= 60
                    ? "secondary"
                    : "destructive"
                }
              >
                {seoScore}%
              </Badge>
            </div>
            <Progress value={seoScore} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">Legibilidade</span>
              <Badge
                variant={
                  readabilityScore >= 80
                    ? "default"
                    : readabilityScore >= 60
                    ? "secondary"
                    : "destructive"
                }
              >
                {readabilityScore}%
              </Badge>
            </div>
            <Progress value={readabilityScore} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Palavras:</span>
            <span className="text-white">{wordCount}</span>
          </div>
        </div>
      </GlassCard>

      {/* Configurações de Publicação */}
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          Publicação
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="status" className="text-white">
              Status
            </Label>
            <select
              id="status"
              value={editorState.status}
              onChange={(e) => handleEditorChange("status", e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="draft">Rascunho</option>
              <option value="publish">Publicado</option>
              <option value="future">Agendado</option>
              <option value="pending">Pendente</option>
              <option value="private">Privado</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sticky" className="text-white">
              Post Fixo
            </Label>
            <Switch
              id="sticky"
              checked={editorState.sticky}
              onCheckedChange={(checked) =>
                handleEditorChange("sticky", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="comments" className="text-white">
              Comentários
            </Label>
            <Switch
              id="comments"
              checked={editorState.comment_status === "open"}
              onCheckedChange={(checked) =>
                handleEditorChange(
                  "comment_status",
                  checked ? "open" : "closed"
                )
              }
            />
          </div>
        </div>
      </GlassCard>

      {/* Categorias e Tags */}
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Archive className="w-5 h-5 text-green-400" />
          Taxonomias
        </h3>

        <div className="space-y-4">
          <div>
            <Label className="text-white">Categorias</Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 text-white/80"
                >
                  <input
                    type="checkbox"
                    checked={editorState.categories.includes(category.id)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...editorState.categories, category.id]
                        : editorState.categories.filter(
                            (id: number) => id !== category.id
                          );
                      handleEditorChange("categories", newCategories);
                    }}
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-white">Tags</Label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 text-white/80"
                >
                  <input
                    type="checkbox"
                    checked={editorState.tags.includes(tag.id)}
                    onChange={(e) => {
                      const newTags = e.target.checked
                        ? [...editorState.tags, tag.id]
                        : editorState.tags.filter(
                            (id: number) => id !== tag.id
                          );
                      handleEditorChange("tags", newTags);
                    }}
                  />
                  <span className="text-sm">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
