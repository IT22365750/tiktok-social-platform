'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabSwitcherProps<T extends string = string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
  variant?: 'pills' | 'underline';
}

export function TabSwitcher<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pills',
}: TabSwitcherProps<T>) {
  if (variant === 'underline') {
    return (
      <div className={cn('flex items-center border-b border-zinc-200 dark:border-zinc-800 w-full', className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors duration-200 cursor-pointer select-none',
                isActive
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-xs rounded-full font-medium',
                    isActive
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  )}
                >
                  {tab.count}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId="underline-active-pill"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/50',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none',
              isActive
                ? 'text-zinc-900 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="pill-active-bg"
                className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200/50 dark:border-zinc-700/40"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 text-[10px] font-bold rounded-full',
                    isActive
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
