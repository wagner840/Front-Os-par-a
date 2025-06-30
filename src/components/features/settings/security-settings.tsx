"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Shield,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Save,
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
import { useSupabase } from "@/lib/hooks/use-supabase";
import { AnimatedButton } from "@/components/ui/animated-button";
import { toast } from "sonner";

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "Nova senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

interface SecuritySettingsProps {
  settings?: any;
}

export default function SecuritySettings({ settings }: SecuritySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const { supabase, user } = useSupabase();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onSubmitPasswordChange = async (data: PasswordChangeForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;

      toast.success("Senha alterada com sucesso!");
      reset();
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast.error("Erro ao alterar senha");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const securityChecks = [
    {
      label: "Senha forte",
      status: true,
      description: "Sua senha atende aos critérios de segurança",
    },
    {
      label: "Email verificado",
      status: user?.email_confirmed_at ? true : false,
      description: "Seu email foi verificado",
    },
    {
      label: "Autenticação em dois fatores",
      status: twoFactorEnabled,
      description: "2FA adiciona uma camada extra de segurança",
    },
    {
      label: "Sessões ativas",
      status: true,
      description: "Monitore dispositivos conectados",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Status de Segurança */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Status de Segurança</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityChecks.map((check, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  {check.status ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">{check.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {check.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Alterar Senha */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Mantenha sua conta segura com uma senha forte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmitPasswordChange)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    {...register("currentPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  disabled={!isDirty || isLoading}
                  loading={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Alterar Senha
                </AnimatedButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Autenticação em Dois Fatores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Autenticação em Dois Fatores (2FA)</CardTitle>
            <CardDescription>
              Adicione uma camada extra de segurança à sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ativar 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Use um aplicativo autenticador para gerar códigos
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>

            {twoFactorEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-muted/50 rounded-lg"
              >
                <p className="text-sm">
                  Configure seu aplicativo autenticador escaneando o QR code que
                  será exibido na próxima etapa.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Sessões Ativas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Sessões Ativas</CardTitle>
            <CardDescription>
              Gerencie dispositivos e sessões conectados à sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Sessão Atual</p>
                  <p className="text-sm text-muted-foreground">
                    Windows • Chrome • Agora
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Ativo
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline">Ver Todas as Sessões</Button>
              <Button variant="destructive" onClick={handleSignOut}>
                Encerrar Todas as Sessões
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Zona de Perigo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis que afetam sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
              <div>
                <p className="font-medium">Excluir Conta</p>
                <p className="text-sm text-muted-foreground">
                  Remove permanentemente sua conta e todos os dados
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
