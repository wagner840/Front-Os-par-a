"use client";

import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";

interface PostHeaderProps {
  isLoading: boolean;
  title: string | undefined;
  onClose: () => void;
}

export function PostHeader({ isLoading, title, onClose }: PostHeaderProps) {
  return (
    <>
      <DialogTitle className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-blue-500" />
        Visualizar Post
      </DialogTitle>
      <DialogDescription id="post-viewer-description">
        {isLoading
          ? "Carregando informações do post..."
          : title
          ? `Visualização completa do post: ${title}`
          : "Post não encontrado"}
      </DialogDescription>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 h-8 w-8 p-0"
        onClick={onClose}
        aria-label="Fechar modal"
      >
        <X className="h-4 w-4" />
      </Button>
    </>
  );
}
