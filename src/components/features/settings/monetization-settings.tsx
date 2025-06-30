"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  ExternalLink,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useUpdateSettings, UserSettings } from "@/lib/hooks/use-settings";
import { AnimatedButton } from "@/components/ui/animated-button";

const monetizationSettingsSchema = z.object({
  monetization: z.object({
    adsense: z.object({
      enabled: z.boolean(),
      publisher_id: z.string().optional(),
      auto_ads: z.boolean(),
    }),
    affiliate: z.object({
      enabled: z.boolean(),
      networks: z.array(z.string()),
    }),
  }),
});

type MonetizationSettingsForm = z.infer<typeof monetizationSettingsSchema>;

interface MonetizationSettingsProps {
  settings?: UserSettings;
}

const affiliateNetworks = [
  { id: "amazon", name: "Amazon Associates", commission: "1-10%" },
  { id: "hotmart", name: "Hotmart", commission: "5-70%" },
  { id: "eduzz", name: "Eduzz", commission: "5-70%" },
  { id: "monetizze", name: "Monetizze", commission: "5-70%" },
  { id: "lomadee", name: "Lomadee", commission: "1-15%" },
];

export default function MonetizationSettings({
  settings,
}: MonetizationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(
    settings?.monetization?.affiliate?.networks || []
  );

  const updateSettings = useUpdateSettings();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<MonetizationSettingsForm>({
    resolver: zodResolver(monetizationSettingsSchema),
    defaultValues: {
      monetization: {
        adsense: {
          enabled: settings?.monetization?.adsense?.enabled || false,
          publisher_id: settings?.monetization?.adsense?.publisher_id || "",
          auto_ads: settings?.monetization?.adsense?.auto_ads || false,
        },
        affiliate: {
          enabled: settings?.monetization?.affiliate?.enabled || false,
          networks: settings?.monetization?.affiliate?.networks || [],
        },
      },
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: MonetizationSettingsForm) => {
    setIsLoading(true);
    try {
      await updateSettings.mutateAsync({
        ...data,
        monetization: {
          ...data.monetization,
          affiliate: {
            ...data.monetization.affiliate,
            networks: selectedNetworks,
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAffiliateNetwork = (networkId: string) => {
    const newNetworks = selectedNetworks.includes(networkId)
      ? selectedNetworks.filter((id) => id !== networkId)
      : [...selectedNetworks, networkId];

    setSelectedNetworks(newNetworks);
    setValue("monetization.affiliate.networks", newNetworks);
  };

  const revenueData = [
    { source: "Google AdSense", amount: "R$ 245,30", period: "Este mês" },
    { source: "Amazon Associates", amount: "R$ 89,50", period: "Este mês" },
    { source: "Hotmart", amount: "R$ 156,80", period: "Este mês" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Visão Geral da Receita */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Visão Geral da Receita</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 491,60</p>
                  <p className="text-sm text-muted-foreground">
                    Total este mês
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 1.247,30</p>
                  <p className="text-sm text-muted-foreground">
                    Total últimos 3 meses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 164</p>
                  <p className="text-sm text-muted-foreground">Média mensal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhamento por Fonte */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Fonte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.source}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.period}
                    </p>
                  </div>
                  <span className="font-bold text-green-600">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Google AdSense */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Google AdSense
                </CardTitle>
                <CardDescription>
                  Monetize seu conteúdo com anúncios do Google
                </CardDescription>
              </div>
              <Switch
                checked={watchedValues.monetization.adsense.enabled}
                onCheckedChange={(checked) =>
                  setValue("monetization.adsense.enabled", checked)
                }
              />
            </div>
          </CardHeader>

          {watchedValues.monetization.adsense.enabled && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publisher_id">Publisher ID</Label>
                  <Input
                    id="publisher_id"
                    placeholder="pub-1234567890123456"
                    {...register("monetization.adsense.publisher_id")}
                  />
                  {errors.monetization?.adsense?.publisher_id && (
                    <p className="text-sm text-destructive">
                      {errors.monetization.adsense.publisher_id.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto_ads">Auto Ads</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que o Google otimize automaticamente os anúncios
                    </p>
                  </div>
                  <Switch
                    checked={watchedValues.monetization.adsense.auto_ads}
                    onCheckedChange={(checked) =>
                      setValue("monetization.adsense.auto_ads", checked)
                    }
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Como configurar o AdSense
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      1. Crie uma conta no Google AdSense
                      <br />
                      2. Adicione seu site e aguarde aprovação
                      <br />
                      3. Copie seu Publisher ID e cole aqui
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-600"
                      onClick={() =>
                        window.open("https://www.google.com/adsense/", "_blank")
                      }
                    >
                      Acessar Google AdSense →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Programas de Afiliados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🤝</span>
                  Programas de Afiliados
                </CardTitle>
                <CardDescription>
                  Ganhe comissões promovendo produtos e serviços
                </CardDescription>
              </div>
              <Switch
                checked={watchedValues.monetization.affiliate.enabled}
                onCheckedChange={(checked) =>
                  setValue("monetization.affiliate.enabled", checked)
                }
              />
            </div>
          </CardHeader>

          {watchedValues.monetization.affiliate.enabled && (
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  Redes de Afiliados
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione as redes de afiliados que você deseja usar
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {affiliateNetworks.map((network) => (
                    <motion.div
                      key={network.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedNetworks.includes(network.id)
                            ? "ring-2 ring-primary shadow-md"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => toggleAffiliateNetwork(network.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{network.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Comissão: {network.commission}
                              </p>
                            </div>
                            {selectedNetworks.includes(network.id) && (
                              <Badge className="bg-green-100 text-green-800">
                                Ativo
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {selectedNetworks.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    Redes Selecionadas ({selectedNetworks.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNetworks.map((networkId) => {
                      const network = affiliateNetworks.find(
                        (n) => n.id === networkId
                      );
                      return (
                        <Badge key={networkId} variant="secondary">
                          {network?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Configurações Avançadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Configurações Avançadas</CardTitle>
            <CardDescription>
              Configurações adicionais de monetização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Otimização de Receita</h4>
                <p className="text-sm text-muted-foreground">
                  Use IA para otimizar posicionamento de anúncios e links de
                  afiliados
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Relatórios Detalhados</h4>
                <p className="text-sm text-muted-foreground">
                  Acompanhe performance de cada fonte de receita em tempo real
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
          Salvar Configurações
        </AnimatedButton>
      </motion.div>
    </form>
  );
}
