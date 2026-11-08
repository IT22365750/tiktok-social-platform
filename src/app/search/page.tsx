'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Users, Hash, Video, Sparkles, Flame, Check } from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { SearchInput } from '@/components/ui/SearchInput';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCompactNumber } from '@/lib/utils';

export default function SearchPage() {
  const { users, posts, searchQuery, setSearchQuery, toggleFollowUser } = useSocialStore();
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'videos' | 'hashtags'>('all');

  const query = searchQuery.toLowerCase().trim();

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (!query) return true;
    return (
      u.name.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.bio?.toLowerCase().includes(query) ||
      u.category?.toLowerCase().includes(query)
    );
  });

  // Filtered Posts / Videos
  const filteredPosts = posts.filter((p) => {
    if (!query) return true;
    return (
      p.caption.toLowerCase().includes(query) ||
      p.author.name.toLowerCase().includes(query) ||
      p.author.username.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  // Extract all unique hashtags
  const allHashtags = Array.from(
    new Set(posts.flatMap((p) => p.tags))
  ).map((tag) => {
    const count = posts.filter((p) => p.tags.includes(tag)).length;
    return { tag, count };
  });

  const filteredHashtags = allHashtags.filter(({ tag }) =>
    !query ? true : tag.toLowerCase().includes(query)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <SearchIcon className="w-6 h-6 text-purple-500" />
            Explore & Discover
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Search top creators, trending sounds, viral hashtags, and dynamic videos.
          </p>
        </div>

        {/* Search input with tags suggestion */}
        <div className="space-y-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Type creators, tags like #dance, #foodtok, #tech..."
          />

          {/* Quick Trending Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-zinc-400 shrink-0 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" /> Trending:
            </span>
            {['dance', 'chef', 'cyberpunk', 'dolomites', 'fitness', 'paris'].map((chip) => (
              <button
                key={chip}
                onClick={() => setSearchQuery(chip)}
                className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-purple-100 dark:hover:bg-purple-950/60 hover:text-purple-600 dark:hover:text-purple-300 font-medium transition-colors shrink-0"
              >
                #{chip}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="pt-2">
          <TabSwitcher
            tabs={[
              { id: 'all', label: 'Top Results' },
              { id: 'users', label: 'Creators', count: filteredUsers.length },
              { id: 'videos', label: 'Videos', count: filteredPosts.length },
              { id: 'hashtags', label: 'Hashtags', count: filteredHashtags.length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Results Container */}
      <div className="space-y-8">
        {/* USERS SECTION */}
        {(activeTab === 'all' || activeTab === 'users') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" /> Creators
              </h2>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-400 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                No creators matched your search query.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="p-4 flex items-center justify-between gap-3" hoverEffect>
                    <Link href={`/profile?id=${user.id}`} className="flex items-center gap-3 min-w-0">
                      <Avatar src={user.avatar} alt={user.name} size="lg" hasStoryRing={user.verified} />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate hover:text-purple-500">
                            {user.name}
                          </p>
                          {user.verified && (
                            <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[8px] font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 truncate">@{user.username}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {formatCompactNumber(user.followersCount)} followers • {formatCompactNumber(user.likesCount)} likes
                        </p>
                      </div>
                    </Link>

                    {user.id !== 'current_user' && (
                      <Button
                        onClick={() => toggleFollowUser(user.id)}
                        variant={user.isFollowing ? 'ghost' : 'gradient'}
                        size="sm"
                        className="rounded-full shrink-0"
                      >
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIDEOS SECTION */}
        {(activeTab === 'all' || activeTab === 'videos') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Video className="w-4 h-4 text-orange-500" /> Videos
              </h2>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-400 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                No videos found matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/?post=${post.id}`}
                    className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm block"
                  >
                    <img
                      src={post.thumbnailUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                      <div className="flex items-center justify-end">
                        <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
                          ▶ {formatCompactNumber(post.likesCount)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white line-clamp-2 leading-snug drop-shadow-md">
                          {post.caption}
                        </p>
                        <p className="text-[10px] text-zinc-300 mt-1 truncate">
                          @{post.author.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HASHTAGS SECTION */}
        {(activeTab === 'all' || activeTab === 'hashtags') && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-500" /> Hashtags
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredHashtags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    setActiveTab('videos');
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      #
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600">
                        #{tag}
                      </p>
                      <p className="text-[10px] text-zinc-400">{count} {count === 1 ? 'video' : 'videos'}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
