'use client';

import React from 'react';
import { useSocialStore } from '@/stores/useSocialStore';
import { PostCard } from '@/components/feed/PostCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const { posts } = useSocialStore();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Posts Stream */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="w-8 h-8" />}
            title="No posts available"
            description="Check back soon or upload your own creation!"
          />
        ) : (
          posts.map((post, index) => (
            <PostCard key={post.id} post={post} autoPlay={index === 0} />
          ))
        )}
      </div>
    </div>
  );
}
