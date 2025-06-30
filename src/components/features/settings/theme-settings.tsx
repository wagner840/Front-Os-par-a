"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Palette, Sun, Moon, Monitor, Eye, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpdateSettings, UserSettings } from "@/lib/hooks/use-settings";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GlassCard } from "@/components/ui/glass-card";

const themeSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

type ThemeSettingsForm = z.infer<typeof themeSettingsSchema>;

interface ThemeSettingsProps {
  settings?: UserSettings;
}

const themeOptions = [
  {
    value: "light" as const,
    label: "Claro",
    description: "Interface clara com fundo branco",
    icon: Sun,
    preview: "bg-white border-gray-200",
  },
  {
    value: "dark" as const,
    label: "Escuro",
    description: "Interface escura com fundo preto",
    icon: Moon,
    preview: "bg-gray-900 border-gray-700",
  },
  {
    value: "system" as const,
    label: "Sistema",
    description: "Seguir configuração do sistema",
    icon: Monitor,
    preview: "bg-gradient-to-br from-white to-gray-900 border-gray-400",
  },
];

const colorSchemes = [
  {
    name: "Frutiger Aero (Padrão)",
    primary: "#0ea5e9",
    secondary: "#06b6d4",
    accent: "#8b5cf6",
    preview: "bg-gradient-to-r from-sky-500 to-cyan-500",
  },
  {
    name: "Ocean Breeze",
    primary: "#0284c7",
    secondary: "#0891b2",
    accent: "#7c3aed",
    preview: "bg-gradient-to-r from-blue-600 to-cyan-600",
  },
  {
    name: "Forest Green",
    primary: "#059669",
    secondary: "#10b981",
    accent: "#8b5cf6",
    preview: "bg-gradient-to-r from-emerald-600 to-green-500",
  },
  {
    name: "Sunset Orange",
    primary: "#ea580c",
    secondary: "#f97316",
    accent: "#ec4899",
    preview: "bg-gradient-to-r from-orange-600 to-pink-500",
  },
];

export default function ThemeSettings({ settings }: ThemeSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(
    settings?.theme || "system"
  );
  const [selectedColorScheme, setSelectedColorScheme] = useState(0);
  const updateSettings = useUpdateSettings();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<ThemeSettingsForm>({
    resolver: zodResolver(themeSettingsSchema),
    defaultValues: {
      theme: settings?.theme || "system",
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: ThemeSettingsForm) => {
    setIsLoading(true);
    try {
      await updateSettings.mutateAsync(data);
      // Aplicar tema imediatamente
      if (data.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else if (data.theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        // Sistema
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        document.documentElement.classList.toggle("dark", isDark);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setSelectedTheme(theme);
    setValue("theme", theme);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Seleção de Tema */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Tema da Interface</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTheme === option.value
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => handleThemeChange(option.value)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div
                      className={`w-full h-20 rounded-lg border-2 ${option.preview}`}
                    >
                      <div className="p-3 space-y-2">
                        <div
                          className={`w-1/2 h-2 rounded ${
                            option.value === "dark"
                              ? "bg-white/20"
                              : "bg-black/20"
                          }`}
                        ></div>
                        <div
                          className={`w-3/4 h-2 rounded ${
                            option.value === "dark"
                              ? "bg-white/10"
                              : "bg-black/10"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <option.icon className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{option.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Esquemas de Cores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Esquema de Cores</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorSchemes.map((scheme, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  selectedColorScheme === index
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedColorScheme(index)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div
                      className={`w-full h-12 rounded-lg ${scheme.preview}`}
                    ></div>
                    <div>
                      <h4 className="font-medium">{scheme.name}</h4>
                      <div className="flex gap-2 mt-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: scheme.primary }}
                        ></div>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: scheme.secondary }}
                        ></div>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: scheme.accent }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Preview da Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <h3 className="text-lg font-semibold">Preview da Interface</h3>
        <GlassCard variant="subtle" className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Dashboard Preview
              </h4>
              <Button variant="outline" size="sm">
                Ação
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-background/50 backdrop-blur-sm rounded-lg border"
                >
                  <div className="space-y-2">
                    <div className="w-1/2 h-3 bg-primary/20 rounded"></div>
                    <div className="w-3/4 h-2 bg-muted rounded"></div>
                    <div className="w-full h-2 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Configurações Avançadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Configurações Avançadas de Aparência</CardTitle>
            <CardDescription>
              Personalizações adicionais da interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Efeitos de Glassmorphism</Label>
                <p className="text-sm text-muted-foreground">
                  Ativado por padrão no tema Frutiger Aero
                </p>
              </div>
              <div className="space-y-2">
                <Label>Animações</Label>
                <p className="text-sm text-muted-foreground">
                  Transições suaves e animações de entrada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Botão de Salvar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
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
          Aplicar Tema
        </AnimatedButton>
      </motion.div>
    </form>
  );
}
