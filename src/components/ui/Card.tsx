import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  glass = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-300',
        glass
          ? 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200/80 dark:border-zinc-800/80 shadow-sm'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/90 shadow-sm',
        hoverEffect &&
          'hover:border-purple-500/40 dark:hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
