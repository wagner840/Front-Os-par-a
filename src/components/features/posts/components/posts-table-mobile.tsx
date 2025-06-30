
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit3, Pause, CheckCircle, Trash2, MoreHorizontal, Calendar, TrendingUp, FileText, Clock } from "lucide-react";
import type { Database } from "@/lib/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

export default function PostsTableMobile({
  posts,
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
  getSeoScoreColor,
  formatNumber,
  formatDate,
  handleView,
  handleEdit,
  handleDeletePost,
  handleToggleStatus,
  onEdit,
  onView,
}) {
  return (
    <div className="lg:hidden max-h-[600px] overflow-y-auto p-4 space-y-4">
      {posts.map((post: Post, index: number) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 space-y-3"
        >
          {/* Header do card */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
                {post.title}
              </h4>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleView(post.id, onView)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleEdit(post.id, onEdit)}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => handleToggleStatus(post.id, post.status)}
                  className="flex items-center gap-2"
                >
                  {post.status === "published" ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Despublicar
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Publicar
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => handleDeletePost(post.id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Métricas do card */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div>
                <Badge
                  variant={getStatusColor(post.status)}
                  className="flex items-center gap-1 w-fit text-xs"
                >
                  {getStatusIcon(post.status) === "CheckCircle" && <CheckCircle className="w-4 h-4" />}
                  {getStatusIcon(post.status) === "Edit3" && <Edit3 className="w-4 h-4" />}
                  {getStatusIcon(post.status) === "Calendar" && <Calendar className="w-4 h-4" />}
                  {getStatusIcon(post.status) === "AlertCircle" && <AlertCircle className="w-4 h-4" />}
                  {getStatusIcon(post.status) === "Pause" && <Pause className="w-4 h-4" />}
                  {getStatusLabel(post.status)}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">Criado:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(post.created_at)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <span className="text-gray-600">SEO:</span>
                <span
                  className={`font-semibold ${getSeoScoreColor(
                    post.seo_score
                  )}`}
                >
                  {post.seo_score || 0}%
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <FileText className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">Palavras:</span>
                <span className="font-medium text-gray-900">
                  {formatNumber(post.word_count)}
                </span>
              </div>
            </div>
          </div>

          {/* Informações extras se disponíveis */}
          {(post.reading_time || post.published_at) && (
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 pt-2 border-t border-white/10">
              {post.reading_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.reading_time} min de leitura
                </div>
              )}
              {post.published_at && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Publicado em {formatDate(post.published_at)}
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
