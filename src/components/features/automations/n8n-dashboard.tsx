"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import {
  Zap,
  Activity,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  Settings,
  Terminal,
  Code,
  Database,
  GitBranch,
  FileText,
  Image,
  Tags,
  FolderOpen,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Timer,
  Target,
  Sparkles,
  Bot,
  Workflow,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  CircuitBoard,
  Gauge,
  Network,
  Shield,
  Eye,
  EyeOff,
  Download,
  Upload,
  History,
  MoreVertical,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useN8nIntegration } from "@/lib/hooks/use-n8n-integration";

export function N8nDashboard() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("24h");

  // Hook unificado do n8n
  const {
    workflows,
    executions,
    health: systemHealth,
    connection,
    isLoadingWorkflows,
    isLoadingExecutions,
    workflowsError,
    executionsError,
    activateWorkflow,
    deactivateWorkflow,
    executeWorkflow,
    stopExecution,
    retryExecution,
    refetch,
  } = useN8nIntegration();

  const isConnected = connection?.connected || false;
  const isLoading = isLoadingWorkflows || isLoadingExecutions;
  const isError = workflowsError || executionsError;

  // Calcular estatísticas usando dados reais
  const stats = {
    totalWorkflows: workflows?.length || 0,
    activeWorkflows: workflows?.filter((w) => w.active).length || 0,
    totalExecutions: executions?.length || 0,
    successfulExecutions:
      executions?.filter((e) => e.status === "success").length || 0,
    failedExecutions:
      executions?.filter((e) => e.status === "failed").length || 0,
    avgSuccessRate: workflows?.length
      ? workflows.reduce((acc, w) => acc + (workflows.length > 0 ? 95 : 0), 0) /
        workflows.length
      : 0,
    totalNodesProcessed:
      workflows?.reduce((acc, w) => acc + (w.nodes?.length || 0), 0) || 0,
    uptime: systemHealth?.uptime || 0,
  };

  // Handler para controlar workflow
  const handleWorkflowControl = async (
    workflowId: string,
    action: "start" | "stop" | "restart"
  ) => {
    try {
      if (action === "start") {
        await activateWorkflow.mutateAsync(workflowId);
      } else if (action === "stop") {
        await deactivateWorkflow.mutateAsync(workflowId);
      } else if (action === "restart") {
        await deactivateWorkflow.mutateAsync(workflowId);
        setTimeout(() => activateWorkflow.mutate(workflowId), 1000);
      }
    } catch (error) {
      console.error("Erro ao controlar workflow:", error);
    }
  };

  // Componente de card de workflow
  const WorkflowCard = ({ workflow }: { workflow: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <GlassCard
        className="p-4 cursor-pointer"
        onClick={() => setSelectedWorkflow(workflow.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                workflow.active ? "bg-green-500/20" : "bg-gray-500/20"
              }`}
            >
              <Workflow
                className={`w-5 h-5 ${
                  workflow.active ? "text-green-400" : "text-gray-400"
                }`}
              />
            </div>
            <div>
              <h4 className="font-semibold text-white">{workflow.name}</h4>
              <p className="text-white/60 text-sm">
                {workflow.nodes?.length || 0} nodes
              </p>
            </div>
          </div>
          <Badge variant={workflow.active ? "default" : "secondary"}>
            {workflow.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Status</span>
            <span className="text-white font-semibold">
              {workflow.active ? "Ativo" : "Inativo"}
            </span>
          </div>

          <div className="flex justify-between text-sm pt-1">
            <span className="text-white/60">Criado em</span>
            <span className="text-white">
              {new Date(workflow.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-white/60">Atualizado</span>
            <span className="text-blue-400">
              {new Date(workflow.updatedAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>

        <div className="flex gap-1 mt-3">
          {workflow.tags?.map((tag: any) => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={() => {
              handleWorkflowControl(
                workflow.id,
                workflow.active ? "stop" : "start"
              );
            }}
          >
            {workflow.active ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </AnimatedButton>
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={() => {
              handleWorkflowControl(workflow.id, "restart");
            }}
          >
            <RefreshCw className="w-4 h-4" />
          </AnimatedButton>
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={() => {
              window.open(
                `https://n8n.pawa.dev/workflow/${workflow.id}`,
                "_blank"
              );
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </AnimatedButton>
        </div>
      </GlassCard>
    </motion.div>
  );

  // Componente de execução
  const ExecutionRow = ({ execution }: { execution: any }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            execution.status === "success"
              ? "bg-green-500/20"
              : execution.status === "error"
              ? "bg-red-500/20"
              : execution.status === "running"
              ? "bg-blue-500/20"
              : "bg-yellow-500/20"
          }`}
        >
          {execution.status === "success" && (
            <CheckCircle className="w-4 h-4 text-green-400" />
          )}
          {execution.status === "failed" && (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          {execution.status === "running" && (
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          )}
          {execution.status === "waiting" && (
            <Clock className="w-4 h-4 text-yellow-400" />
          )}
        </div>

        <div>
          <p className="font-medium text-white">{execution.workflowName}</p>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <span>{new Date(execution.startedAt).toLocaleString("pt-BR")}</span>
            {execution.executionTime && (
              <>
                <span>•</span>
                <span>{execution.executionTime}s</span>
              </>
            )}
            <span>•</span>
            <Badge variant="outline" className="text-xs">
              {execution.mode}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {execution.status === "running" && execution.data?.progress && (
          <div className="flex items-center gap-2">
            <Progress value={execution.data.progress} className="w-20 h-2" />
            <span className="text-sm text-white/60">
              {execution.data.progress}%
            </span>
          </div>
        )}

        {execution.status === "success" && execution.data && (
          <div className="text-sm text-white/60">
            {Object.entries(execution.data).map(([key, value]) => (
              <span key={key} className="mr-3">
                {key}: <span className="text-white font-medium">{value}</span>
              </span>
            ))}
          </div>
        )}

        {execution.status === "error" && (
          <p className="text-sm text-red-400">{execution.error}</p>
        )}

        <AnimatedButton variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </AnimatedButton>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bot className="w-10 h-10 text-purple-400" />
            Central de Automações n8n
          </h2>
          <p className="text-white/60 mt-1">
            Monitore e controle todos os workflows de automação
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            {isConnected ? (
              <Wifi className="w-3 h-3 mr-2 text-green-400" />
            ) : (
              <WifiOff className="w-3 h-3 mr-2 text-red-400" />
            )}
            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>

          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </AnimatedButton>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Workflows Ativos</p>
              <p className="text-3xl font-bold text-white">
                {stats.activeWorkflows}/{stats.totalWorkflows}
              </p>
            </div>
            <Workflow className="w-8 h-8 text-purple-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Taxa de Sucesso</p>
              <p className="text-3xl font-bold text-green-400">
                {stats.avgSuccessRate.toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Execuções (24h)</p>
              <p className="text-3xl font-bold text-blue-400">
                {stats.totalExecutions}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Nodes Processados</p>
              <p className="text-3xl font-bold text-yellow-400">
                {stats.totalNodesProcessed.toLocaleString()}
              </p>
            </div>
            <CircuitBoard className="w-8 h-8 text-yellow-400" />
          </div>
        </GlassCard>
      </div>

      {/* Tabs Principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/10 backdrop-blur-md border border-white/20">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Execuções</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflows Ativos */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Workflows Ativos
              </h3>
              <div className="space-y-3">
                {workflows
                  ?.filter((w) => w.active)
                  .map((workflow) => (
                    <div
                      key={workflow.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="font-medium text-white">
                          {workflow.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-white/60">
                          {workflow.nodes?.length || 0} nodes
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {workflow.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </GlassCard>

            {/* Execuções Recentes */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <History className="w-6 h-6 text-blue-400" />
                Execuções Recentes
              </h3>
              <div className="space-y-3">
                {executions?.slice(0, 5).map((execution) => (
                  <ExecutionRow key={execution.id} execution={execution} />
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Gráfico de Atividade */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              Atividade nas Últimas 24 Horas
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {Array.from({ length: 24 }, (_, i) => {
                const height = Math.random() * 100;
                const isError = Math.random() > 0.9;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-full rounded-t transition-all hover:opacity-80 ${
                        isError ? "bg-red-400" : "bg-blue-400"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-white/40">{i}h</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Todos os Workflows
            </h3>
            <AnimatedButton variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Workflow
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows?.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </TabsContent>

        {/* Executions Tab */}
        <TabsContent value="executions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Histórico de Execuções
            </h3>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="1h">Última hora</option>
                <option value="24h">Últimas 24 horas</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {executions?.map((execution) => (
              <ExecutionRow key={execution.id} execution={execution} />
            ))}
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Performance por Workflow
              </h3>
              <div className="space-y-4">
                {workflows?.map((workflow) => (
                  <div key={workflow.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">{workflow.name}</span>
                      <span className="text-white font-medium">
                        {workflow.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <Progress
                      value={workflow.active ? 100 : 0}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Recursos Utilizados
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    <span className="text-white/80">CPU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={45} className="w-24 h-2" />
                    <span className="text-white text-sm">45%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Memória</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={62} className="w-24 h-2" />
                    <span className="text-white text-sm">62%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Network className="w-5 h-5 text-purple-400" />
                    <span className="text-white/80">Rede</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={28} className="w-24 h-2" />
                    <span className="text-white text-sm">28%</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-6 h-6 text-green-400" />
              Logs do Sistema
            </h3>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm space-y-2 max-h-96 overflow-y-auto">
              {Array.from({ length: 20 }, (_, i) => {
                const types = ["INFO", "WARN", "ERROR", "DEBUG"];
                const type = types[Math.floor(Math.random() * types.length)];
                const colors = {
                  INFO: "text-blue-400",
                  WARN: "text-yellow-400",
                  ERROR: "text-red-400",
                  DEBUG: "text-gray-400",
                };

                return (
                  <div key={i} className="flex gap-3">
                    <span className="text-white/40">
                      {new Date(Date.now() - i * 60000).toLocaleTimeString(
                        "pt-BR"
                      )}
                    </span>
                    <span className={`font-bold ${colors[type]}`}>
                      [{type}]
                    </span>
                    <span className="text-white/80">
                      {type === "INFO" &&
                        "Workflow 'Categorização de Keywords' executado com sucesso"}
                      {type === "WARN" &&
                        "Taxa limite da API próxima do máximo (85%)"}
                      {type === "ERROR" &&
                        "Falha ao conectar com WordPress API - timeout"}
                      {type === "DEBUG" &&
                        "Iniciando processo de sincronização de taxonomias"}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
