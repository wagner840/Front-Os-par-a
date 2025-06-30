"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { CheckCircle, Edit, Clock, Trash2, Eye } from "lucide-react";

interface PostCardProps {
  post: any;
  selectedPosts: number[];
  setSelectedPosts: (posts: number[]) => void;
  handleStatusChange: (postId: number, status: string) => void;
}

export function PostCard({
  post,
  selectedPosts,
  setSelectedPosts,
  handleStatusChange,
}: PostCardProps) {
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <GlassCard className="p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selectedPosts.includes(post.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPosts([...selectedPosts, post.id]);
              } else {
                setSelectedPosts(selectedPosts.filter((id) => id !== post.id));
              }
            }}
            className="mt-1"
          />

          <div className="flex-1 space-y-3">
            <div>
              <h3
                className="font-semibold text-white line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: post.title.rendered,
                }}
              />
              <p
                className="text-white/60 text-sm mt-1 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: post.excerpt.rendered,
                }}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={
                  post.status === "publish"
                    ? "default"
                    : post.status === "draft"
                    ? "secondary"
                    : post.status === "future"
                    ? "outline"
                    : "destructive"
                }
              >
                {post.status === "publish" && (
                  <CheckCircle className="w-3 h-3 mr-1" />
                )}
                {post.status === "draft" && <Edit className="w-3 h-3 mr-1" />}
                {post.status === "future" && <Clock className="w-3 h-3 mr-1" />}
                {post.status === "trash" && <Trash2 className="w-3 h-3 mr-1" />}
                {post.status}
              </Badge>

              <span className="text-white/40 text-xs">
                {new Date(post.date).toLocaleDateString("pt-BR")}
              </span>
            </div>

            <div className="flex gap-2">
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={() => window.open(post.link, "_blank")}
              >
                <Eye className="w-4 h-4" />
              </AnimatedButton>

              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  /* Abrir editor */
                }}
              >
                <Edit className="w-4 h-4" />
              </AnimatedButton>

              <select
                value={post.status}
                onChange={(e) => handleStatusChange(post.id, e.target.value)}
                className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
              >
                <option value="publish">Publicado</option>
                <option value="draft">Rascunho</option>
                <option value="future">Agendado</option>
                <option value="pending">Pendente</option>
                <option value="private">Privado</option>
                <option value="trash">Lixeira</option>
              </select>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
