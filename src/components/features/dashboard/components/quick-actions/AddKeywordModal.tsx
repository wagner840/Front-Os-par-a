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
import { Target } from "lucide-react";

interface AddKeywordModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  keywordText: string;
  setKeywordText: (text: string) => void;
  keywordMsv: string;
  setKeywordMsv: (msv: string) => void;
  keywordDifficulty: string;
  setKeywordDifficulty: (difficulty: string) => void;
  handleCreateKeyword: () => void;
  isPending: boolean;
}

export function AddKeywordModal({
  isOpen,
  onOpenChange,
  keywordText,
  setKeywordText,
  keywordMsv,
  setKeywordMsv,
  keywordDifficulty,
  setKeywordDifficulty,
  handleCreateKeyword,
  isPending,
}: AddKeywordModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Adicionar Keyword
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Adicione uma nova palavra-chave para rastrear no blog selecionado.
            Volume de busca e dificuldade são opcionais.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Keyword *
            </label>
            <Input
              value={keywordText}
              onChange={(e) => setKeywordText(e.target.value)}
              placeholder="Digite a palavra-chave..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Volume de Busca
              </label>
              <Input
                value={keywordMsv}
                onChange={(e) => setKeywordMsv(e.target.value)}
                placeholder="1000"
                type="number"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Dificuldade (0-100)
              </label>
              <Input
                value={keywordDifficulty}
                onChange={(e) => setKeywordDifficulty(e.target.value)}
                placeholder="45"
                type="number"
                min="0"
                max="100"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
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
              variant="success"
              onClick={handleCreateKeyword}
              loading={isPending}
              className="flex-1"
            >
              Adicionar
            </AnimatedButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
