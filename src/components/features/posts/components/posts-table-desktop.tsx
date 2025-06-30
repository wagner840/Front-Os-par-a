
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Eye, Edit3, Pause, CheckCircle, Trash2, TrendingUp, FileText } from "lucide-react";
import type { Database } from "@/lib/types/database";

type Post = Database["public"]["Tables"]["content_posts"]["Row"];

export default function PostsTableDesktop({
  posts,
  handleSort,
  getSortIcon,
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
    <div className="hidden lg:block overflow-x-auto max-h-[600px] overflow-y-auto">
      <table className="w-full">
        <thead className="bg-white/50 sticky top-0 z-10">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-700 min-w-[300px]">
              <button
                onClick={() => handleSort("title")}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                Post
                {getSortIcon("title")}
              </button>
            </th>
            <th className="text-left p-4 font-semibold text-gray-700 min-w-[120px]">
              Status
            </th>
            <th className="text-left p-4 font-semibold text-gray-700 min-w-[100px]">
              <button
                onClick={() => handleSort("seo_score")}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                SEO
                {getSortIcon("seo_score")}
              </button>
            </th>
            <th className="text-left p-4 font-semibold text-gray-700 min-w-[100px]">
              <button
                onClick={() => handleSort("word_count")}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                Palavras
                {getSortIcon("word_count")}
              </button>
            </th>
            <th className="text-left p-4 font-semibold text-gray-700 min-w-[120px]">
              <button
                onClick={() => handleSort("created_at")}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                Data
                {getSortIcon("created_at")}
              </button>
            </th>
            <th className="text-left p-4 font-semibold text-gray-700 w-[80px]">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: Post, index: number) => (
            <motion.tr
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="border-b border-white/10 hover:bg-white/20 transition-colors"
            >
              <td className="p-4">
                <div className="max-w-xs">
                  <div className="font-semibold text-gray-900 mb-1 leading-tight line-clamp-2">
                    {post.title}
                  </div>
                </div>
              </td>

              <td className="p-4">
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
              </td>

              <td className="p-4">
                <div className="flex items-center gap-1">
                  <span
                    className={`font-semibold ${getSeoScoreColor(
                      post.seo_score
                    )}`}
                  >
                    {post.seo_score || 0}%
                  </span>
                  {post.seo_score && post.seo_score >= 80 && (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  )}
                </div>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    {formatNumber(post.word_count)}
                  </span>
                  <FileText className="w-3 h-3 text-gray-500" />
                </div>
              </td>

              <td className="p-4">
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">
                    {formatDate(post.created_at)}
                  </div>
                  {post.published_at && (
                    <div className="text-xs text-gray-600">
                      Pub: {formatDate(post.published_at)}
                    </div>
                  )}
                </div>
              </td>

              <td className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
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
                      onClick={() =>
                        handleToggleStatus(post.id, post.status)
                      }
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
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
