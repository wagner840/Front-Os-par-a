"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreateABTestFormProps {
  onClose: () => void;
}

export function CreateABTestForm({ onClose }: CreateABTestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    significance_level: 95,
    minimum_sample_size: 1000,
    variants: [
      {
        name: "Controle",
        description: "",
        traffic_percentage: 50,
        is_control: true,
      },
      {
        name: "Variante A",
        description: "",
        traffic_percentage: 50,
        is_control: false,
      },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui implementaria a criação do teste
    toast.success("Teste A/B criado com sucesso!");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome do Teste</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Ex: Teste de CTA Principal"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Descreva o objetivo do teste..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="significance">Nível de Significância (%)</Label>
            <Select
              value={formData.significance_level.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  significance_level: parseInt(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90%</SelectItem>
                <SelectItem value="95">95%</SelectItem>
                <SelectItem value="99">99%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sample_size">Tamanho Mínimo da Amostra</Label>
            <Input
              id="sample_size"
              type="number"
              value={formData.minimum_sample_size}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minimum_sample_size: parseInt(e.target.value),
                }))
              }
              min="100"
              step="100"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Variantes do Teste</h4>
        {formData.variants.map((variant, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome da Variante</Label>
                <Input
                  value={variant.name}
                  onChange={(e) => {
                    const newVariants = [...formData.variants];
                    newVariants[index].name = e.target.value;
                    setFormData((prev) => ({ ...prev, variants: newVariants }));
                  }}
                  placeholder="Ex: Controle"
                />
              </div>
              <div>
                <Label>Porcentagem de Tráfego</Label>
                <Input
                  type="number"
                  value={variant.traffic_percentage}
                  onChange={(e) => {
                    const newVariants = [...formData.variants];
                    newVariants[index].traffic_percentage = parseInt(
                      e.target.value
                    );
                    setFormData((prev) => ({ ...prev, variants: newVariants }));
                  }}
                  min="1"
                  max="100"
                />
              </div>
            </div>
            <div>
              <Label>Descrição</Label>
              <Input
                value={variant.description}
                onChange={(e) => {
                  const newVariants = [...formData.variants];
                  newVariants[index].description = e.target.value;
                  setFormData((prev) => ({ ...prev, variants: newVariants }));
                }}
                placeholder="Descreva as mudanças desta variante..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Criar Teste</Button>
      </div>
    </form>
  );
}
