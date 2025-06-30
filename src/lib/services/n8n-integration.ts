// Tipos para dados n8n
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  createdAt: string;
  updatedAt: string;
}

export interface N8nExecution {
  id: string;
  workflowId: string;
  status: "success" | "failed" | "running" | "waiting";
  startedAt: string;
  finishedAt?: string;
  data?: any;
}

interface N8nCredential {
  id: string;
  name: string;
  type: string;
  nodesAccess: Array<{ nodeType: string }>;
  createdAt: string;
  updatedAt: string;
}

interface N8nWebhook {
  id: string;
  workflowId: string;
  node: string;
  method: string;
  path: string;
  webhookId: string;
  isTest: boolean;
}

// Serviço principal n8n com fallback inteligente
export class N8nIntegrationService {
  private isRealApiMode: boolean = true;
  private lastApiCheck: number = 0;
  private apiCheckInterval: number = 30000; // 30 segundos

  constructor() {
    console.log(
      "🔗 n8n service iniciado com URL: https://n8n.einsof7.com (via proxy)"
    );
  }

  // Método unificado para fazer requisições
  private async makeApiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Sempre usar proxy para evitar CORS
      const proxyUrl = `/api/n8n-proxy?endpoint=${encodeURIComponent(
        endpoint
      )}`;

      const response = await fetch(proxyUrl, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Se chegou até aqui, API está funcionando
      this.isRealApiMode = true;
      this.lastApiCheck = Date.now();

      return data;
    } catch (error) {
      console.warn(`⚠️ Falha na API n8n: ${error}`);

      // Marcar como indisponível e usar modo demo
      this.isRealApiMode = false;
      this.lastApiCheck = Date.now();

      throw error;
    }
  }

  // Dados demo para fallback
  private getDemoWorkflows(): N8nWorkflow[] {
    return [
      {
        id: "demo-1",
        name: "WordPress Auto-Publisher",
        active: true,
        nodes: [],
        connections: {},
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-2",
        name: "Keyword Tracker",
        active: false,
        nodes: [],
        connections: {},
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-3",
        name: "Content Analyzer",
        active: true,
        nodes: [],
        connections: {},
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private getDemoExecutions(): N8nExecution[] {
    return [
      {
        id: "exec-1",
        workflowId: "demo-1",
        status: "success",
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        finishedAt: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: "exec-2",
        workflowId: "demo-2",
        status: "failed",
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        finishedAt: new Date(Date.now() - 7100000).toISOString(),
      },
      {
        id: "exec-3",
        workflowId: "demo-3",
        status: "running",
        startedAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ];
  }

  // Métodos principais da API
  async getWorkflows(): Promise<N8nWorkflow[]> {
    try {
      const data = await this.makeApiRequest<{ data: N8nWorkflow[] }>(
        "/workflows"
      );
      return data.data || [];
    } catch (error) {
      console.log("📋 Usando workflows demo devido à falha na API");
      return this.getDemoWorkflows();
    }
  }

  async getExecutions(
    workflowId?: string,
    options: {
      limit?: number;
      status?: string;
      includeData?: boolean;
    } = {}
  ): Promise<N8nExecution[]> {
    try {
      const params = new URLSearchParams();
      if (workflowId) params.append("workflowId", workflowId);
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.status) params.append("status", options.status);
      if (options.includeData) params.append("includeData", "true");

      const endpoint = `/executions${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const data = await this.makeApiRequest<{ data: N8nExecution[] }>(
        endpoint
      );
      return data.data || [];
    } catch (error) {
      console.log("📊 Usando execuções demo devido à falha na API");
      let executions = this.getDemoExecutions();

      // Filtrar por workflowId se especificado
      if (workflowId) {
        executions = executions.filter(
          (exec) => exec.workflowId === workflowId
        );
      }

      return executions;
    }
  }

  async getSystemHealth(): Promise<{
    status: "healthy" | "unhealthy";
    version: string;
    uptime: number;
    totalWorkflows: number;
    activeWorkflows: number;
    totalExecutions: number;
  }> {
    try {
      const workflows = await this.getWorkflows();
      const executions = await this.getExecutions(undefined, { limit: 100 });

      return {
        status: this.isRealApiMode ? "healthy" : "unhealthy",
        version: "1.0.0",
        uptime: Date.now() - (Date.now() % (24 * 60 * 60 * 1000)),
        totalWorkflows: workflows.length,
        activeWorkflows: workflows.filter((w) => w.active).length,
        totalExecutions: executions.length,
      };
    } catch (error) {
      console.log("🏥 Usando status demo devido à falha na API");
      return {
        status: "unhealthy",
        version: "demo",
        uptime: 0,
        totalWorkflows: 3,
        activeWorkflows: 2,
        totalExecutions: 3,
      };
    }
  }

  // Métodos de controle (sempre demo para segurança)
  async activateWorkflow(workflowId: string): Promise<boolean> {
    console.log(`🟢 [DEMO] Ativando workflow: ${workflowId}`);
    return true;
  }

  async deactivateWorkflow(workflowId: string): Promise<boolean> {
    console.log(`🔴 [DEMO] Desativando workflow: ${workflowId}`);
    return true;
  }

  async executeWorkflow(workflowId: string): Promise<string> {
    console.log(`▶️ [DEMO] Executando workflow: ${workflowId}`);
    return `exec-demo-${Date.now()}`;
  }

  async stopExecution(executionId: string): Promise<boolean> {
    console.log(`⏹️ [DEMO] Parando execução: ${executionId}`);
    return true;
  }

  async retryExecution(executionId: string): Promise<string> {
    console.log(`🔄 [DEMO] Tentando novamente execução: ${executionId}`);
    return `exec-retry-${Date.now()}`;
  }

  // Status da conexão
  isConnected(): boolean {
    return this.isRealApiMode;
  }

  getConnectionStatus(): "connected" | "disconnected" | "demo" {
    if (this.isRealApiMode) return "connected";
    return "demo";
  }
}

// Instância singleton
export const n8nService = new N8nIntegrationService();
