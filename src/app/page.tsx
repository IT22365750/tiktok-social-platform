'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSocialStore } from '@/stores/useSocialStore';
import { PostCard } from '@/components/feed/PostCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader2, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { posts } = useSocialStore();
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || isLoading) return;
        setIsLoading(true);
        window.setTimeout(() => {
          setVisibleCount((count) => Math.min(count + 4, posts.length));
          setIsLoading(false);
        }, 450);
      },
      { rootMargin: '320px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, posts.length]);

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
          visiblePosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
            >
              <PostCard post={post} autoPlay={index === 0} />
            </motion.div>
          ))
        )}
      </div>
      {hasMore ? (
        <div ref={loadMoreRef} className="flex min-h-16 items-center justify-center text-xs text-zinc-400">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-purple-500" /> Loading more posts...
            </span>
          ) : (
            <span>Scroll for more</span>
          )}
        </div>
      ) : posts.length > 0 ? (
        <p className="py-2 text-center text-xs text-zinc-400">You&apos;re all caught up ✨</p>
      ) : null}
    </div>
  );
}
