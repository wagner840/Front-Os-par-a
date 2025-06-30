'use client';

import { useWordPressDashboard } from '@/lib/hooks/use-wordpress-dashboard';
import { Globe, Settings } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import WordpressHeader from './components/wordpress-header';
import WordpressStats from './components/wordpress-stats';
import WordpressRecentPosts from './components/wordpress-recent-posts';
import WordpressSystemStatus from './components/wordpress-system-status';
import WordpressQuickActions from './components/wordpress-quick-actions';
import { GlassCard } from '@/components/ui/glass-card';

export function WordPressDashboard() {
  const {
    selectedBlog,
    config,
    configLoading,
    posts,
    categories,
    tags,
    media,
    users,
    stats,
    healthCheck,
    performance,
    isTestingConnection,
    lastConnectionTest,
    syncFromWordPress,
    createBackup,
    fullSync,
    syncCategories,
    syncTags,
    syncMedia,
    handleTestConnection,
  } = useWordPressDashboard();

  if (!selectedBlog) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <Globe className='w-16 h-16 text-white/40 mx-auto mb-4' />
          <p className='text-white/70'>
            Selecione um blog para visualizar o dashboard WordPress
          </p>
        </div>
      </div>
    );
  }

  if (configLoading) {
    return <div>Loading...</div>;
  }

  if (!config) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <Settings className='w-16 h-16 text-white/40 mx-auto mb-4' />
          <p className='text-white/70 mb-4'>
            Configure a integração WordPress primeiro
          </p>
          <AnimatedButton
            onClick={() => (window.location.href = '/settings')}
            className='bg-gradient-to-r from-blue-500 to-purple-600'
          >
            <Settings className='w-4 h-4 mr-2' />
            Configurar Agora
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <WordpressHeader
        config={config}
        stats={stats}
        lastConnectionTest={lastConnectionTest}
        isTestingConnection={isTestingConnection}
        handleTestConnection={handleTestConnection}
      />

      <WordpressStats
        stats={stats}
        categories={categories}
        tags={tags}
        media={media}
        users={users}
      />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <WordpressRecentPosts
          posts={posts}
          syncFromWordPress={syncFromWordPress}
        />
        <WordpressSystemStatus
          healthCheck={healthCheck}
          performance={performance}
          config={config}
          stats={stats}
          createBackup={createBackup}
        />
      </div>

      {performance && <GlassCard className='p-6'>{/* Performance Metrics */}</GlassCard>}

      <WordpressQuickActions
        fullSync={fullSync}
        syncFromWordPress={syncFromWordPress}
        syncCategories={syncCategories}
        syncTags={syncTags}
        syncMedia={syncMedia}
        createBackup={createBackup}
        handleTestConnection={handleTestConnection}
      />
    </div>
  );
}

