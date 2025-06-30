"use client";

import { AnimatedButton } from "@/components/ui/animated-button";
import { PenTool, Eye, X, Save, RefreshCw } from "lucide-react";

interface PostEditorHeaderProps {
  post?: any;
  isPreview: boolean;
  setIsPreview: (preview: boolean) => void;
  onCancel?: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasChanges: boolean;
}

export function PostEditorHeader({
  post,
  isPreview,
  setIsPreview,
  onCancel,
  onSave,
  isSaving,
  hasChanges,
}: PostEditorHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <PenTool className="w-8 h-8 text-purple-400" />
        {post ? "Editar Post" : "Novo Post"}
      </h2>

      <div className="flex items-center gap-3">
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
        >
          <Eye className="w-4 h-4 mr-2" />
          {isPreview ? "Editor" : "Preview"}
        </AnimatedButton>

        <AnimatedButton variant="secondary" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </AnimatedButton>

        <AnimatedButton
          variant="primary"
          size="sm"
          onClick={onSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {post ? "Atualizar" : "Publicar"}
        </AnimatedButton>
      </div>
    </div>
  );
}
