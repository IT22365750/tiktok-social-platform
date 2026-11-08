'use client';

import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Heart, MessageCircle, UserPlus, Filter } from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { TabSwitcher } from '@/components/ui/TabSwitcher';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { notifications, markAllNotificationsAsRead } = useSocialStore();
  const [filter, setFilter] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'likes') return n.type === 'like';
    if (filter === 'comments') return n.type === 'comment' || n.type === 'mention';
    if (filter === 'follows') return n.type === 'follow';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    toast.success('All notifications marked as read! ✔️');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-purple-600" /> Notifications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Stay updated with likes, comments, mentions and creator milestones.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button onClick={handleMarkAllRead} variant="outline" size="sm" className="rounded-full self-start sm:self-auto">
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark all read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div>
        <TabSwitcher
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'likes', label: 'Likes', icon: <Heart className="w-3.5 h-3.5 text-rose-500" /> },
            { id: 'comments', label: 'Comments', icon: <MessageCircle className="w-3.5 h-3.5 text-purple-500" /> },
            { id: 'follows', label: 'Followers', icon: <UserPlus className="w-3.5 h-3.5 text-orange-500" /> },
          ]}
          activeTab={filter}
          onChange={setFilter}
        />
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-8 h-8" />}
            title="All caught up!"
            description={
              filter === 'all'
                ? "You don't have any notifications right now."
                : `No ${filter} notifications at this moment.`
            }
          />
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} />
          ))
        )}
      </div>
    </div>
  );
}
