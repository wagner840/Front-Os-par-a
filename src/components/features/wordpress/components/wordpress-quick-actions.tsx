import { AnimatedButton } from "@/components/ui/animated-button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  RefreshCw,
  FileText,
  Tags,
  Image,
  HardDrive,
  TestTube,
  BarChart3,
  Settings,
  Sparkles,
  RefreshCw as Sync,
} from "lucide-react";

interface WordpressQuickActionsProps {
  fullSync?: any;
  syncFromWordPress?: any;
  syncCategories?: any;
  syncTags?: any;
  syncMedia?: any;
  createBackup?: any;
  handleTestConnection?: () => void;
}

export default function WordpressQuickActions({
  fullSync,
  syncFromWordPress,
  syncCategories,
  syncTags,
  syncMedia,
  createBackup,
  handleTestConnection,
}: WordpressQuickActionsProps) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Ações Rápidas</h3>
        <Sparkles className="w-5 h-5 text-purple-400" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedButton
          onClick={() => fullSync?.mutate?.()}
          disabled={fullSync?.isPending}
          variant="secondary"
          className="flex flex-col items-center gap-2 h-20"
        >
          {fullSync?.isPending ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <Sync className="w-6 h-6" />
          )}
          <span className="text-sm">Sync Completo</span>
        </AnimatedButton>

        <AnimatedButton
          onClick={() => syncFromWordPress?.mutate?.()}
          disabled={syncFromWordPress?.isPending}
          variant="secondary"
          className="flex flex-col items-center gap-2 h-20"
        >
          {syncFromWordPress?.isPending ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <FileText className="w-6 h-6" />
          )}
          <span className="text-sm">Sync Posts</span>
        </AnimatedButton>

        <AnimatedButton
          onClick={() => syncCategories?.mutate?.()}
          disabled={syncCategories?.isPending}
          variant="secondary"
          className="flex flex-col items-center gap-2 h-20"
        >
          {syncCategories?.isPending ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <Tags className="w-6 h-6" />
          )}
          <span className="text-sm">Sync Categorias</span>
        </AnimatedButton>

        <AnimatedButton
          onClick={() => syncTags?.mutate?.()}
          disabled={syncTags?.isPending}
          variant="secondary"
          className="flex flex-col items-center gap-2 h-20"
        >
          {syncTags?.isPending ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <Tags className="w-6 h-6" />
          )}
          <span className="text-sm">Sync Tags</span>
        </AnimatedButton>

        <AnimatedButton
          onClick={() => syncMedia?.mutate?.()}
          disabled={syncMedia?.isPending}
          variant="secondary"
          className="flex flex-col items-center gap-2 h-20"
        >
          {syncMedia?.isPending ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <Image className="w-6 h-6" />
          )}
          <span className="text-sm">Sync Mídia</span>
        </AnimatedButton>

        <AnimatedButton
          onClick={() => createBackup?.mutate?.()}
          disabled={createBackup?.isPending}
          variant="secondary"
          className="flex flex-col items-center gap-2 h-20"
        >
          {createBackup?.isPending ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <HardDrive className="w-6 h-6" />
          )}
          <span className="text-sm">Backup</span>
        </AnimatedButton>

        <AnimatedButton
          onClick={handleTestConnection}
          variant="secondary"
          className="flex flex-col items-center gap-2 h-20"
        >
          <TestTube className="w-6 h-6" />
          <span className="text-sm">Testar Conexão</span>
        </AnimatedButton>

        <AnimatedButton
          variant="secondary"
          className="flex flex-col items-center gap-2 h-20"
          onClick={() => {
            // Placeholder para relatórios
            console.log("Abrir relatórios");
          }}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-sm">Relatórios</span>
        </AnimatedButton>

        <AnimatedButton
          variant="secondary"
          className="flex flex-col items-center gap-2 h-20"
          onClick={() => {
            // Placeholder para configurações
            console.log("Abrir configurações");
          }}
        >
          <Settings className="w-6 h-6" />
          <span className="text-sm">Configurar</span>
        </AnimatedButton>
      </div>
    </GlassCard>
  );
}
