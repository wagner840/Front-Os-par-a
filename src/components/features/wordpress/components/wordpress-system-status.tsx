
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Database, Settings, RefreshCw } from "lucide-react";

export default function WordpressSystemStatus({ healthCheck, performance, config, stats, createBackup }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Status do Sistema
        </h3>
        <div className="flex items-center gap-2">
          {healthCheck?.overall_health === "healthy" ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <span
            className={`text-sm font-medium ${
              healthCheck?.overall_health === "healthy"
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {healthCheck?.overall_health === "healthy"
              ? "Saudável"
              : "Com Problemas"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Conexão */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                stats?.connection_status === "connected"
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
            />
            <span className="text-white">Conexão WordPress</span>
          </div>
          <Badge
            variant="outline"
            className={
              stats?.connection_status === "connected"
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : "bg-red-500/20 text-red-300 border-red-500/30"
            }
          >
            {stats?.connection_status === "connected"
              ? "Online"
              : "Offline"}
          </Badge>
        </div>

        {/* Performance */}
        {performance && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-white">Tempo de Resposta</span>
            </div>
            <Badge
              variant="outline"
              className="bg-blue-500/20 text-blue-300 border-blue-500/30"
            >
              {performance.response_time}ms
            </Badge>
          </div>
        )}

        {/* Sincronização */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                config?.sync_enabled ? "bg-green-400" : "bg-gray-400"
              }`}
            />
            <span className="text-white">Sincronização Automática</span>
          </div>
          <Badge
            variant="outline"
            className={
              config?.sync_enabled
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : "bg-gray-500/20 text-gray-300 border-gray-500/30"
            }
          >
            {config?.sync_enabled ? "Ativa" : "Inativa"}
          </Badge>
        </div>

        {/* Backup */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                config?.backup_enabled ? "bg-orange-400" : "bg-gray-400"
              }`}
            />
            <span className="text-white">Backup Automático</span>
          </div>
          <Badge
            variant="outline"
            className={
              config?.backup_enabled
                ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                : "bg-gray-500/20 text-gray-300 border-gray-500/30"
            }
          >
            {config?.backup_enabled ? config.backup_frequency : "Inativo"}
          </Badge>
        </div>
      </div>

      <Separator className="bg-white/10 my-4" />

      <div className="flex gap-2">
        <AnimatedButton
          onClick={createBackup}
          disabled={createBackup.isPending}
          variant="secondary"
          className="flex items-center gap-2 flex-1"
        >
          {createBackup.isPending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Database className="w-4 h-4" />
          )}
          Backup
        </AnimatedButton>

        <AnimatedButton
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Configurar
        </AnimatedButton>
      </div>
    </GlassCard>
  );
}
