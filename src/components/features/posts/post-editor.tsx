"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePost, useUpdatePost } from "@/lib/hooks/use-posts";
import { useAppStore } from "@/lib/stores/app-store";
import { PostFormSimple } from "./post-form-simple";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit3,
  Eye,
  Save,
  Settings,
  Target,
  Calendar,
  FileText,
  Clock,
  TrendingUp,
  User,
  Tag,
  Folder,
} from "lucide-react";

interface PostEditorProps {
  postId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PostEditor({ postId, onSuccess, onCancel }: PostEditorProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <PostFormSimple onSuccess={onSuccess} onCancel={onCancel} />
    </div>
  );
}
