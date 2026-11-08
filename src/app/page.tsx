'use client';

import React, { useState } from 'react';
import { useSocialStore } from '@/stores/useSocialStore';
import { PostCard } from '@/components/feed/PostCard';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { EmptyState } from '@/components/ui/EmptyState';
import { PostSkeleton } from '@/components/ui/SkeletonLoader';
import { Flame, Users, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { posts } = useSocialStore();
  const [activeFeedTab, setActiveFeedTab] = useState<'forYou' | 'following'>('forYou');

  const filteredPosts = activeFeedTab === 'forYou' 
    ? posts 
    : posts.filter((p) => p.author.isFollowing);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Feed Filter Tabs */}
      <div className="flex items-center justify-center sticky top-[4.75rem] z-20 py-1">
        <TabSwitcher
          tabs={[
            { id: 'forYou', label: 'For You', icon: <Flame className="w-4 h-4 text-orange-500" /> },
            { id: 'following', label: 'Following', icon: <Users className="w-4 h-4 text-purple-500" /> },
          ]}
          activeTab={activeFeedTab}
          onChange={setActiveFeedTab}
        />
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="w-8 h-8" />}
            title={activeFeedTab === 'following' ? 'No posts from followed creators' : 'No posts available'}
            description={
              activeFeedTab === 'following'
                ? 'Follow some amazing creators from the sidebar or explore feed to see their videos here!'
                : 'Check back soon or upload your own creation!'
            }
            actionLabel="Switch to For You"
            onAction={() => setActiveFeedTab('forYou')}
          />
        ) : (
          filteredPosts.map((post, index) => (
            <PostCard key={post.id} post={post} autoPlay={index === 0} />
          ))
        )}
      </div>
    </div>
  );
}
