"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Download,
  Upload,
  Clock,
  Database,
  FileText,
  Image,
  CheckCircle,
  AlertTriangle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  useUpdateSettings,
  useExportData,
  UserSettings,
} from "@/lib/hooks/use-settings";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toast } from "sonner";

const backupSettingsSchema = z.object({
  backup: z.object({
    auto_backup: z.boolean(),
    backup_frequency: z.enum(["daily", "weekly", "monthly"]),
    include_media: z.boolean(),
  }),
});

type BackupSettingsForm = z.infer<typeof backupSettingsSchema>;

interface BackupSettingsProps {
  settings?: UserSettings;
}

const backupFrequencies = [
  {
    value: "daily",
    label: "Diário",
    description: "Backup automático todos os dias",
  },
  {
    value: "weekly",
    label: "Semanal",
    description: "Backup automático toda semana",
  },
  {
    value: "monthly",
    label: "Mensal",
    description: "Backup automático todo mês",
  },
];

const exportOptions = [
  {
    id: "posts",
    label: "Posts e Conteúdo",
    description: "Todos os seus posts, rascunhos e conteúdo",
    icon: FileText,
    size: "2.3 MB",
  },
  {
    id: "keywords",
    label: "Keywords e SEO",
    description: "Palavras-chave, análises e dados de SEO",
    icon: Database,
    size: "890 KB",
  },
  {
    id: "analytics",
    label: "Analytics e Métricas",
    description: "Dados de performance e estatísticas",
    icon: Clock,
    size: "1.1 MB",
  },
  {
    id: "media",
    label: "Mídia e Arquivos",
    description: "Imagens, vídeos e outros arquivos",
    icon: Image,
    size: "45.2 MB",
  },
];

export default function BackupSettings({ settings }: BackupSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedExportOptions, setSelectedExportOptions] = useState({
    posts: true,
    keywords: true,
    analytics: true,
    media: false,
  });

  const updateSettings = useUpdateSettings();
  const exportData = useExportData();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<BackupSettingsForm>({
    resolver: zodResolver(backupSettingsSchema),
    defaultValues: {
      backup: {
        auto_backup: settings?.backup?.auto_backup ?? true,
        backup_frequency: settings?.backup?.backup_frequency || "weekly",
        include_media: settings?.backup?.include_media ?? true,
      },
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: BackupSettingsForm) => {
    setIsLoading(true);
    try {
      await updateSettings.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: "json" | "csv") => {
    setIsExporting(true);
    setExportProgress(0);

    // Simular progresso
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await exportData.mutateAsync({
        format,
        include_posts: selectedExportOptions.posts,
        include_keywords: selectedExportOptions.keywords,
        include_analytics: selectedExportOptions.analytics,
      });

      setExportProgress(100);
      setTimeout(() => {
        setExportProgress(0);
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      setExportProgress(0);
      setIsExporting(false);
    }
  };

  const toggleExportOption = (option: keyof typeof selectedExportOptions) => {
    setSelectedExportOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const lastBackupDate = new Date().toLocaleDateString("pt-BR");
  const nextBackupDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("pt-BR");

  return (
    <div className="space-y-8">
      {/* Status do Backup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Status do Backup</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Último Backup</p>
                  <p className="text-sm text-muted-foreground">
                    {lastBackupDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Próximo Backup</p>
                  <p className="text-sm text-muted-foreground">
                    {nextBackupDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Database className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Tamanho Total</p>
                  <p className="text-sm text-muted-foreground">49.5 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Configurações de Backup Automático */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Backup Automático</CardTitle>
              <CardDescription>
                Configure backups automáticos dos seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="auto_backup"
                    className="text-base font-medium"
                  >
                    Ativar Backup Automático
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Fazer backup dos dados automaticamente
                  </p>
                </div>
                <Switch
                  id="auto_backup"
                  checked={watchedValues.backup.auto_backup}
                  onCheckedChange={(checked) =>
                    setValue("backup.auto_backup", checked)
                  }
                />
              </div>

              {watchedValues.backup.auto_backup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="text-base font-medium">
                      Frequência do Backup
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      {backupFrequencies.map((freq) => (
                        <motion.div
                          key={freq.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-200 ${
                              watchedValues.backup.backup_frequency ===
                              freq.value
                                ? "ring-2 ring-primary shadow-md"
                                : "hover:shadow-md"
                            }`}
                            onClick={() =>
                              setValue(
                                "backup.backup_frequency",
                                freq.value as any
                              )
                            }
                          >
                            <CardContent className="p-4">
                              <h4 className="font-medium">{freq.label}</h4>
                              <p className="text-sm text-muted-foreground">
                                {freq.description}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="include_media"
                        className="text-base font-medium"
                      >
                        Incluir Arquivos de Mídia
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Incluir imagens e vídeos no backup (aumenta o tamanho)
                      </p>
                    </div>
                    <Switch
                      id="include_media"
                      checked={watchedValues.backup.include_media}
                      onCheckedChange={(checked) =>
                        setValue("backup.include_media", checked)
                      }
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end">
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  disabled={!isDirty || isLoading}
                  loading={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>

      {/* Exportação Manual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Exportação Manual
            </CardTitle>
            <CardDescription>
              Exporte seus dados manualmente em diferentes formatos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">
                Selecionar Dados para Exportar
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {exportOptions.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedExportOptions[
                          option.id as keyof typeof selectedExportOptions
                        ]
                          ? "ring-2 ring-primary shadow-md"
                          : "hover:shadow-md"
                      }`}
                      onClick={() =>
                        toggleExportOption(
                          option.id as keyof typeof selectedExportOptions
                        )
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <option.icon className="w-5 h-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{option.label}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {option.size}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {isExporting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Exportando dados...
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {exportProgress}%
                  </span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </motion.div>
            )}

            <div className="flex gap-3">
              <AnimatedButton
                type="button"
                variant="outline"
                onClick={() => handleExport("json")}
                disabled={isExporting}
                loading={isExporting}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar JSON
              </AnimatedButton>
              <AnimatedButton
                type="button"
                variant="outline"
                onClick={() => handleExport("csv")}
                disabled={isExporting}
                loading={isExporting}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </AnimatedButton>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Histórico de Backups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Backups</CardTitle>
            <CardDescription>
              Visualize e restaure backups anteriores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "19/12/2024", size: "49.5 MB", status: "success" },
                { date: "12/12/2024", size: "48.2 MB", status: "success" },
                { date: "05/12/2024", size: "47.8 MB", status: "success" },
                { date: "28/11/2024", size: "46.1 MB", status: "warning" },
              ].map((backup, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {backup.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">{backup.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {backup.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Restaurar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
