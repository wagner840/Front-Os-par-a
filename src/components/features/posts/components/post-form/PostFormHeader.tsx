"use client";

import { AnimatedButton } from "@/components/ui/animated-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Save } from "lucide-react";

interface PostFormHeaderProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function PostFormHeader({
  isSubmitting,
  onCancel,
}: PostFormHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">Criar Novo Post</h2>
      <div className="flex items-center gap-3">
        {onCancel && (
          <AnimatedButton type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </AnimatedButton>
        )}
        <AnimatedButton type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Criar Post
        </AnimatedButton>
      </div>
    </div>
  );
}
