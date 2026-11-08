'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useSocialStore } from '@/stores/useSocialStore';
import { cn } from '@/lib/utils';
import { ThemeMode } from '@/types';

export const ThemeToggle: React.FC<{ className?: string; compact?: boolean }> = ({
  className,
  compact = false,
}) => {
  const { settings, setTheme } = useSocialStore();

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-orange-500" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-purple-400" /> },
    { mode: 'system', label: 'System', icon: <Monitor className="w-4 h-4 text-zinc-400" /> },
  ];

  if (compact) {
    const isDark = settings.theme === 'dark';
    return (
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn(
          'p-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 active:scale-90',
          className
        )}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        aria-label="Toggle theme"
      >
        {isDark ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-orange-500" />}
      </button>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/50',
        className
      )}
    >
      {options.map((opt) => {
        const isActive = settings.theme === opt.mode;
        return (
          <button
            key={opt.mode}
            onClick={() => setTheme(opt.mode)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
              isActive
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm shadow-purple-500/10'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            )}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
