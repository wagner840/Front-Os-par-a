"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardOverview } from "@/components/features/dashboard/dashboard-overview";
import { TestSupabase } from "@/components/test-supabase";
import { GlassCard } from "@/components/ui/glass-card";
import { useSupabase } from "@/lib/hooks/use-supabase";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function HomePage() {
  const { isOfflineMode } = useSupabase();
  const [cssTestPassed, setCssTestPassed] = useState(false);

  // Teste de CSS no cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Verificar se as classes CSS estão sendo aplicadas corretamente
      const testElement = document.createElement("div");
      testElement.className = "glass-card";
      document.body.appendChild(testElement);
      const styles = window.getComputedStyle(testElement);
      const hasGlassEffect =
        styles.backdropFilter !== "none" || styles.background?.includes("rgba");
      setCssTestPassed(hasGlassEffect);
      document.body.removeChild(testElement);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Status Banner */}
        {isOfflineMode && (
          <GlassCard variant="subtle" className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Modo Demonstração</p>
                <p className="text-white/60 text-sm">
                  Usando dados de exemplo. Conecte-se ao Supabase para dados
                  reais.
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Diagnóstico de Sistema */}
        <GlassCard variant="default" className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Status do Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                {cssTestPassed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                )}
                <span className="text-white font-medium">CSS & Design</span>
              </div>
              <p className="text-white/60 text-sm">
                {cssTestPassed
                  ? "Frutiger Aero ativo"
                  : "Carregando estilos..."}
              </p>
            </div>

            <div className="text-center space-y-2">
              <TestSupabase />
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Autenticação</span>
              </div>
              <p className="text-white/60 text-sm">Usuário logado</p>
            </div>
          </div>
        </GlassCard>

        {/* Dashboard Principal */}
        <DashboardOverview />
      </div>
    </DashboardLayout>
  );
}
