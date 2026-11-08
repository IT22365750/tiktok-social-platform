'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Bell, MessageSquare, User as UserIcon, Settings, Sparkles, Heart } from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const { notifications, conversations, currentUser, users, toggleFollowUser } = useSocialStore();

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems = [
    { label: 'For You', href: '/', icon: Home, badge: null },
    { label: 'Explore', href: '/search', icon: Compass, badge: null },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadNotifications },
    { label: 'Messages', href: '/messages', icon: MessageSquare, badge: unreadMessages },
    { label: 'Profile', href: '/profile', icon: UserIcon, badge: null },
    { label: 'Settings', href: '/settings', icon: Settings, badge: null },
  ];

  const suggestedUsers = users.filter((u) => u.id !== currentUser.id).slice(0, 4);

  return (
    <aside
      className={cn(
        'w-64 xl:w-72 hidden md:flex flex-col justify-between h-[calc(100vh-4.5rem)] sticky top-[4.5rem] p-4 border-r border-zinc-200 dark:border-zinc-800/80 overflow-y-auto select-none bg-white/50 dark:bg-zinc-950/40 backdrop-blur-md',
        className
      )}
    >
      <div className="space-y-6">
        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/10 to-orange-500/10 text-purple-600 dark:text-purple-400 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      'p-2 rounded-xl transition-colors',
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-md shadow-purple-500/20'
                        : 'group-hover:bg-zinc-200/80 dark:group-hover:bg-zinc-800'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500 text-white shadow-sm shadow-orange-500/30">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Suggested Creators */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Suggested Creators
            </span>
          </div>

          <div className="space-y-2.5">
            {suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors"
              >
                <Link href={`/profile?id=${user.id}`} className="flex items-center gap-2.5 min-w-0">
                  <Avatar src={user.avatar} alt={user.name} size="sm" hasStoryRing={user.verified} />
                  <div className="truncate text-left">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-200 truncate hover:text-purple-600">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">@{user.username}</p>
                  </div>
                </Link>

                <button
                  onClick={() => toggleFollowUser(user.id)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer shrink-0',
                    user.isFollowing
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                      : 'bg-purple-600/10 hover:bg-purple-600 text-purple-600 hover:text-white dark:bg-purple-950/60 dark:text-purple-300'
                  )}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Quick Profile Footer */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <Avatar src={currentUser.avatar} alt={currentUser.name} size="md" hasStoryRing />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-zinc-400 truncate">@{currentUser.username}</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-500 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full">
            <Heart className="w-3 h-3 fill-purple-500" />
            <span>2.8M</span>
          </div>
        </Link>
      </div>
    </aside>
  );
};
