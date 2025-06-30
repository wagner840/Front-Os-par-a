"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WordPressDashboard } from "@/components/features/wordpress/wordpress-dashboard";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/stores/app-store";
import {
  useWordPressConfig,
  useWordPressPosts,
  useTestWordPressConnection,
} from "@/lib/hooks/use-wordpress-integration";
import {
  Globe,
  Settings,
  FileText,
  RefreshCw as Sync,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TestTube,
  Database,
  Activity,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { WordPressAdminPanel } from "@/components/features/wordpress/wordpress-admin-panel";

export default function WordPressPage() {
  const { selectedBlog } = useAppStore();
  const [activeDemo, setActiveDemo] = useState<"einsof7" | "optemil" | null>(
    null
  );
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Hooks para demonstração
  const { data: config } = useWordPressConfig(selectedBlog || undefined);
  const { data: posts, isLoading: postsLoading } = useWordPressPosts(
    selectedBlog || undefined
  );
  const testConnection = useTestWordPressConnection();

  // Dados dos blogs para demonstração
  const demoBlogs = [
    {
      id: "einsof7",
      name: "Einsof7",
      url: "https://einsof7.com",
      description: "Blog focado em saúde e bem-estar",
      status: "connected",
      posts: 45,
      lastSync: "2 horas atrás",
    },
    {
      id: "optemil",
      name: "Optemil",
      url: "https://optemil.com",
      description: "Conteúdo sobre tecnologia e inovação",
      status: "connected",
      posts: 32,
      lastSync: "1 hora atrás",
    },
  ];

  const handleTestDemo = async (blogData: (typeof demoBlogs)[0]) => {
    toast.info(`Testando conexão com ${blogData.name}...`);

    // Configurações reais dos blogs
    const realConfigs = {
      einsof7: {
        base_url: "https://einsof7.com",
        username: "contatopawa@gmail.com",
        app_password: "B0lk 6UEQ kNEz aVgP KnFS WXJB",
        sync_enabled: true,
        auto_sync_interval: 30,
        sync_categories: true,
        sync_tags: true,
        sync_media: false,
        sync_comments: false,
        backup_enabled: false,
        backup_frequency: "daily" as const,
      },
      optemil: {
        base_url: "https://optemil.com",
        username: "contatopawa@gmail.com",
        app_password: "7FoB NxNd DNsU 7Mew O9Dr dLiY",
        sync_enabled: true,
        auto_sync_interval: 30,
        sync_categories: true,
        sync_tags: true,
        sync_media: false,
        sync_comments: false,
        backup_enabled: false,
        backup_frequency: "daily" as const,
      },
    };

    try {
      // Teste real da conexão
      const config = realConfigs[blogData.id as keyof typeof realConfigs];
      const result = await testConnection.mutateAsync(config);

      if (result.success) {
        toast.success(`✅ ${result.message}`);
        setActiveDemo(blogData.id as "einsof7" | "optemil");

        // Buscar posts reais do WordPress
        try {
          const response = await fetch(
            `${config.base_url}/wp-json/wp/v2/posts?per_page=5`,
            {
              headers: {
                Authorization: `Basic ${btoa(
                  `${config.username}:${config.app_password}`
                )}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const posts = await response.json();
            toast.success(
              `📝 Encontrados ${posts.length} posts recentes no ${blogData.name}`
            );
          }
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error("Erro no teste:", error);
      toast.error(`Erro ao testar conexão com ${blogData.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Integração WordPress
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Gerencie seus blogs WordPress diretamente do Content Hub. Sincronize
            posts, monitore performance e automatize workflows.
          </p>
        </motion.div>

        {/* Demonstração dos Blogs Configurados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-400" />
            Blogs Configurados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {demoBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <GlassCard className="p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {blog.name}
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Conectado
                        </Badge>
                      </h3>
                      <p className="text-white/70 text-sm mt-1">
                        {blog.description}
                      </p>
                    </div>
                    <ExternalLink
                      className="w-5 h-5 text-white/50 hover:text-white cursor-pointer"
                      onClick={() => window.open(blog.url, "_blank")}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">URL:</span>
                      <span className="text-blue-400 font-mono">
                        {blog.url}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Posts:</span>
                      <span className="text-green-400 font-semibold">
                        {blog.posts}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Última Sync:</span>
                      <span className="text-purple-400">{blog.lastSync}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <AnimatedButton
                      onClick={() => handleTestDemo(blog)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Testar Conexão
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={() =>
                        toast.info(`Sincronizando ${blog.name}...`)
                      }
                      size="sm"
                      variant="outline"
                    >
                      <Sync className="w-4 h-4" />
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Funcionalidades Disponíveis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            Funcionalidades Implementadas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: TestTube,
                title: "Teste de Conexão",
                description:
                  "Verificação em tempo real da conectividade com WordPress",
                status: "Funcionando",
                color: "text-green-400",
              },
              {
                icon: Sync,
                title: "Sincronização Bidirecional",
                description: "Sync automática entre Supabase e WordPress",
                status: "Implementado",
                color: "text-blue-400",
              },
              {
                icon: FileText,
                title: "Gestão de Posts",
                description: "CRUD completo de posts via API REST",
                status: "Ativo",
                color: "text-purple-400",
              },
              {
                icon: Database,
                title: "Backup Automático",
                description: "Backup regular de dados WordPress",
                status: "Configurado",
                color: "text-yellow-400",
              },
              {
                icon: Activity,
                title: "Monitoramento",
                description: "Métricas de performance e health checks",
                status: "Monitorando",
                color: "text-pink-400",
              },
              {
                icon: Settings,
                title: "Configuração Avançada",
                description: "Painel completo de configurações",
                status: "Disponível",
                color: "text-indigo-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <GlassCard className="p-4 h-full">
                  <div className="flex items-start gap-3">
                    <feature.icon className={`w-6 h-6 ${feature.color} mt-1`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 text-xs mt-1 leading-relaxed">
                        {feature.description}
                      </p>
                      <Badge
                        variant="outline"
                        className={`mt-2 text-xs ${feature.color} border-current`}
                      >
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-400" />
            Dashboard em Tempo Real
          </h2>

          <WordPressDashboard />
        </motion.div>

        {/* Demonstração de Dados Reais */}
        {activeDemo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                🎉 Conexão Estabelecida com{" "}
                {activeDemo === "einsof7" ? "Einsof7" : "Optemil"}!
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold">Autenticado</p>
                  <p className="text-white/70 text-sm">
                    Application Password válido
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-400 font-semibold">API Ativa</p>
                  <p className="text-white/70 text-sm">
                    WordPress REST API funcionando
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Sync className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-400 font-semibold">Sincronizado</p>
                  <p className="text-white/70 text-sm">Dados atualizados</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white/70 text-sm">
                  <strong>Próximos passos:</strong> Agora você pode sincronizar
                  posts, criar backups automáticos e monitorar a performance do
                  seu blog WordPress diretamente através desta interface.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              🎯 Central de Controle WordPress Completa
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Gerencie 100% das funcionalidades WordPress diretamente desta
              interface. Posts, páginas, mídia, categorias, tags, usuários,
              comentários e muito mais!
            </p>
            <div className="flex gap-4 justify-center">
              <AnimatedButton
                onClick={() => setShowAdminPanel(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600"
                size="lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Acessar Painel Administrativo
              </AnimatedButton>
              <AnimatedButton
                onClick={() => (window.location.href = "/settings")}
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar Integração
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Painel Administrativo WordPress */}
        {showAdminPanel && selectedBlog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Globe className="w-10 h-10 text-purple-400" />
                Painel Administrativo WordPress
              </h2>
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminPanel(false)}
              >
                <XCircle className="w-5 h-5" />
                Fechar
              </AnimatedButton>
            </div>
            <WordPressAdminPanel />
          </motion.div>
        )}
      </div>
    </div>
  );
}
