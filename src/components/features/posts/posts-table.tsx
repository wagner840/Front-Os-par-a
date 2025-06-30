"use client";

import { usePostsTable } from "@/lib/hooks/use-posts-table";
import { GlassCard } from "@/components/ui/glass-card";
import PostsTableHeader from "./components/posts-table-header";
import PostsTableDesktop from "./components/posts-table-desktop";
import PostsTableMobile from "./components/posts-table-mobile";
import {
  PostsTableLoading,
  PostsTableEmpty,
  PostsTableInfo,
} from "./components/posts-table";
import type { PostFilters } from "@/lib/hooks/use-posts";

interface PostsTableProps {
  initialFilters?: PostFilters;
  onEdit?: (postId: string) => void;
  onView?: (postId: string) => void;
}

export function PostsTable({
  initialFilters,
  onEdit,
  onView,
}: PostsTableProps) {
  const {
    selectedBlog,
    showFilters,
    setShowFilters,
    tempFilters,
    setTempFilters,
    posts,
    isLoading,
    refetch,
    handleApplyFilters,
    handleClearFilters,
    handleQuickSearch,
    getActiveFiltersCount,
    handleSort,
    getStatusIcon,
    getStatusColor,
    getSeoScoreColor,
    formatDate,
    formatNumber,
    getStatusLabel,
    getSortIcon,
    handleEdit,
    handleView,
    handleDeletePost,
    handleToggleStatus,
  } = usePostsTable(initialFilters);

  const handleEditPost = onEdit || handleEdit;
  const handleViewPost = onView || handleView;

  if (isLoading) {
    return <PostsTableLoading />;
  }

  return (
    <div className="space-y-4">
      <PostsTableHeader
        tempFilters={tempFilters}
        handleQuickSearch={handleQuickSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        getActiveFiltersCount={getActiveFiltersCount}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearFilters}
        refetch={refetch}
        setTempFilters={setTempFilters}
      />

      <GlassCard className="overflow-hidden">
        <PostsTableInfo
          postCount={posts?.length || 0}
          isBlogSelected={!!selectedBlog}
        />

        {!posts || posts.length === 0 ? (
          <PostsTableEmpty hasActiveFilters={getActiveFiltersCount() > 0} />
        ) : (
          <>
            <PostsTableDesktop
              posts={posts}
              handleSort={handleSort}
              getSortIcon={getSortIcon}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              getStatusLabel={getStatusLabel}
              getSeoScoreColor={getSeoScoreColor}
              formatNumber={formatNumber}
              formatDate={formatDate}
              handleView={handleViewPost}
              handleEdit={handleEditPost}
              handleDeletePost={handleDeletePost}
              handleToggleStatus={handleToggleStatus}
            />

            <PostsTableMobile
              posts={posts}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              getStatusLabel={getStatusLabel}
              getSeoScoreColor={getSeoScoreColor}
              formatNumber={formatNumber}
              formatDate={formatDate}
              handleView={handleViewPost}
              handleEdit={handleEditPost}
              handleDeletePost={handleDeletePost}
              handleToggleStatus={handleToggleStatus}
            />
          </>
        )}
      </GlassCard>
    </div>
  );
}
