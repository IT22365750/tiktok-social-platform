'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusSquare, Bell, MessageSquare, User as UserIcon } from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { notifications, conversations } = useSocialStore();
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((total, conversation) => total + (conversation.unreadCount || 0), 0);

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Search', href: '/search', icon: Compass },
    { label: 'Upload', href: null, icon: PlusSquare, upload: true },
    { label: 'Messages', href: '/messages', icon: MessageSquare, badge: unreadMessages },
    { label: 'Activity', href: '/notifications', icon: Bell, badge: unreadNotifications },
    { label: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800/80 px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.href !== null && (
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(`${item.href}/`))
        );
        const className = cn(
          'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl transition-all duration-200',
          item.upload
            ? 'text-white'
            : isActive
              ? 'text-purple-600 dark:text-purple-400 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
        );

        if (item.upload) {
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('toksocial:open-upload'))}
              className={className}
              aria-label="Upload a video"
              title="Upload a video"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-orange-500 shadow-lg shadow-purple-500/25">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] mt-0.5 font-semibold text-zinc-600 dark:text-zinc-300">{item.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href!}
            className={className}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.badge ? `${item.label}, ${item.badge} unread` : item.label}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge ? (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
