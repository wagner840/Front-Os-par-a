"use client";

import { useQuickActions } from "@/lib/hooks/use-quick-actions";
import { Zap } from "lucide-react";
import { ActionButtons } from "./components/quick-actions/ActionButtons";
import { CreatePostModal } from "./components/quick-actions/CreatePostModal";
import { AddKeywordModal } from "./components/quick-actions/AddKeywordModal";
import { SelectBlogMessage } from "./components/quick-actions/SelectBlogMessage";

export function QuickActions() {
  const {
    selectedBlog,
    isCreatePostOpen,
    setIsCreatePostOpen,
    isCreateKeywordOpen,
    setIsCreateKeywordOpen,
    postTitle,
    setPostTitle,
    postKeyword,
    setPostKeyword,
    keywordText,
    setKeywordText,
    keywordMsv,
    setKeywordMsv,
    keywordDifficulty,
    setKeywordDifficulty,
    createPostMutation,
    handleCreatePost,
    createKeywordMutation,
    handleCreateKeyword,
    actions,
  } = useQuickActions();

  if (!selectedBlog) {
    return <SelectBlogMessage />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Ações Rápidas</h2>
      </div>

      <ActionButtons actions={actions} />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        postTitle={postTitle}
        setPostTitle={setPostTitle}
        postKeyword={postKeyword}
        setPostKeyword={setPostKeyword}
        handleCreatePost={handleCreatePost}
        isPending={createPostMutation.isPending}
      />

      <AddKeywordModal
        isOpen={isCreateKeywordOpen}
        onOpenChange={setIsCreateKeywordOpen}
        keywordText={keywordText}
        setKeywordText={setKeywordText}
        keywordMsv={keywordMsv}
        setKeywordMsv={setKeywordMsv}
        keywordDifficulty={keywordDifficulty}
        setKeywordDifficulty={setKeywordDifficulty}
        handleCreateKeyword={handleCreateKeyword}
        isPending={createKeywordMutation.isPending}
      />
    </div>
  );
}
