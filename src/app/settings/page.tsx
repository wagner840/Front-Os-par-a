"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Configurações" },
  ];

  const tabs = [
    { id: "general", label: "Geral", icon: Settings },
    { id: "profile", label: "Perfil", icon: User },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "backup", label: "Backup", icon: Database },
  ];

  return (
    <DashboardLayout
      title="Configurações"
      description="Gerencie suas preferências e configurações do sistema"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de Navegação */}
        <div className="lg:col-span-1">
          <GlassCard>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-high-contrast">
                Configurações
              </h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                        activeTab === tab.id
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "text-secondary hover:bg-white/5 hover:text-high-contrast"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </GlassCard>
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3">
          <GlassCard>
            <div className="p-6">
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-high-contrast">
                      Configurações Gerais
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Nome do Site
                        </label>
                        <Input
                          defaultValue="PAWA BLOGS"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Descrição
                        </label>
                        <Input
                          defaultValue="Hub de conteúdo sobre saúde e fitness"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          URL do Site
                        </label>
                        <Input
                          defaultValue="https://pawablogs.com"
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-high-contrast">
                      Perfil do Usuário
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Nome Completo
                        </label>
                        <Input
                          defaultValue="Usuário PAWA"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Email
                        </label>
                        <Input
                          defaultValue="user@pawablogs.com"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Bio
                        </label>
                        <textarea
                          className="form-input min-h-[100px] resize-none"
                          defaultValue="Especialista em conteúdo sobre saúde e fitness"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-high-contrast">
                      Configurações de Notificação
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <h4 className="font-medium text-high-contrast">
                            Email de Posts
                          </h4>
                          <p className="text-sm text-secondary">
                            Receber notificações quando novos posts forem
                            publicados
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-primary bg-transparent border-2 border-white/20 rounded focus:ring-primary"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <h4 className="font-medium text-high-contrast">
                            Relatórios Semanais
                          </h4>
                          <p className="text-sm text-secondary">
                            Receber relatórios de performance semanalmente
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-primary bg-transparent border-2 border-white/20 rounded focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-high-contrast">
                      Configurações de Segurança
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Senha Atual
                        </label>
                        <Input type="password" className="form-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Nova Senha
                        </label>
                        <Input type="password" className="form-input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary mb-2">
                          Confirmar Nova Senha
                        </label>
                        <Input type="password" className="form-input" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-high-contrast">
                      Aparência
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <h4 className="font-medium text-high-contrast">
                            Tema
                          </h4>
                          <p className="text-sm text-secondary">
                            Escolha entre modo claro, escuro ou automático
                          </p>
                        </div>
                        <ThemeToggle />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-green-500/20 border border-blue-500/30">
                          <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500 mx-auto mb-2"></div>
                            <p className="text-sm font-medium text-high-contrast">
                              Frutiger Aero
                            </p>
                            <p className="text-xs text-secondary">Tema atual</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-purple-500 mx-auto mb-2"></div>
                            <p className="text-sm font-medium text-high-contrast">
                              Minimalista
                            </p>
                            <p className="text-xs text-secondary">Disponível</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "backup" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-high-contrast">
                      Backup e Exportação
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="font-medium text-high-contrast mb-2">
                          Último Backup
                        </h4>
                        <p className="text-sm text-secondary mb-3">
                          15 de Janeiro, 2024 - 14:30
                        </p>
                        <Button className="btn-secondary">
                          Fazer Backup Agora
                        </Button>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="font-medium text-high-contrast mb-2">
                          Exportar Dados
                        </h4>
                        <p className="text-sm text-secondary mb-3">
                          Baixe todos os seus dados em formato JSON
                        </p>
                        <Button className="btn-secondary">
                          Exportar Dados
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão Salvar */}
              <div className="flex justify-end pt-6 border-t border-white/10">
                <Button onClick={handleSave} className="btn-primary gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
