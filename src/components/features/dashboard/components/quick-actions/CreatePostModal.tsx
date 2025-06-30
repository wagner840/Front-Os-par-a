"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { FileText } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  postTitle: string;
  setPostTitle: (title: string) => void;
  postKeyword: string;
  setPostKeyword: (keyword: string) => void;
  handleCreatePost: () => void;
  isPending: boolean;
}

export function CreatePostModal({
  isOpen,
  onOpenChange,
  postTitle,
  setPostTitle,
  postKeyword,
  setPostKeyword,
  handleCreatePost,
  isPending,
}: CreatePostModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Criar Novo Post
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Crie um novo post para o blog selecionado. Você pode adicionar uma
            palavra-chave principal opcional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Título do Post *
            </label>
            <Input
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Digite o título do post..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Keyword Principal (opcional)
            </label>
            <Input
              value={postKeyword}
              onChange={(e) => setPostKeyword(e.target.value)}
              placeholder="Palavra-chave principal..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <AnimatedButton
              variant="glass"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              onClick={handleCreatePost}
              loading={isPending}
              className="flex-1"
            >
              Criar Post
            </AnimatedButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
