import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  hasStoryRing?: boolean;
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  className,
  hasStoryRing = false,
  isOnline = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const initial = alt ? alt.charAt(0).toUpperCase() : 'U';

  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0', className)}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden transition-all duration-300',
          sizeMap[size],
          hasStoryRing && 'p-[2px] bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600'
        )}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-semibold select-none border border-white/20 dark:border-black/20">
          {src && !imgError ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
      )}
    </div>
  );
};
