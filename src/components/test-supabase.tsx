"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function TestSupabase() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [projectInfo, setProjectInfo] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      // Verificar se estamos no cliente
      if (typeof window === "undefined") {
        setStatus("error");
        setErrorMessage("Executando no servidor");
        return;
      }

      try {
        setStatus("loading");

        const supabase = createClient();

        // Testar conexão básica
        const { data, error } = await supabase
          .from("blogs")
          .select("count")
          .limit(1);

        if (error) {
          setStatus("error");
          setErrorMessage(`Erro na consulta: ${error.message}`);
          return;
        }

        // Se chegou até aqui, a conexão está funcionando
        setStatus("connected");
        setProjectInfo({ blogsCount: data?.length || 0 });
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(
          `Erro de conectividade: ${err?.message || "Erro desconhecido"}`
        );
      }
    };

    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-yellow-400";
      case "connected":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return "⏳";
      case "connected":
        return "✅";
      case "error":
        return "❌";
      default:
        return "❓";
    }
  };

  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">{getStatusIcon()}</span>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {status === "loading" && "Testando conexão..."}
          {status === "connected" && "Supabase conectado"}
          {status === "error" && "Erro de conexão"}
        </span>
      </div>

      {status === "error" && (
        <div className="text-xs text-red-300 bg-red-900/20 rounded p-2 max-w-sm mx-auto">
          {errorMessage}
        </div>
      )}

      {status === "connected" && projectInfo && (
        <div className="text-xs text-green-300">Projeto PAWA BLOGS ativo</div>
      )}
    </div>
  );
}
