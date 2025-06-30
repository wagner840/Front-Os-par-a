"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateABTestForm } from "./create-ab-test-form";
import { Plus } from "lucide-react";

interface AbTestingHeaderProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;
}

export function AbTestingHeader({
  isCreateModalOpen,
  setIsCreateModalOpen,
}: AbTestingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Testes A/B
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Otimize suas conversões com testes controlados
        </p>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Teste A/B
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Teste A/B</DialogTitle>
            <DialogDescription>
              Configure um novo teste para otimizar suas conversões
            </DialogDescription>
          </DialogHeader>
          <CreateABTestForm onClose={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
