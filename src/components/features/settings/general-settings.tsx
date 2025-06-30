"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Globe, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateSettings, UserSettings } from "@/lib/hooks/use-settings";
import { AnimatedButton } from "@/components/ui/animated-button";

const generalSettingsSchema = z.object({
  language: z.string().min(1, "Idioma é obrigatório"),
  timezone: z.string().min(1, "Fuso horário é obrigatório"),
  dashboard: z.object({
    default_view: z.enum(["overview", "keywords", "posts", "analytics"]),
    cards_per_page: z.number().min(6).max(24),
    auto_refresh: z.boolean(),
    refresh_interval: z.number().min(10).max(300),
  }),
  seo: z.object({
    default_meta_description_length: z.number().min(120).max(200),
    default_title_length: z.number().min(30).max(80),
    auto_generate_meta: z.boolean(),
    focus_keyword_density: z.number().min(1).max(5),
  }),
});

type GeneralSettingsForm = z.infer<typeof generalSettingsSchema>;

interface GeneralSettingsProps {
  settings?: UserSettings;
}

const languages = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
  { value: "fr-FR", label: "Français" },
  { value: "de-DE", label: "Deutsch" },
];

const timezones = [
  { value: "America/Sao_Paulo", label: "(GMT-3) São Paulo" },
  { value: "America/New_York", label: "(GMT-5) New York" },
  { value: "Europe/London", label: "(GMT+0) London" },
  { value: "Europe/Paris", label: "(GMT+1) Paris" },
  { value: "Asia/Tokyo", label: "(GMT+9) Tokyo" },
];

const defaultViews = [
  { value: "overview", label: "Visão Geral" },
  { value: "keywords", label: "Keywords" },
  { value: "posts", label: "Posts" },
  { value: "analytics", label: "Analytics" },
];

export default function GeneralSettings({ settings }: GeneralSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateSettings = useUpdateSettings();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<GeneralSettingsForm>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      language: settings?.language || "pt-BR",
      timezone: settings?.timezone || "America/Sao_Paulo",
      dashboard: {
        default_view: settings?.dashboard?.default_view || "overview",
        cards_per_page: settings?.dashboard?.cards_per_page || 12,
        auto_refresh: settings?.dashboard?.auto_refresh ?? true,
        refresh_interval: settings?.dashboard?.refresh_interval || 30,
      },
      seo: {
        default_meta_description_length:
          settings?.seo?.default_meta_description_length || 160,
        default_title_length: settings?.seo?.default_title_length || 60,
        auto_generate_meta: settings?.seo?.auto_generate_meta ?? true,
        focus_keyword_density: settings?.seo?.focus_keyword_density || 2.5,
      },
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: GeneralSettingsForm) => {
    setIsLoading(true);
    try {
      await updateSettings.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Configurações de Localização */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Localização</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select
              value={watchedValues.language}
              onValueChange={(value) => setValue("language", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.language && (
              <p className="text-sm text-destructive">
                {errors.language.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Fuso Horário</Label>
            <Select
              value={watchedValues.timezone}
              onValueChange={(value) => setValue("timezone", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o fuso horário" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.timezone && (
              <p className="text-sm text-destructive">
                {errors.timezone.message}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Configurações do Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Dashboard</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="default_view">Visualização Padrão</Label>
            <Select
              value={watchedValues.dashboard.default_view}
              onValueChange={(value) =>
                setValue("dashboard.default_view", value as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a visualização" />
              </SelectTrigger>
              <SelectContent>
                {defaultViews.map((view) => (
                  <SelectItem key={view.value} value={view.value}>
                    {view.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cards_per_page">Cards por Página</Label>
            <Input
              type="number"
              min="6"
              max="24"
              {...register("dashboard.cards_per_page", { valueAsNumber: true })}
            />
            {errors.dashboard?.cards_per_page && (
              <p className="text-sm text-destructive">
                {errors.dashboard.cards_per_page.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="auto_refresh">Atualização Automática</Label>
              <p className="text-sm text-muted-foreground">
                Atualizar dados automaticamente
              </p>
            </div>
            <Switch
              checked={watchedValues.dashboard.auto_refresh}
              onCheckedChange={(checked) =>
                setValue("dashboard.auto_refresh", checked)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="refresh_interval">
              Intervalo de Atualização (segundos)
            </Label>
            <Input
              type="number"
              min="10"
              max="300"
              {...register("dashboard.refresh_interval", {
                valueAsNumber: true,
              })}
              disabled={!watchedValues.dashboard.auto_refresh}
            />
            {errors.dashboard?.refresh_interval && (
              <p className="text-sm text-destructive">
                {errors.dashboard.refresh_interval.message}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Configurações de SEO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">SEO Padrões</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="default_title_length">
              Comprimento Padrão do Título
            </Label>
            <Input
              type="number"
              min="30"
              max="80"
              {...register("seo.default_title_length", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Recomendado: 50-60 caracteres
            </p>
            {errors.seo?.default_title_length && (
              <p className="text-sm text-destructive">
                {errors.seo.default_title_length.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_meta_description_length">
              Comprimento da Meta Description
            </Label>
            <Input
              type="number"
              min="120"
              max="200"
              {...register("seo.default_meta_description_length", {
                valueAsNumber: true,
              })}
            />
            <p className="text-xs text-muted-foreground">
              Recomendado: 150-160 caracteres
            </p>
            {errors.seo?.default_meta_description_length && (
              <p className="text-sm text-destructive">
                {errors.seo.default_meta_description_length.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="focus_keyword_density">
              Densidade da Keyword Foco (%)
            </Label>
            <Input
              type="number"
              min="1"
              max="5"
              step="0.1"
              {...register("seo.focus_keyword_density", {
                valueAsNumber: true,
              })}
            />
            <p className="text-xs text-muted-foreground">Recomendado: 1-3%</p>
            {errors.seo?.focus_keyword_density && (
              <p className="text-sm text-destructive">
                {errors.seo.focus_keyword_density.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="auto_generate_meta">
                Gerar Meta Tags Automaticamente
              </Label>
              <p className="text-sm text-muted-foreground">
                Gerar automaticamente meta description e title
              </p>
            </div>
            <Switch
              checked={watchedValues.seo.auto_generate_meta}
              onCheckedChange={(checked) =>
                setValue("seo.auto_generate_meta", checked)
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Botão de Salvar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end pt-6"
      >
        <AnimatedButton
          type="submit"
          variant="primary"
          disabled={!isDirty || isLoading}
          loading={isLoading}
          className="min-w-[120px]"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </AnimatedButton>
      </motion.div>
    </form>
  );
}
