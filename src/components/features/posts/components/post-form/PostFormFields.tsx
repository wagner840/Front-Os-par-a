"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
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
import { GlassCard } from "@/components/ui/glass-card";

interface Keyword {
  id: string;
  keyword: string;
}

interface PostFormFieldsProps {
  keywords?: Keyword[];
  keywordsLoading: boolean;
}

export function PostFormFields({
  keywords,
  keywordsLoading,
}: PostFormFieldsProps) {
  const form = useFormContext();

  return (
    <GlassCard variant="default" className="p-6">
      <div className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField
            control={form.control}
            name="main_keyword_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Palavra-chave Principal
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={keywordsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          keywordsLoading
                            ? "Carregando..."
                            : "Selecione uma palavra-chave"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {keywords?.map((kw) => (
                      <SelectItem key={kw.id} value={kw.id}>
                        {kw.keyword}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </GlassCard>
  );
}
