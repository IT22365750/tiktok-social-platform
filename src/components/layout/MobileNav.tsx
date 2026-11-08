'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusSquare, Bell, User as UserIcon } from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { cn } from '@/lib/utils';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { notifications } = useSocialStore();
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Search', href: '/search', icon: Compass },
    { label: 'Activity', href: '/notifications', icon: Bell, badge: unreadNotifications },
    { label: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800/80 px-4 py-2 flex items-center justify-around safe-bottom">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200',
              isActive
                ? 'text-purple-600 dark:text-purple-400 font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            )}
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
    </div>
  );
};
