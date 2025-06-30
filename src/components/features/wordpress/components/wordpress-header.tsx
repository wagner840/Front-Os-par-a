
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { TestTube, CheckCircle, XCircle, Wifi, WifiOff, RefreshCw as Sync } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function WordpressHeader({ config, stats, lastConnectionTest, isTestingConnection, handleTestConnection }) {

  const getConnectionStatus = () => {
    if (lastConnectionTest) {
      return lastConnectionTest.success
        ? { icon: CheckCircle, color: "text-green-400", label: "Conectado" }
        : { icon: XCircle, color: "text-red-400", label: "Erro" };
    }

    if (!stats) {
      return { icon: WifiOff, color: "text-gray-400", label: "Não testado" };
    }

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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Dashboard WordPress
          </h2>
          <p className="text-white/70">
            Gerencie a integração com {config.base_url}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={
              connectionStatus.label === "Conectado" ? "default" : "destructive"
            }
            className="flex items-center gap-2"
          >
            <connectionStatus.icon
              className={`w-4 h-4 ${connectionStatus.color}`}
            />
            {connectionStatus.label}
          </Badge>

          <AnimatedButton
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            variant="outline"
            size="sm"
          >
            {isTestingConnection ? (
              <Sync className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            Testar Conexão
          </AnimatedButton>
        </div>
      </div>

      {lastConnectionTest && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            lastConnectionTest.success
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          <div className="flex items-start gap-3">
            {lastConnectionTest.success ? (
              <CheckCircle className="w-5 h-5 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium">{lastConnectionTest.message}</p>
              <p className="text-sm opacity-70">
                Testado{" "}
                {formatDistanceToNow(lastConnectionTest.timestamp, {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
