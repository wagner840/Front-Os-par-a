"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useWordPressConfig,
  useSaveWordPressConfig,
  useTestWordPressConnection,
  useWordPressIntegrationStats,
  useWordPressHealthCheck,
  useCreateWordPressBackup,
  useSyncPostsFromWordPress,
  useWordPressPerformanceMetrics,
} from "@/lib/hooks/use-wordpress-integration";
import { useAppStore } from "@/lib/stores/app-store";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  WifiOff,
  Settings,
  RefreshCw as Sync,
  Database,
  Shield,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  Zap,
  BarChart3,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  TestTube,
  HardDrive,
  Timer,
  Users,
  FileText,
  Tags,
  Image,
  MessageSquare,
  Puzzle,
  Palette,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import { WordPressConfig } from "@/lib/types/wordpress";

export function IntegrationSettings() {
  const { selectedBlog } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "config" | "sync" | "backup" | "monitoring" | "advanced"
  >("config");

  const [formData, setFormData] = useState<WordPressConfig>({
    base_url: "",
    username: "",
    app_password: "",
    sync_enabled: false,
    auto_sync_interval: 30,
    sync_categories: true,
    sync_tags: true,
    sync_media: false,
    sync_comments: false,
    backup_enabled: false,
    backup_frequency: "daily",
  });

  // Hooks
  const { data: config, isLoading: configLoading } = useWordPressConfig(
    selectedBlog || undefined
  );
  const saveConfig = useSaveWordPressConfig();
  const testConnection = useTestWordPressConnection();
  const { data: stats, refetch: refetchStats } = useWordPressIntegrationStats(
    selectedBlog || undefined
  );
  const { data: healthCheck } = useWordPressHealthCheck(
    selectedBlog || undefined
  );
  const { data: performance } = useWordPressPerformanceMetrics(
    selectedBlog || undefined
  );
  const createBackup = useCreateWordPressBackup();
  const syncPosts = useSyncPostsFromWordPress();

  // Carregar configuração existente
  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleSave = async () => {
    if (!selectedBlog) {
      toast.error("Selecione um blog primeiro");
      return;
    }

    try {
      await saveConfig.mutateAsync({ blogId: selectedBlog, config: formData });
      await refetchStats();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleTestConnection = async () => {
    try {
      await testConnection.mutateAsync(formData);
    } catch (error) {
      console.error("Erro no teste:", error);
    }
  };

  const handleCreateBackup = async () => {
    if (!config) {
      toast.error("Configure a integração primeiro");
      return;
    }

    try {
      await createBackup.mutateAsync(config);
    } catch (error) {
      console.error("Erro no backup:", error);
    }
  };

  const handleSyncPosts = async () => {
    if (!selectedBlog) {
      toast.error("Selecione um blog primeiro");
      return;
    }

    try {
      await syncPosts.mutateAsync(selectedBlog);
      await refetchStats();
    } catch (error) {
      console.error("Erro na sincronização:", error);
    }
  };

  const getConnectionStatus = () => {
    if (!stats)
      return { icon: WifiOff, color: "text-gray-400", label: "Desconectado" };

    switch (stats.connection_status) {
      case "connected":
        return { icon: Wifi, color: "text-green-400", label: "Conectado" };
      case "error":
        return { icon: XCircle, color: "text-red-400", label: "Erro" };
      default:
        return { icon: WifiOff, color: "text-gray-400", label: "Desconectado" };
    }
  };

  const connectionStatus = getConnectionStatus();

  const tabs = [
    { id: "config", label: "Configuração", icon: Settings },
    { id: "sync", label: "Sincronização", icon: Sync },
    { id: "backup", label: "Backup", icon: Database },
    { id: "monitoring", label: "Monitoramento", icon: Activity },
    { id: "advanced", label: "Avançado", icon: Shield },
  ];

  if (configLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Integração WordPress
          </h2>
          <p className="text-white/70">
            Configure e gerencie a integração com seus sites WordPress
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <connectionStatus.icon
              className={`w-5 h-5 ${connectionStatus.color}`}
            />
            <span className={`text-sm font-medium ${connectionStatus.color}`}>
              {connectionStatus.label}
            </span>
          </div>

          {stats && (
            <Badge
              variant="outline"
              className="bg-blue-500/20 text-blue-300 border-blue-500/30"
            >
              {stats.synced_posts}/{stats.supabase_posts} sincronizados
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-blue-500 text-white shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "config" && (
            <GlassCard className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Configuração Básica
                  </h3>
                  <p className="text-white/60 text-sm">
                    Configure as credenciais de acesso ao WordPress
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_url" className="text-white/90">
                    URL do WordPress
                  </Label>
                  <Input
                    id="base_url"
                    type="url"
                    placeholder="https://seusite.com.br"
                    value={formData.base_url}
                    onChange={(e) =>
                      setFormData({ ...formData, base_url: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white/90">
                    Nome de Usuário
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="seu_usuario"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="app_password" className="text-white/90">
                    Application Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="app_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                      value={formData.app_password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          app_password: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <AnimatedButton
                  onClick={handleTestConnection}
                  disabled={
                    testConnection.isPending ||
                    !formData.base_url ||
                    !formData.username ||
                    !formData.app_password
                  }
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  {testConnection.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4" />
                  )}
                  Testar Conexão
                </AnimatedButton>

                <AnimatedButton
                  onClick={handleSave}
                  disabled={saveConfig.isPending}
                  className="flex items-center gap-2"
                >
                  {saveConfig.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Salvar Configuração
                </AnimatedButton>
              </div>
            </GlassCard>
          )}

          {activeTab === "sync" && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Sync className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Configurações de Sincronização
                    </h3>
                    <p className="text-white/60 text-sm">
                      Configure como os dados são sincronizados
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white/90">
                        Sincronização Automática
                      </Label>
                      <p className="text-white/60 text-sm">
                        Sincronizar automaticamente em intervalos regulares
                      </p>
                    </div>
                    <Switch
                      checked={formData.sync_enabled}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, sync_enabled: checked })
                      }
                    />
                  </div>

                  {formData.sync_enabled && (
                    <div className="space-y-2">
                      <Label htmlFor="interval" className="text-white/90">
                        Intervalo (minutos)
                      </Label>
                      <Input
                        id="interval"
                        type="number"
                        min="5"
                        max="1440"
                        value={formData.auto_sync_interval}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            auto_sync_interval: parseInt(e.target.value),
                          })
                        }
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  )}

                  <Separator className="bg-white/10" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tags className="w-4 h-4 text-blue-400" />
                        <span className="text-white/90 text-sm">
                          Categorias
                        </span>
                      </div>
                      <Switch
                        checked={formData.sync_categories}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, sync_categories: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tags className="w-4 h-4 text-purple-400" />
                        <span className="text-white/90 text-sm">Tags</span>
                      </div>
                      <Switch
                        checked={formData.sync_tags}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, sync_tags: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4 text-green-400" />
                        <span className="text-white/90 text-sm">Mídia</span>
                      </div>
                      <Switch
                        checked={formData.sync_media}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, sync_media: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/90 text-sm">
                          Comentários
                        </span>
                      </div>
                      <Switch
                        checked={formData.sync_comments}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, sync_comments: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <AnimatedButton
                    onClick={handleSyncPosts}
                    disabled={syncPosts.isPending}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {syncPosts.isPending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Sincronizar do WordPress
                  </AnimatedButton>

                  <AnimatedButton
                    onClick={handleSave}
                    disabled={saveConfig.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Configurações
                  </AnimatedButton>
                </div>
              </GlassCard>

              {/* Estatísticas de Sincronização */}
              {stats && (
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Estatísticas de Sincronização
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {stats.wordpress_posts}
                      </div>
                      <div className="text-white/60 text-sm">
                        Posts WordPress
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {stats.supabase_posts}
                      </div>
                      <div className="text-white/60 text-sm">
                        Posts Supabase
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {stats.synced_posts}
                      </div>
                      <div className="text-white/60 text-sm">Sincronizados</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {stats.pending_sync}
                      </div>
                      <div className="text-white/60 text-sm">Pendentes</div>
                    </div>
                  </div>

                  {stats.synced_posts > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-white/70 mb-2">
                        <span>Progresso da Sincronização</span>
                        <span>
                          {Math.round(
                            (stats.synced_posts / stats.supabase_posts) * 100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (stats.synced_posts / stats.supabase_posts) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  )}
                </GlassCard>
              )}
            </div>
          )}

          {activeTab === "backup" && (
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Backup e Restauração
                  </h3>
                  <p className="text-white/60 text-sm">
                    Gerencie backups dos seus dados WordPress
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white/90">Backup Automático</Label>
                    <p className="text-white/60 text-sm">
                      Criar backups automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={formData.backup_enabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, backup_enabled: checked })
                    }
                  />
                </div>

                {formData.backup_enabled && (
                  <div className="space-y-2">
                    <Label className="text-white/90">
                      Frequência do Backup
                    </Label>
                    <select
                      value={formData.backup_frequency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          backup_frequency: e.target.value as any,
                        })
                      }
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="hourly">A cada hora</option>
                      <option value="daily">Diariamente</option>
                      <option value="weekly">Semanalmente</option>
                      <option value="monthly">Mensalmente</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <AnimatedButton
                    onClick={handleCreateBackup}
                    disabled={createBackup.isPending}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {createBackup.isPending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Database className="w-4 h-4" />
                    )}
                    Criar Backup Agora
                  </AnimatedButton>

                  <AnimatedButton
                    onClick={handleSave}
                    disabled={saveConfig.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Configurações
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "monitoring" && (
            <div className="space-y-6">
              {/* Health Check */}
              {healthCheck && (
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Status do Sistema
                      </h3>
                      <p className="text-white/60 text-sm">
                        Monitoramento em tempo real
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      {healthCheck.overall_health === "healthy" ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <div className="text-white font-medium">
                          Saúde Geral
                        </div>
                        <div
                          className={`text-sm ${
                            healthCheck.overall_health === "healthy"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {healthCheck.overall_health === "healthy"
                            ? "Saudável"
                            : "Problemas"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      {healthCheck.connection.success ? (
                        <Wifi className="w-5 h-5 text-green-400" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <div className="text-white font-medium">Conexão</div>
                        <div
                          className={`text-sm ${
                            healthCheck.connection.success
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {healthCheck.connection.success
                            ? "Conectado"
                            : "Desconectado"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">
                          Última Verificação
                        </div>
                        <div className="text-blue-400 text-sm">
                          {new Date(
                            healthCheck.last_check
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Performance Metrics */}
              {performance && (
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Métricas de Performance
                      </h3>
                      <p className="text-white/60 text-sm">
                        Monitoramento de desempenho
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {performance.response_time}ms
                      </div>
                      <div className="text-white/60 text-sm">
                        Tempo de Resposta
                      </div>
                    </div>

                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {performance.success_rate}%
                      </div>
                      <div className="text-white/60 text-sm">
                        Taxa de Sucesso
                      </div>
                    </div>

                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">
                        {performance.uptime_percentage}%
                      </div>
                      <div className="text-white/60 text-sm">Uptime</div>
                    </div>

                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">
                        {performance.alerts.length}
                      </div>
                      <div className="text-white/60 text-sm">Alertas</div>
                    </div>
                  </div>

                  {performance.alerts.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-white font-medium mb-2">
                        Alertas Recentes
                      </h4>
                      <div className="space-y-2">
                        {performance.alerts.map((alert, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                          >
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-red-200 text-sm">
                              {alert.message}
                            </span>
                            <span className="text-red-400/70 text-xs ml-auto">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              )}
            </div>
          )}

          {activeTab === "advanced" && (
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Configurações Avançadas
                  </h3>
                  <p className="text-white/60 text-sm">
                    Configurações para usuários avançados
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      Recursos WordPress
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/70">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Posts e Páginas</span>
                        <Badge variant="outline" className="ml-auto">
                          Ativo
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-white/70">
                        <Tags className="w-4 h-4" />
                        <span className="text-sm">Categorias e Tags</span>
                        <Badge variant="outline" className="ml-auto">
                          Ativo
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-white/70">
                        <Image className="w-4 h-4" />
                        <span className="text-sm">Biblioteca de Mídia</span>
                        <Badge variant="outline" className="ml-auto">
                          Ativo
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-white/70">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Usuários</span>
                        <Badge variant="outline" className="ml-auto">
                          Ativo
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-white/70">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">Comentários</span>
                        <Badge variant="outline" className="ml-auto">
                          Ativo
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <Puzzle className="w-4 h-4" />
                      Plugins e Temas
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/70">
                        <Puzzle className="w-4 h-4" />
                        <span className="text-sm">
                          Gerenciamento de Plugins
                        </span>
                        <Badge variant="outline" className="ml-auto">
                          Ativo
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-white/70">
                        <Palette className="w-4 h-4" />
                        <span className="text-sm">Gerenciamento de Temas</span>
                        <Badge variant="outline" className="ml-auto">
                          Ativo
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-white/70">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Configurações do Site</span>
                        <Badge variant="outline" className="ml-auto">
                          Ativo
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-white/70">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">API REST Completa</span>
                        <Badge variant="outline" className="ml-auto">
                          Ativo
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div>
                  <h4 className="text-white font-medium mb-3">
                    Informações da Integração
                  </h4>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Versão da API:</span>
                      <span className="text-white">WordPress REST API v2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">
                        Método de Autenticação:
                      </span>
                      <span className="text-white">Application Passwords</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Protocolo:</span>
                      <span className="text-white">HTTPS/SSL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Rate Limiting:</span>
                      <span className="text-white">Ativo</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
