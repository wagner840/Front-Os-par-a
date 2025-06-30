"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { FileText, CheckCircle, Edit, Clock } from "lucide-react";

interface AdminPanelHeaderProps {
  posts?: any[];
}

export function AdminPanelHeader({ posts = [] }: AdminPanelHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Total Posts</p>
            <p className="text-2xl font-bold text-white">{posts.length || 0}</p>
          </div>
          <FileText className="w-8 h-8 text-blue-400" />
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Publicados</p>
            <p className="text-2xl font-bold text-green-400">
              {posts.filter((p) => p.status === "publish").length || 0}
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Rascunhos</p>
            <p className="text-2xl font-bold text-yellow-400">
              {posts.filter((p) => p.status === "draft").length || 0}
            </p>
          </div>
          <Edit className="w-8 h-8 text-yellow-400" />
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Agendados</p>
            <p className="text-2xl font-bold text-purple-400">
              {posts.filter((p) => p.status === "future").length || 0}
            </p>
          </div>
          <Clock className="w-8 h-8 text-purple-400" />
        </div>
      </GlassCard>
    </motion.div>
  );
}
