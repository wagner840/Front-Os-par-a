
import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { FileText, CheckCircle, Tags, Image, Users, TrendingUp } from "lucide-react";

export default function WordpressStats({ stats, categories, tags, media, users }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Posts WordPress</p>
            <p className="text-2xl font-bold text-white">
              {stats?.wordpress_posts || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">Atualizado</span>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Sincronizados</p>
            <p className="text-2xl font-bold text-white">
              {stats?.synced_posts || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="mt-4">
          <Progress
            value={
              stats ? (stats.synced_posts / stats.supabase_posts) * 100 : 0
            }
            className="h-2"
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Categorias</p>
            <p className="text-2xl font-bold text-white">
              {categories?.length || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Tags className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Tags className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-sm">
            {tags?.length || 0} tags
          </span>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Mídia</p>
            <p className="text-2xl font-bold text-white">
              {media?.length || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Image className="w-6 h-6 text-orange-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-sm">
            {users?.length || 0} usuários
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
