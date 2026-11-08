import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white/50 dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-800',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="gradient" size="sm" className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
