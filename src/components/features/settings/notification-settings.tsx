"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Save,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpdateSettings, UserSettings } from "@/lib/hooks/use-settings";
import { AnimatedButton } from "@/components/ui/animated-button";

const notificationSettingsSchema = z.object({
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    seo_alerts: z.boolean(),
    keyword_updates: z.boolean(),
    post_published: z.boolean(),
  }),
});

type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>;

interface NotificationSettingsProps {
  settings?: UserSettings;
}

const notificationTypes = [
  {
    key: "email" as const,
    label: "Notificações por Email",
    description: "Receber notificações importantes por email",
    icon: Mail,
  },
  {
    key: "push" as const,
    label: "Notificações Push",
    description: "Receber notificações push no navegador",
    icon: Smartphone,
  },
  {
    key: "seo_alerts" as const,
    label: "Alertas de SEO",
    description: "Alertas sobre problemas de SEO e oportunidades",
    icon: AlertTriangle,
  },
  {
    key: "keyword_updates" as const,
    label: "Atualizações de Keywords",
    description: "Notificações sobre mudanças nas keywords",
    icon: TrendingUp,
  },
  {
    key: "post_published" as const,
    label: "Posts Publicados",
    description: "Confirmação quando um post for publicado",
    icon: Bell,
  },
];

export default function NotificationSettings({
  settings,
}: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateSettings = useUpdateSettings();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<NotificationSettingsForm>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      notifications: {
        email: settings?.notifications?.email ?? true,
        push: settings?.notifications?.push ?? true,
        seo_alerts: settings?.notifications?.seo_alerts ?? true,
        keyword_updates: settings?.notifications?.keyword_updates ?? true,
        post_published: settings?.notifications?.post_published ?? true,
      },
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: NotificationSettingsForm) => {
    setIsLoading(true);
    try {
      await updateSettings.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {notificationTypes.map((notification, index) => (
          <motion.div
            key={notification.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <notification.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor={notification.key}
                        className="text-base font-medium cursor-pointer"
                      >
                        {notification.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={notification.key}
                    checked={watchedValues.notifications[notification.key]}
                    onCheckedChange={(checked) =>
                      setValue(`notifications.${notification.key}`, checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Configurações Avançadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Configurações Avançadas
            </CardTitle>
            <CardDescription>
              Configure quando e como receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Horário de Notificações</h4>
                <p className="text-sm text-muted-foreground">
                  Notificações serão enviadas entre 9h e 18h no seu fuso horário
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Frequência</h4>
                <p className="text-sm text-muted-foreground">
                  Máximo de 3 notificações por dia para evitar spam
                </p>
              </div>
            </div>

            {/* Status das Notificações */}
            <div className="space-y-3">
              <h4 className="font-medium">Status das Notificações</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs text-muted-foreground">Funcionando</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Push</p>
                    <p className="text-xs text-muted-foreground">
                      Requer permissão
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Botão de Salvar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
