'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, UserPlus, Sparkles, Compass } from 'lucide-react';
import { Notification } from '@/types';
import { useSocialStore } from '@/stores/useSocialStore';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { RelativeTime } from '@/components/ui/RelativeTime';

export const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { markNotificationAsRead, deleteNotification } = useSocialStore();

  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-orange-500" />;
      case 'mention':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div
      onClick={() => markNotificationAsRead(notification.id)}
      className={cn(
        'flex items-center justify-between p-4 rounded-2xl transition-all duration-200 cursor-pointer border',
        notification.read
          ? 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800/60 opacity-80 hover:opacity-100'
          : 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/60 dark:border-purple-900/40 shadow-sm'
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative">
          <Link href={`/profile?id=${notification.actor.id}`} onClick={(e) => e.stopPropagation()}>
            <Avatar src={notification.actor.avatar} alt={notification.actor.name} size="md" />
          </Link>
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
            {getIcon()}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
            <Link
              href={`/profile?id=${notification.actor.id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-bold mr-1.5 hover:text-purple-600 transition-colors"
            >
              {notification.actor.name}
            </Link>
            <span className="text-zinc-600 dark:text-zinc-300">{notification.content}</span>
          </p>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            <RelativeTime dateString={notification.createdAt} />
          </span>
        </div>
      </div>

      {notification.targetThumbnail ? (
        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 ml-3 border border-zinc-200 dark:border-zinc-700/60">
          <img
            src={notification.targetThumbnail}
            alt="Target media"
            className="w-full h-full object-cover"
          />
        </div>
      ) : !notification.read ? (
        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 ml-3" />
      ) : null}
    </div>
  );
};
