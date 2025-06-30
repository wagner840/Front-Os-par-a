
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GlassCard } from "@/components/ui/glass-card";
import { FileText, Eye, Edit, Download, Plus, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function WordpressRecentPosts({ posts, syncFromWordPress }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Posts Recentes</h3>
        <Badge variant="outline" className="bg-blue-500/20 text-blue-300">
          {posts?.length || 0} posts
        </Badge>
      </div>

      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <h4 className="text-white font-medium line-clamp-1">
                  {post.title.rendered}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      post.status === "publish"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    }`}
                  >
                    {post.status === "publish" ? "Publicado" : "Rascunho"}
                  </Badge>
                  <span className="text-white/60 text-xs">
                    {formatDistanceToNow(new Date(post.date), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-1 text-white/60 hover:text-blue-400 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-white/60 hover:text-green-400 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">Nenhum post encontrado</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-6">
        <AnimatedButton
          onClick={syncFromWordPress}
          disabled={syncFromWordPress.isPending}
          variant="secondary"
          className="flex items-center gap-2 flex-1"
        >
          {syncFromWordPress.isPending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Sincronizar
        </AnimatedButton>

        <AnimatedButton
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Post
        </AnimatedButton>
      </div>
    </GlassCard>
  );
}
