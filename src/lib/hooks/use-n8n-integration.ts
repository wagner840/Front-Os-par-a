import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  n8nService,
  N8nWorkflow,
  N8nExecution,
} from "../services/n8n-integration";

// Hook para workflows
export function useN8nWorkflows() {
  return useQuery({
    queryKey: ["n8n", "workflows"],
    queryFn: () => n8nService.getWorkflows(),
    refetchInterval: 15000, // Refresh a cada 15 segundos
    staleTime: 10000,
  });
}

// Hook para execuções
export function useN8nExecutions(
  workflowId?: string,
  options: {
    limit?: number;
    status?: string;
    includeData?: boolean;
  } = {}
) {
  return useQuery({
    queryKey: ["n8n", "executions", workflowId, options],
    queryFn: () => n8nService.getExecutions(workflowId, options),
    refetchInterval: 10000, // Refresh a cada 10 segundos
    staleTime: 5000,
  });
}

// Hook para status do sistema
export function useN8nSystemHealth() {
  return useQuery({
    queryKey: ["n8n", "health"],
    queryFn: () => n8nService.getSystemHealth(),
    refetchInterval: 20000, // Refresh a cada 20 segundos
    staleTime: 15000,
  });
}

// Hook para status de conexão
export function useN8nConnectionStatus() {
  return useQuery({
    queryKey: ["n8n", "connection"],
    queryFn: () => ({
      connected: n8nService.isConnected(),
      status: n8nService.getConnectionStatus(),
    }),
    refetchInterval: 30000, // Refresh a cada 30 segundos
    staleTime: 25000,
  });
}

// Mutations para controle de workflows
export function useN8nWorkflowActions() {
  const queryClient = useQueryClient();

  const activateWorkflow = useMutation({
    mutationFn: (workflowId: string) => n8nService.activateWorkflow(workflowId),
    onSuccess: (_, workflowId) => {
      toast.success("Workflow ativado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["n8n", "workflows"] });
      queryClient.invalidateQueries({ queryKey: ["n8n", "health"] });
    },
    onError: () => {
      toast.error("Erro ao ativar workflow");
    },
  });

  const deactivateWorkflow = useMutation({
    mutationFn: (workflowId: string) =>
      n8nService.deactivateWorkflow(workflowId),
    onSuccess: (_, workflowId) => {
      toast.success("Workflow desativado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["n8n", "workflows"] });
      queryClient.invalidateQueries({ queryKey: ["n8n", "health"] });
    },
    onError: () => {
      toast.error("Erro ao desativar workflow");
    },
  });

  const executeWorkflow = useMutation({
    mutationFn: (workflowId: string) => n8nService.executeWorkflow(workflowId),
    onSuccess: (executionId, workflowId) => {
      toast.success(`Workflow executado! ID: ${executionId}`);
      queryClient.invalidateQueries({ queryKey: ["n8n", "executions"] });
      queryClient.invalidateQueries({ queryKey: ["n8n", "health"] });
    },
    onError: () => {
      toast.error("Erro ao executar workflow");
    },
  });

  return {
    activateWorkflow,
    deactivateWorkflow,
    executeWorkflow,
  };
}

// Mutations para controle de execuções
export function useN8nExecutionActions() {
  const queryClient = useQueryClient();

  const stopExecution = useMutation({
    mutationFn: (executionId: string) => n8nService.stopExecution(executionId),
    onSuccess: (_, executionId) => {
      toast.success("Execução parada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["n8n", "executions"] });
    },
    onError: () => {
      toast.error("Erro ao parar execução");
    },
  });

  const retryExecution = useMutation({
    mutationFn: (executionId: string) => n8nService.retryExecution(executionId),
    onSuccess: (newExecutionId, executionId) => {
      toast.success(`Execução reiniciada! Novo ID: ${newExecutionId}`);
      queryClient.invalidateQueries({ queryKey: ["n8n", "executions"] });
    },
    onError: () => {
      toast.error("Erro ao reiniciar execução");
    },
  });

  return {
    stopExecution,
    retryExecution,
  };
}

// Hook unificado para facilitar o uso
export function useN8nIntegration() {
  const workflows = useN8nWorkflows();
  const executions = useN8nExecutions();
  const health = useN8nSystemHealth();
  const connection = useN8nConnectionStatus();
  const workflowActions = useN8nWorkflowActions();
  const executionActions = useN8nExecutionActions();

  return {
    // Dados
    workflows: workflows.data || [],
    executions: executions.data || [],
    health: health.data,
    connection: connection.data,

    // Estados de loading
    isLoadingWorkflows: workflows.isLoading,
    isLoadingExecutions: executions.isLoading,
    isLoadingHealth: health.isLoading,

    // Estados de erro
    workflowsError: workflows.error,
    executionsError: executions.error,
    healthError: health.error,

    // Ações
    ...workflowActions,
    ...executionActions,

    // Utilitários
    refetch: () => {
      workflows.refetch();
      executions.refetch();
      health.refetch();
      connection.refetch();
    },
  };
}
